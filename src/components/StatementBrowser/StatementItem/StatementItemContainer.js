import { connect } from 'react-redux';
import {
    togglePropertyCollapse,
    toggleEditPropertyLabel,
    updatePropertyLabel,
    changeProperty,
    isSavingProperty,
    doneSavingProperty,
    createProperty,
    deleteProperty
} from 'actions/statementBrowser';
import StatementItem from './StatementItem';

const mapStateToProps = state => {
    return {
        selectedProperty: state.statementBrowser.selectedProperty,
        selectedResource: state.statementBrowser.selectedResource,
        properties: state.statementBrowser.properties,
        values: state.statementBrowser.values
    };
};

const mapDispatchToProps = dispatch => ({
    deleteProperty: id => dispatch(deleteProperty(id)),
    togglePropertyCollapse: id => dispatch(togglePropertyCollapse(id)),
    toggleEditPropertyLabel: data => dispatch(toggleEditPropertyLabel(data)),
    updatePropertyLabel: data => dispatch(updatePropertyLabel(data)),
    changeProperty: data => dispatch(changeProperty(data)),
    isSavingProperty: data => dispatch(isSavingProperty(data)),
    doneSavingProperty: data => dispatch(doneSavingProperty(data)),
    createProperty: data => dispatch(createProperty(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StatementItem);
