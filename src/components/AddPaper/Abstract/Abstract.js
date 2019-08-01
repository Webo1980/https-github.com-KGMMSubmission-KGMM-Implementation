import React, { Component } from 'react';
import { Button, Alert, Card, CardBody, Label, Badge } from 'reactstrap';
import { arxivUrl } from '../../../network';
import { connect } from 'react-redux';
import {
  updateAbstract,
  nextStep,
  previousStep,
  createContribution,
} from '../../../actions/addPaper';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import AbstractAnnotator from './AbstractAnnotator';
import { getAnnotations } from '../../../network';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import Tooltip from '../../Utils/Tooltip';
import dotProp from 'dot-prop-immutable';
import { guid } from '../../../utils';

class Annotation extends Component {
  constructor(props) {
    super(props);

    this.highlightableRef = React.createRef();

    this.state = {
      isAnnotationLoading: false,
      classeOptions: [
        { id: 'process', label: 'Process' },
        { id: 'data', label: 'Data' },
        { id: 'material', label: 'Material' },
        { id: 'method', label: 'Method' },
      ],
      isLoading: false,
      showError: false,
      changeAbstract: false,
      loading: false,
      ranges: {},
      idIndex: 1,
      tooltipOpen: false,
    };
  }

  componentDidMount() {
    this.fetchAbstract();
  }

  getAnnotation = () => {
    this.setState({ isAnnotationLoading: true });
    return getAnnotations(this.props.abstract)
      .catch((error) => {
        this.setState({ isAnnotationLoading: false });
      })
      .then((data) => {
        let annotated = [];
        let ranges = {};
        if (data.entities) {
          data.entities
            .map((entity) => {
              let text = data.text.substring(entity[2][0][0], entity[2][0][1]);
              if (annotated.indexOf(text.toLowerCase()) < 0) {
                annotated.push(text.toLowerCase());
                ranges[entity[0]] = {
                  id: entity[0],
                  text: text,
                  start: entity[2][0][0],
                  end: entity[2][0][1],
                  tooltip: false,
                  class: { id: entity[1], label: entity[1] },
                }
                return ranges[entity[0]]
              } else {
                return null;
              }
            })
            .filter((r) => r);
        }
        this.setState({ ranges : ranges, isAnnotationLoading: false });
      });
  };

  handleChangeAnnotationClass = (selectedOption, { action }, range) => {
    if (action === 'select-option') {
      let state = dotProp.set(this.state, `ranges.${[range.id]}.class`, { id: selectedOption.id, label: selectedOption.label })
      this.setState(state);
    } else if (action === 'create-option') {
      const newOption = {
        label: selectedOption.label,
        id: selectedOption.label,
      };
      let state = dotProp.set(this.state, `ranges.${[range.id]}.class`, { id: selectedOption.id, label: selectedOption.label })
      this.setState(state);
      this.setState({classeOptions: [...this.state.classeOptions, newOption]});
    } else if (action === 'clear') {
      this.removeAnnotation(range);
    }
  };

  removeAnnotation = (range) => {
    let filtered = this.state.ranges;
    delete filtered[range.id];
    this.setState({ ranges: filtered });
  };

  onCreateAnnotation = (range) => {
    this.setState({
      idIndex: this.state.idIndex + 1,
      ranges: {...this.state.ranges, [range.id]: range}
    });
  };

  toggleTooltip = (range) => {
    let state = dotProp.set(this.state, `ranges.${[range.id]}.tooltip`, v => !v)
    this.setState(state);
  };

  fetchAbstract = async () => {
    if (!this.props.abstract) {
      if (!this.props.title) {
        this.setState({
          changeAbstract: true,
        });

        return;
      }
      this.setState({
        loading: true,
      });

      const titleEncoded = encodeURIComponent(this.props.title).replace(/%20/g, '+');
      const apiCall = arxivUrl + '?search_query=ti:' + titleEncoded;

      fetch(apiCall, { method: 'GET' })
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, 'text/xml')) // parse the text as xml
        .then((xmlDoc) => {
          // get the abstract from the xml doc
          if (xmlDoc.getElementsByTagName('entry') && xmlDoc.getElementsByTagName('entry')[0]) {
            return xmlDoc.getElementsByTagName('entry')[0].getElementsByTagName('summary')[0]
              .innerHTML;
          }
          return '';
        })
        .then((abstract) => {
          // remove line breaks from the abstract
          abstract = abstract.replace(/(\r\n|\n|\r)/gm, ' ');

          this.setState({
            loading: false,
          });
          this.props.updateAbstract(abstract);
          this.getAnnotation();
        })
        .catch();
    } else {
      this.getAnnotation();
    }
  };

  handleNextClick = () => {
    //TODO: add the annotated words as statements for the next step

    let classesID = {};
    let createdProperties = {};
    let statements = {'properties': [], values : [] };
    let rangesIDs = Object.keys(this.state.ranges)
    if(rangesIDs.length > 0){
      rangesIDs.map(rID => {
        let range = this.state.ranges[rID];
        let propertyId;
        let predicateId = null;

        if (range.class.id !== range.class.label){
         //existing predicate
          predicateId = range.class.id;
          propertyId = range.class.id;
        } else {
          if (classesID[range.class.id]) {
            propertyId = classesID[range.class.id];
          } else {
            let pID = guid();
            classesID[range.class.id] = pID;
            propertyId = pID;
          }
        }
        if (!createdProperties[propertyId]) {
          statements['properties'].push({
            propertyId: propertyId,
            existingPredicateId: predicateId,
            label: range.class.label,
          })
          createdProperties[propertyId] = propertyId;
        }

        statements['values'].push({
          label: range.text,
          type: 'object',
          propertyId: propertyId,
        })
        return null;
      })
    }

    if (this.props.contributions.allIds.length === 0) {
      this.props.createContribution({
        selectAfterCreation: true,
        prefillStatements: true,
        statements: statements,
      });
    }

    //TODO: add the annotated words as statements in a specific contribution

    this.props.nextStep();
  };

  handleChangeAbstract = () => {
    if (this.state.changeAbstract) {
      this.getAnnotation();
    }
    this.setState((prevState) => ({
      changeAbstract: !prevState.changeAbstract,
    }));
  };

  handleChange = (event) => {
    this.props.updateAbstract(event.target.value);
  };

  render() {
    let rangesClasses = [...new Set(Object.values(this.state.ranges).map((r) => r.class.label))];
    return (
      <div>
        <h2 className="h4 mt-4 mb-3">Abstract annotation</h2>

        {this.props.abstract && !this.state.changeAbstract && (
          <Alert color="info">
            <strong>Info:</strong> we automatically annotated the abstract for you. Please remove
            any incorrect annotations
          </Alert>
        )}

        <Card>
          <CardBody>
            {this.state.loading && (
              <div className="text-center" style={{ fontSize: 30 }}>
                <Icon icon={faSpinner} spin />
              </div>
            )}

            {!this.state.changeAbstract ? (
              <div className="pl-2 pr-2">
                {this.state.isAnnotationLoading && (
                  <div className="text-center text-primary">
                    <span style={{ fontSize: 80 }}>
                      <Icon icon={faSpinner} spin />
                    </span>
                    <br />
                    <h2 className="h5">Loading annotations...</h2>
                  </div>
                )}
                {!this.state.isAnnotationLoading && (
                  <div>
                    {rangesClasses.length > 0 &&
                      rangesClasses.map(
                        (c) => {
                          let color = '#0052CC';
                          switch (c) {
                            case 'Process':
                              color = '#7fa2ff';
                              break;
                            case 'Data':
                              color = '#5FA97F';
                              break;
                            case 'Material':
                              color = '#EAB0A2';
                              break;
                            case 'Method':
                              color = '#D2B8E5';
                              break;
                            default:
                              color = '#ffb7b7';
                          }
                          //
                          return (
                            <Badge
                              className={'mr-2'}
                              key={`c${c}`}
                              style={{ color: '#333', background: color }}
                            >
                              {c}{' '}
                              {
                                Object.values(this.state.ranges)
                                  .map((r) => r.class.label)
                                  .filter((rc) => rc === c).length
                              }
                            </Badge>
                          );
                        },
                      )}
                    <AbstractAnnotator
                      ranges={this.state.ranges}
                      abstract={this.props.abstract}
                      rangesIdIndex={this.state.idIndex}
                      annotationClasseOptions={this.state.classeOptions}
                      handleChangeAnnotationClass={this.handleChangeAnnotationClass}
                      onCreateAnnotation={this.onCreateAnnotation}
                      toggleTooltip={this.toggleTooltip}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Label for="paperAbstract">
                  <Tooltip message="Enter the paper abstract to get automatically generated concepts for you paper. You can skip this step by clicking the 'Next step' button">
                    Enter the paper abstract
                  </Tooltip>
                </Label>
                <Textarea
                  id="paperAbstract"
                  className="form-control pl-2 pr-2"
                  minRows={5}
                  value={this.props.abstract}
                  onChange={this.handleChange}
                />
              </div>
            )}
          </CardBody>
        </Card>

        <Button color="light" className="mb-2 mt-1" onClick={this.handleChangeAbstract}>
          {this.state.changeAbstract ? 'Annotate abstract' : 'Change abstract'}
        </Button>

        <hr className="mt-5 mb-3" />

        <Button color="primary" className="float-right mb-4" onClick={this.handleNextClick}>
          Next step
        </Button>
        <Button color="light" className="float-right mb-4 mr-2" onClick={this.props.previousStep}>
          Previous step
        </Button>
      </div>
    );
  }
}

Annotation.propTypes = {
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  updateAbstract: PropTypes.func.isRequired,
  abstract: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  selectedContribution: PropTypes.string.isRequired,
  contributions: PropTypes.object.isRequired,
  createContribution: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  selectedContribution: state.addPaper.selectedContribution,
  title: state.addPaper.title,
  abstract: state.addPaper.abstract,
  contributions: state.addPaper.contributions,
});

const mapDispatchToProps = (dispatch) => ({
  updateAbstract: (data) => dispatch(updateAbstract(data)),
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
  createContribution: (data) => dispatch(createContribution(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Annotation);
