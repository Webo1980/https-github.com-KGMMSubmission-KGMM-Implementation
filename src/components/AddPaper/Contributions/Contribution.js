import { Component } from 'react';
import { Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import StatementBrowser from 'components/StatementBrowser/StatementBrowser';
import { openTour } from 'actions/addPaper';

import { StyledHorizontalContribution } from './styled';
import PropTypes from 'prop-types';

class Contribution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showVideoDialog: false
        };
    }

    handleLearnMore = step => {
        this.props.openTour(step);
    };

    render() {
        return (
            <StyledHorizontalContribution>
                <Form>
                    {/*<FormGroup>
                        <Label>
                            <Tooltip
                                message={
                                    <span>
                                        Specify the research problems that this contribution addresses.{' '}
                                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.handleLearnMore(0)}>
                                            Learn more
                                        </span>
                                    </span>
                                }
                            >
                                Research problems
                            </Tooltip>
                        </Label>
                        <ResearchProblemInput handler={this.handleResearchProblemsChange} value={this.props.researchProblems} />
                        </FormGroup>*/}

                    <>
                        <FormGroup>
                            <StatementBrowser
                                enableEdit={true}
                                syncBackend={false}
                                openExistingResourcesInDialog={false}
                                initialSubjectId={this.props.resourceId}
                                initialSubjectLabel={this.props.resourceLabel}
                                templatesFound={false}
                                renderTemplateBox={true}
                            />
                        </FormGroup>
                    </>
                </Form>
            </StyledHorizontalContribution>
        );
    }
}

Contribution.propTypes = {
    id: PropTypes.string.isRequired,
    resourceLabel: PropTypes.string,
    openTour: PropTypes.func.isRequired,
    resourceId: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
    return {
        resourceId: state.addPaper.contributions.byId[ownProps.id] ? state.addPaper.contributions.byId[ownProps.id].resourceId : null,
        resourceLabel: state.addPaper.contributions.byId[ownProps.id] ? state.addPaper.contributions.byId[ownProps.id].label : null
    };
};

const mapDispatchToProps = dispatch => ({
    openTour: data => dispatch(openTour(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contribution);
