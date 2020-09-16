import React, { Component } from 'react';
import { createObservatory, resourcesUrl, getOrganization } from 'network';
import { Redirect } from 'react-router-dom';
import { Container, Button, FormGroup, Input, Label, Alert } from 'reactstrap';
import { toast } from 'react-toastify';
import { reverse } from 'named-urls';
import PropTypes from 'prop-types';
import ROUTES from 'constants/routes';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { openAuthDialog } from 'actions/auth';
import { connect } from 'react-redux';
import AutoComplete from 'components/Autocomplete/Autocomplete';

class AddObservatory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            value: '',
            description: '',
            observatoryId: '',
            researchField: '',
            organizationName: ''
        };
    }

    componentDidMount() {
        this.getOrganization(this.props.match.params.id);
    }

    createNewObservatory = async () => {
        this.setState({ editorState: 'loading' });
        const value = this.state.value;
        const description = this.state.description;
        const researchField = this.state.researchField.label;

        if (value && value.length !== 0 && description && description.length !== 0 && researchField && researchField !== 0) {
            try {
                const observatory = await createObservatory(value, this.props.match.params.id, description, researchField);
                this.navigateToObservatory(observatory.id);
            } catch (error) {
                this.setState({ editorState: 'edit' });
                console.error(error);
                toast.error(`Error creating observatory ${error.message}`);
            }
        } else {
            toast.error(`Please enter an observatory name, description and research field`);
            this.setState({ editorState: 'edit' });
        }
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value.trim() });
    };

    navigateToObservatory = observatoryId => {
        this.setState({ editorState: 'edit', observatoryId: observatoryId }, () => {
            this.setState({ redirect: true });
        });
    };

    getOrganization = id => {
        getOrganization(id).then(organization => {
            document.title = `${organization.name} - ORKG`;
            this.setState({
                organizationName: organization.name
            });
        });
    };

    render() {
        const loading = this.state.editorState === 'loading';
        if (this.state.redirect) {
            this.setState({
                redirect: false,
                value: '',
                observatoryId: ''
            });

            return <Redirect to={reverse(ROUTES.OBSERVATORY, { id: this.state.observatoryId })} />;
        }

        return (
            <>
                <Container className="d-flex align-items-center">
                    <h3 className="h4 my-4 flex-grow-1">Create an Observatory in {this.state.organizationName}</h3>
                </Container>

                <Container className="box rounded pt-4 pb-4 pl-5 pr-5">
                    {this.props.user ? (
                        <div className="pl-3 pr-3 pt-2">
                            {this.state.errors && <Alert color="danger">{this.state.errors}</Alert>}
                            <FormGroup>
                                <Label for="ObservatoryLabel">Observatory name</Label>
                                <Input
                                    onChange={this.handleChange}
                                    type="text"
                                    name="value"
                                    id="ObservatoryLabel"
                                    disabled={loading}
                                    placeholder="Observatory name"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="ObservatoryResearchField">Research Field</Label>
                                <AutoComplete
                                    requestUrl={resourcesUrl}
                                    optionsClass="ResearchField"
                                    placeholder="Observatory research field"
                                    onItemSelected={async rf => {
                                        this.setState({ researchField: { ...rf, label: rf.value } });
                                    }}
                                    value={this.state.researchField}
                                    allowCreate={false}
                                    autoLoadOption={true}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="ObservatoryDescription">Observatory description</Label>
                                <Input
                                    onChange={this.handleChange}
                                    type="textarea"
                                    name="description"
                                    id="ObservatoryDescription"
                                    disabled={loading}
                                    placeholder="Observatory description"
                                />
                            </FormGroup>
                            <Button color="primary" onClick={this.createNewObservatory} outline className="mt-4 mb-2" block disabled={loading}>
                                {!loading ? 'Create Observatory' : <span>Loading</span>}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Button color="link" className="p-0 mb-2 mt-2 clearfix" onClick={() => this.props.openAuthDialog('signin')}>
                                <Icon className="mr-1" icon={faUser} /> Sign in to create an observatory
                            </Button>
                        </>
                    )}
                </Container>
            </>
        );
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
    openAuthDialog: action => dispatch(openAuthDialog(action))
});

AddObservatory.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    openAuthDialog: PropTypes.func.isRequired,
    user: PropTypes.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddObservatory);
