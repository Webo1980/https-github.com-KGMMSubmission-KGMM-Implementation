import React, { Component } from 'react'
import { Label, FormFeedback } from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import { updateAbstract } from '../../../actions/addPaper';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '../../Utils/Tooltip';

class AbstractInputView extends Component {

    handleChange = (event) => {
        this.props.updateAbstract(event.target.value);
    };

    stripLineBreaks = (event) => {
        event.preventDefault();
        var text = '';
        if (event.clipboardData || event.originalEvent.clipboardData) {
            text = (event.originalEvent || event).clipboardData.getData('text/plain');
        } else if (window.clipboardData) {
            text = window.clipboardData.getData('Text');
        }
        // strip line breaks
        text = text.replace(/\r?\n|\r/g, ' ')
        this.props.updateAbstract(this.props.abstract + text);
    };

    render() {
        return (
            <div>
                <Label for="paperAbstract">
                    <Tooltip message="Enter the paper abstract to get automatically generated concepts for you paper.">
                        Enter the paper abstract
                    </Tooltip>
                </Label>
                <Textarea
                    id="paperAbstract"
                    className={`form-control pl-2 pr-2 ${!this.props.validation ? 'is-invalid' : ''}`}
                    minRows={5}
                    value={this.props.abstract}
                    onChange={this.handleChange}
                    onPaste={this.stripLineBreaks}
                />
                {!this.props.validation &&
                    <FormFeedback className="order-1">
                        Please enter the abstract or skip this step.
                    </FormFeedback>
                }
            </div>
        )
    }
}


AbstractInputView.propTypes = {
    abstract: PropTypes.string.isRequired,
    updateAbstract: PropTypes.func.isRequired,
    validation: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    abstract: state.addPaper.abstract,
});

const mapDispatchToProps = (dispatch) => ({
    updateAbstract: (data) => dispatch(updateAbstract(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AbstractInputView);
