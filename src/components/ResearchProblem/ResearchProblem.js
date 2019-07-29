import React, { Component } from 'react';
import {
  Container, Button, Card, CardText, CardBody, CardHeader, CardFooter,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { getStatementsByObject, getResource, getStatementsBySubject } from '../../network';
import ComparisonPopup from '../ViewPaper/ComparisonPopup';
import PaperCard from '../PaperCard/PaperCard';
import ROUTES from '../../constants/routes';

class ResearchProblem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      researchProblem: null,
      contributions: null,
    };
  }

  componentDidMount() {
    // Get the research problem
    getResource(this.props.match.params.researchProblemId).then((result) => {
      this.setState({ researchProblem: result });
    });

    // Get the contributions that are on the research problem
    getStatementsByObject({
      id: this.props.match.params.researchProblemId,
      order: 'desc',
    }).then((result) => {
      // Get the papers of each contribution
      const papers = result.map(contribution => getStatementsByObject({
        id: contribution.subject.id,
        order: 'desc',
      }).then((papers) => {
        // Fetch the data of each paper
        const papers_data = papers.map(paper => getStatementsBySubject(paper.subject.id).then((paperStatements) => {
          // publication year
          let publicationYear = paperStatements.filter(
            statement => statement.predicate.id === process.env.REACT_APP_PREDICATES_HAS_PUBLICATION_YEAR,
          );
          if (publicationYear.length > 0) {
            publicationYear = publicationYear[0].object.label;
          }
          // publication month
          let publicationMonth = paperStatements.filter(
            statement => statement.predicate.id === process.env.REACT_APP_PREDICATES_HAS_PUBLICATION_MONTH,
          );
          if (publicationMonth.length > 0) {
            publicationMonth = publicationMonth[0].object.label;
          }
          // authors
          const authors = paperStatements.filter(
            statement => statement.predicate.id === process.env.REACT_APP_PREDICATES_HAS_AUTHOR,
          );
          const authorNamesArray = [];
          if (authors.length > 0) {
            for (const author of authors) {
              const authorName = author.object.label;
              authorNamesArray.push(authorName);
            }
          }
          paper.data = {
            publicationYear,
            publicationMonth,
            authorNames: authorNamesArray.reverse(),
          };
          return paper;
        }));
        return Promise.all(papers_data).then((results) => {
          contribution.papers = results;
          return contribution.papers.length > 0 ? contribution : null;
        });
      }));

      Promise.all(papers).then((results) => {
        this.setState({
          contributions: results,
          loading: false,
        });
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.loading && (
          <div className="text-center mt-4 mb-4">
            <Icon icon={faSpinner} spin /> Loading
          </div>
        )}
        {!this.state.loading && (
          <div>
            <Container className="p-0">
              <Card>
                <CardHeader>
                  <div className="float-right">
                    <b>{this.state.contributions.length}</b> Contributions
                  </div>
                  <h3 className="h4 mt-4 mb-4">
                    {this.state.researchProblem && this.state.researchProblem.label}
                  </h3>
                </CardHeader>
                <CardBody>
                  <CardText>Description text</CardText>
                </CardBody>
                <CardFooter>Some sub problems</CardFooter>
              </Card>
            </Container>
            <br />
            <Container className={'p-0'}>
              {this.state.contributions && this.state.contributions.length > 0 ? (
                <div>
                  {this.state.contributions.map(
                    contribution => contribution && (
                        <PaperCard
                          paper={{
                            id: contribution.papers[0].subject.id,
                            title: contribution.papers[0].subject.label,
                            ...contribution.papers[0].data,
                          }}
                          contribution={{
                            id: contribution.subject.id,
                            title: contribution.subject.label,
                          }}
                          key={`pc${contribution.id}`}
                        />
                    ),
                  )}
                </div>
              ) : (
                <div className="text-center mt-4 mb-4">
                  There are no articles for this research problem, yet.
                  <br />
                  Start the graphing in ORKG by sharing a paper.
                  <br />
                  <br />
                  <Link to={ROUTES.ADD_PAPER.GENERAL_DATA}>
                    <Button size="sm" color="primary " className="mr-3">
                      Share paper
                    </Button>
                  </Link>
                </div>
              )}

              <ComparisonPopup />
            </Container>
          </div>
        )}
      </div>
    );
  }
}

ResearchProblem.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      researchProblemId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ResearchProblem;
