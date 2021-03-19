import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import comparisonPublishImg from 'assets/img/AddComparison/comparison-publish-preview.png';
import contributionEditorPreview from 'assets/img/AddComparison/contribution-editor-preview.png';
import csvImportPreview from 'assets/img/AddComparison/csv-import-preview.png';
import ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Container, Row } from 'reactstrap';

const AddComparison = () => {
    document.title = 'Add comparison - Open Research Knowledge Graph';

    return (
        <div>
            <Container>
                <h1 className="h4 mt-4 mb-4">Add comparison</h1>
            </Container>
            <Container className="box rounded pt-4 pb-4 pl-5 pr-5">
                <Alert color="info" fade={false}>
                    Comparisons in ORKG provide an overview of state-of-the-art literature for a particular topic. Comparisons are dynamic and FAIR. A
                    comparison is created from contributions,{' '}
                    <a href="https://www.orkg.org/orkg/comparison/R44930" target="_blank" rel="noreferrer">
                        view example of comparison <Icon icon={faExternalLinkAlt} />
                    </a>
                    . To create your own comparisons in ORKG, you can either import existing data (via CSV import) or start from scratch by adding
                    your own contributions. This page guides you in creating new comparisons.
                </Alert>
                <Row className="mt-5">
                    <Col className="border-right">
                        <h2 className="h4">1. Existing data</h2>
                        <div className="d-flex justify-content-center" style={{ minHeight: 160 }}>
                            <img src={csvImportPreview} alt="Preview of CSV import" style={{ width: '60%' }} className="align-self-center" />
                        </div>
                        <p>
                            In case you have existing data, you can import this via the CSV import tool. This is especially helpful if you already
                            have a large file in which related work is compared.{' '}
                        </p>
                        <Button color="primary" tag={Link} to={ROUTES.CSV_IMPORT}>
                            Go to CSV import tool
                        </Button>
                    </Col>
                    <Col className="border-right">
                        <h2 className="h4">2. Contribution editor</h2>
                        <div className="d-flex justify-content-center" style={{ minHeight: 160 }}>
                            <img
                                src={contributionEditorPreview}
                                alt="Preview of contribution editor"
                                style={{ width: '50%' }}
                                className="align-self-center"
                            />
                        </div>
                        <p>
                            If you don’t have existing data, go to the contribution editor to add contributions that will be used in the comparison.
                            After creating contributions, you can create a comparisons.
                        </p>
                        <Button color="primary" tag={Link} to={ROUTES.CONTRIBUTION_EDITOR}>
                            Go to contribution editor
                        </Button>
                    </Col>
                    <Col>
                        <h2 className="h4">3. Publish comparison</h2>
                        <div className="d-flex justify-content-center" style={{ minHeight: 160 }}>
                            <img
                                src={comparisonPublishImg}
                                alt="Preview of published comparison"
                                style={{ width: '60%' }}
                                className="align-self-center"
                            />
                        </div>
                        <p>
                            Once you are done editing contributions, you can create and publish a comparison. Published comparisons are persistent so
                            they are perfectly suitable for publications.
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AddComparison;
