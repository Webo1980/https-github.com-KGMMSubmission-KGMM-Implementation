import { faPlusCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { loadContributions, removeContributions } from 'actions/bulkContributionEditor';
import CreateProperty from 'components/BulkContributionEditor/CreateProperty';
import EditorTable from 'components/BulkContributionEditor/EditorTable';
import useBulkContributionEditor from 'components/BulkContributionEditor/hooks/useBulkContributionEditor';
import TableLoadingIndicator from 'components/BulkContributionEditor/TableLoadingIndicator';
import AddContribution from 'components/Comparison/AddContribution/AddContribution';
import TableScrollContainer from 'components/Comparison/TableScrollContainer';
import CreateContributionModal from 'components/CreateContributionModal/CreateContributionModal';
import CreatePaperModal from 'components/CreatePaperModal/CreatePaperModal';
import routes from 'constants/routes';
import { reverse } from 'named-urls';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, ButtonGroup, Container } from 'reactstrap';

const BulkContributionEditor = () => {
    const [isOpenAddContribution, setIsOpenAddContribution] = useState(false);
    const [isOpenCreateContribution, setIsOpenCreateContribution] = useState(false);
    const [isOpenCreatePaper, setIsOpenCreatePaper] = useState(false);
    const [createContributionPaperId, setCreateContributionPaperId] = useState(null);
    const { getContributionIds, handleAddContributions } = useBulkContributionEditor();
    const contributions = useSelector(state => state.bulkContributionEditor.contributions);
    const isLoading = useSelector(state => state.bulkContributionEditor.isLoading);
    const dispatch = useDispatch();
    const contributionIds = getContributionIds();

    useEffect(() => {
        document.title = 'Bulk contribution editor - ORKG';
    }, []);

    // handle changes of the query string param 'contributions'
    useEffect(() => {
        // check if new contributions should be loaded
        const contributionIdsToLoad = contributionIds.filter(id => !(id in contributions));
        if (contributionIdsToLoad.length) {
            dispatch(loadContributions(contributionIdsToLoad));
        }

        // check if contributions are removed
        const contributionIdsToRemove = Object.keys(contributions).filter(id => !contributionIds.includes(id));
        if (contributionIdsToRemove.length) {
            dispatch(removeContributions(contributionIdsToRemove));
        }
    }, [contributionIds, contributions, dispatch]);

    const handleOpenCreateContributionModal = paperId => {
        setIsOpenAddContribution(false);
        setCreateContributionPaperId(paperId);
        setIsOpenCreateContribution(true);
    };

    const handleOpenCreatePaperModal = () => {
        setIsOpenAddContribution(false);
        setIsOpenCreatePaper(true);
    };

    const handleCreateContribution = id => {
        handleAddContributions([id]);
        setIsOpenCreateContribution(false);
    };

    const handleCreatePaper = contributionId => {
        handleAddContributions([contributionId]);
        setIsOpenCreatePaper(false);
    };

    const contributionAmount = contributionIds.length;
    const containerStyle = { maxWidth: contributionAmount > 3 ? 'fit-content' : undefined };

    // if is loading and there are no contributions in the store, it means it is loading for the first time
    const isLoadingInit = Object.keys(contributions).length === 0 && isLoading;

    return (
        <>
            <Container className="d-flex align-items-center">
                <div className="d-flex mt-4 mb-4 align-items-center flex-grow-1">
                    <h1 className="h4 m-0">Bulk contribution editor</h1>
                </div>
                <ButtonGroup>
                    <Button
                        tag={Link}
                        to={`${reverse(routes.COMPARISON)}?contributions=${contributionIds.join(',')}`}
                        color="darkblue"
                        size="sm"
                        style={{ marginRight: 2 }}
                        disabled={contributionAmount < 2}
                    >
                        Make comparison
                    </Button>

                    <Button color="darkblue" size="sm" onClick={() => setIsOpenAddContribution(true)}>
                        <Icon icon={faPlusCircle} /> Add contribution
                    </Button>
                </ButtonGroup>
            </Container>
            <Container className="box rounded p-4" style={containerStyle}>
                {contributionAmount === 0 && (
                    <Alert color="info">
                        Start adding contributions by clicking the button <em>Add contribution</em> on the right
                    </Alert>
                )}

                {isLoadingInit && <TableLoadingIndicator contributionAmount={contributionAmount} />}

                {!isLoadingInit && contributionAmount > 0 && (
                    <>
                        <TableScrollContainer className="bulk-editor">
                            <EditorTable />
                        </TableScrollContainer>

                        <CreateProperty />
                    </>
                )}
            </Container>

            {isOpenAddContribution && (
                <AddContribution
                    allowCreate
                    showDialog
                    toggle={() => setIsOpenAddContribution(v => !v)}
                    onAddContributions={handleAddContributions}
                    onCreateContribution={handleOpenCreateContributionModal}
                    onCreatePaper={handleOpenCreatePaperModal}
                />
            )}

            {isOpenCreateContribution && (
                <CreateContributionModal
                    isOpen
                    onCreateContribution={handleCreateContribution}
                    toggle={() => setIsOpenCreateContribution(v => !v)}
                    paperId={createContributionPaperId}
                />
            )}

            {isOpenCreatePaper && <CreatePaperModal isOpen onCreatePaper={handleCreatePaper} toggle={() => setIsOpenCreatePaper(v => !v)} />}
        </>
    );
};

export default BulkContributionEditor;
