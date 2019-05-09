import React, { Component } from 'react';
import { ListGroupItem } from 'reactstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faTrash, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../../Utils/Tooltip';
import styles from '../../Contributions.module.scss';
import classNames from 'classnames';
import Confirm from 'reactstrap-confirm';
import { connect } from 'react-redux';
import { selectResource, fetchStatementsForResource, deleteValue } from '../../../../../actions/addPaper';
import PropTypes from 'prop-types';
import StatementBrowserDialog from '../StatementBrowserDialog';

class ValueItem extends Component {
    state = {
        modal: false,
        dialogResourceId: null,
        dialogResourceLabel: null,
    }
    toggleDeleteContribution = async () => {
        let result = await Confirm({
            title: 'Are you sure?',
            message: 'Are you sure you want to delete this value?',
            cancelColor: 'light'
        });

        if (result) {
            this.props.deleteValue({
                id: this.props.id,
                propertyId: this.props.propertyId
            });
        }
    }

    handleResourceClick = () => {
        let resource = this.props.resources.byId[this.props.resourceId];
        let existingResourceId = resource.existingResourceId;

        if (existingResourceId && !resource.isFechted) {
            this.props.fetchStatementsForResource({
                resourceId: this.props.resourceId,
                existingResourceId
            });
        }

        this.props.selectResource({
            increaseLevel: true,
            resourceId: this.props.resourceId,
            label: this.props.label,
        });
    }

    handleExistingResourceClick = () => {
        let resource = this.props.resources.byId[this.props.resourceId];
        let existingResourceId = resource.existingResourceId;
        console.log(existingResourceId);
        this.setState({
            modal: true,
            dialogResourceId: existingResourceId,
            dialogResourceLabel: resource.label,
        });
    }

    toggleModal = () => {
        this.setState(prevState => ({
            modal: !prevState.modal,
        }));
    }

    render() {
        const labelClass = classNames({
            [styles.objectLink]: this.props.type === 'object'
        });

        let resource = this.props.resources.byId[this.props.resourceId];
        let existingResourceId = resource.existingResourceId;
        let onClick = null;

        if (this.props.type === 'object' && existingResourceId && this.props.openExistingResourcesInDialog) {
            onClick = this.handleExistingResourceClick;
        } else if (this.props.type === 'object') {
            onClick = this.handleResourceClick;
        }

        return (
            <>
                <ListGroupItem className={styles.valueItem}>
                    <span className={labelClass} onClick={onClick}>
                        {this.props.label}
                        {existingResourceId && this.props.openExistingResourcesInDialog ?
                            <span> <Icon icon={faExternalLinkAlt} /></span>
                            : ''}
                    </span>
                    {!this.props.existingStatement ?
                        <span className={`${styles.deleteValue} float-right`} onClick={this.toggleDeleteContribution}>
                            <Tooltip message="Delete value" hideDefaultIcon={true}>
                                <Icon icon={faTrash} /> Delete
                            </Tooltip>
                        </span> : ''}
                </ListGroupItem>

                {this.state.modal ?
                    <StatementBrowserDialog
                        show={this.state.modal}
                        toggleModal={this.toggleModal}
                        resourceId={this.state.dialogResourceId}
                        resourceLabel={this.state.dialogResourceLabel}
                    /> : ''}
            </>
        );
    }
}

ValueItem.propTypes = {
    deleteValue: PropTypes.func.isRequired,
    selectResource: PropTypes.func.isRequired,
    fetchStatementsForResource: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    resourceId: PropTypes.string.isRequired,
    propertyId: PropTypes.string.isRequired,
    existingStatement: PropTypes.bool.isRequired,
    openExistingResourcesInDialog: PropTypes.bool,
};

const mapStateToProps = state => {
    return {
        resources: state.addPaper.resources,
    }
};

const mapDispatchToProps = dispatch => ({
    selectResource: (data) => dispatch(selectResource(data)),
    fetchStatementsForResource: (data) => dispatch(fetchStatementsForResource(data)),
    deleteValue: (data) => dispatch(deleteValue(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ValueItem);