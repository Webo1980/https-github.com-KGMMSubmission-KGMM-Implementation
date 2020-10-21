import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, FormGroup, Label, FormText } from 'reactstrap';
import { classesUrl, getClassById } from 'services/backend/classes';
import { updateResourceClasses as updateResourceClassesNetwork } from 'services/backend/resources';
import { getResource } from 'services/backend/resources';
import { getStatementsBySubjectAndPredicate } from 'services/backend/statements';
import StatementBrowser from 'components/StatementBrowser/Statements/StatementsContainer';
import { EditModeHeader, Title } from 'pages/ViewPaper';
import AutoComplete from 'components/Autocomplete/Autocomplete';
import InternalServerError from 'pages/InternalServerError';
import SameAsStatements from '../SameAsStatements';
import EditableHeader from 'components/EditableHeader';
import ObjectStatements from 'components/ObjectStatements/ObjectStatements';
import RequireAuthentication from 'components/RequireAuthentication/RequireAuthentication';
import NotFound from 'pages/NotFound';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { reverse } from 'named-urls';
import Tippy from '@tippy.js/react';
import ROUTES from 'constants/routes.js';
import { connect } from 'react-redux';
import { resetStatementBrowser } from 'actions/statementBrowser';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Confirm from 'components/ConfirmationModal/ConfirmationModal';
import { CLASSES, PREDICATES } from 'constants/graphSettings';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';

function Resource(props) {
    const location = useLocation();
    const [error, setError] = useState(null);
    const [label, setLabel] = useState('');
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const classesAutocompleteRef = useRef(null);

    useEffect(() => {
        const findResource = async () => {
            setIsLoading(true);
            getResource(props.match.params.id)
                .then(responseJson => {
                    document.title = `${responseJson.label} - Resource - ORKG`;
                    const classesCalls = responseJson.classes.map(classResource => getClassById(classResource));
                    Promise.all(classesCalls)
                        .then(classes => {
                            classes = orderBy(classes, [classLabel => classLabel.label.toLowerCase()], ['asc']);
                            setLabel(responseJson.label);
                            setClasses(classes);
                        })
                        .then(() => {
                            if (responseJson.classes.includes(CLASSES.COMPARISON)) {
                                getStatementsBySubjectAndPredicate({ subjectId: props.match.params.id, predicateId: PREDICATES.HAS_DOI }).then(st => {
                                    if (st.length > 0) {
                                        setIsLoading(false);
                                        setCanEdit(false);
                                    } else {
                                        setIsLoading(false);
                                        setCanEdit(true);
                                    }
                                });
                            } else {
                                setIsLoading(false);
                                setCanEdit(true);
                            }
                        });
                })
                .catch(err => {
                    console.error(err);
                    setLabel(null);
                    setError(err);
                    setIsLoading(false);
                });
        };
        findResource();
    }, [location, props.match.params.id]);

    const handleClassSelect = async (selected, action) => {
        if (action.action === 'create-option') {
            const foundIndex = selected.findIndex(x => x.__isNew__);
            const newClass = await Confirm({
                label: selected[foundIndex].label
            });
            if (newClass) {
                const foundIndex = selected.findIndex(x => x.__isNew__);
                selected[foundIndex] = newClass;
            } else {
                return null;
            }
        }
        const newClasses = !selected ? [] : selected;
        // Reset the statement browser and rely on React attribute 'key' to reinitialize the statement browser
        // (When a key changes, React will create a new component instance rather than update the current one)
        props.resetStatementBrowser();
        setClasses(newClasses);
        await updateResourceClassesNetwork(props.match.params.id, newClasses.map(c => c.id));
        toast.success('Resource classes updated successfully');
    };

    const handleHeaderChange = event => {
        setLabel(event.value);
    };

    return (
        <>
            {isLoading && <Container className="box rounded pt-4 pb-4 pl-5 pr-5 mt-5 clearfix">Loading ...</Container>}
            {!isLoading && error && <>{error.statusCode === 404 ? <NotFound /> : <InternalServerError />}</>}
            {!isLoading && !error && (
                <Container className="mt-5 clearfix">
                    {editMode && canEdit && (
                        <EditModeHeader className="box rounded-top">
                            <Title>
                                Edit mode <span className="pl-2">Every change you make is automatically saved</span>
                            </Title>
                            <Button className="float-left" style={{ marginLeft: 1 }} color="light" size="sm" onClick={() => setEditMode(v => !v)}>
                                Stop editing
                            </Button>
                        </EditModeHeader>
                    )}
                    <div className={`box clearfix pt-4 pb-4 pl-5 pr-5 ${editMode ? 'rounded-bottom' : 'rounded'}`}>
                        <div className="mb-2">
                            {!editMode || !canEdit ? (
                                <div className="pb-2 mb-3">
                                    <h3 className="" style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                                        {label || (
                                            <i>
                                                <small>No label</small>
                                            </i>
                                        )}
                                        {canEdit ? (
                                            <RequireAuthentication
                                                component={Button}
                                                className="float-right"
                                                color="darkblue"
                                                size="sm"
                                                onClick={() => setEditMode(v => !v)}
                                            >
                                                <Icon icon={faPen} /> Edit
                                            </RequireAuthentication>
                                        ) : (
                                            <Tippy hideOnClick={false} content="This resource can not be edited because it has a published DOI.">
                                                <div className="float-right">
                                                    <Button color="darkblue" size="sm" disabled={true}>
                                                        <Icon icon={faPen} /> <span>Edit</span>
                                                    </Button>
                                                </div>
                                            </Tippy>
                                        )}
                                    </h3>
                                    {classes.length > 0 && (
                                        <span style={{ fontSize: '90%' }}>
                                            Classes:{' '}
                                            {classes.map((classObject, index) => {
                                                const separator = index < classes.length - 1 ? ', ' : '';

                                                return (
                                                    <i key={index}>
                                                        <Link to={reverse(ROUTES.CLASS, { id: classObject.id })}>{classObject.label}</Link>
                                                        {separator}
                                                    </i>
                                                );
                                            })}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <EditableHeader id={props.match.params.id} value={label} onChange={handleHeaderChange} />
                                    <FormGroup className="mb-4">
                                        <Label>Classes:</Label>
                                        <AutoComplete
                                            requestUrl={classesUrl}
                                            onChange={(selected, action) => {
                                                // blur the field allows to focus and open the menu again
                                                classesAutocompleteRef.current && classesAutocompleteRef.current.blur();
                                                handleClassSelect(selected, action);
                                            }}
                                            placeholder="No Classes"
                                            value={classes}
                                            autoLoadOption={true}
                                            openMenuOnFocus={true}
                                            allowCreate={true}
                                            isClearable
                                            innerRef={classesAutocompleteRef}
                                            isMulti
                                            autoFocus={false}
                                        />
                                        {editMode && <FormText>Specify the classes of the resource.</FormText>}
                                    </FormGroup>
                                </>
                            )}
                        </div>
                        <hr />
                        <h3 className="h5">Statements</h3>
                        <div className="clearfix">
                            <StatementBrowser
                                key={`SB${classes.map(c => c.id).join(',')}`}
                                enableEdit={editMode && canEdit}
                                syncBackend={editMode}
                                openExistingResourcesInDialog={false}
                                initialResourceId={props.match.params.id}
                                initialResourceLabel={label}
                                newStore={true}
                                propertiesAsLinks={true}
                                resourcesAsLinks={true}
                            />

                            <SameAsStatements />
                        </div>
                        <ObjectStatements resourceId={props.match.params.id} />
                    </div>
                </Container>
            )}
        </>
    );
}

Resource.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    resetStatementBrowser: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    resetStatementBrowser: data => dispatch(resetStatementBrowser())
});

export default connect(
    null,
    mapDispatchToProps
)(Resource);
