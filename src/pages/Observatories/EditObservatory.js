import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup } from 'reactstrap';
import { updateObservatoryName, updateObservatoryDescription, updateObservatoryResearchField, resourcesUrl } from 'network';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import AutoComplete from 'components/Autocomplete/Autocomplete';

class EditObservatory extends Component {
    constructor(props) {
        super(props);
        this.resourceInputRef = React.createRef();
        this.state = {
            label: '',
            description: '',
            isLoadingName: false,
            isLoadingDescription: false,
            researchField: '',
            isLoadingResearchField: false,
            isLoading: false
        };
    }

    componentDidUpdate = prevProps => {
        if (prevProps.label !== this.props.label) {
            this.setState({ label: this.props.label });
        }

        if (prevProps.description !== this.props.description) {
            this.setState({ description: this.props.description });
        }

        if (prevProps.researchField !== this.props.researchField) {
            this.setState({ researchField: { label: this.props.researchField } });
        }
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async e => {
        const value = this.state.label;
        const description = this.state.description;
        const id = this.props.id;
        const researchField = this.state.researchField.label;

        let isUpdatedLabel = true;
        let isUpdatedDescription = true;
        let isUpdatedResearchField = true;

        toast.dismiss();

        if (value !== this.props.label && value.length === 0) {
            toast.error(`Please enter an observatory name`);
            return false;
        }

        if (description !== this.props.description && description.length == 0) {
            toast.error(`Please enter an observatory description`);
            return false;
        }

        if (researchField !== this.props.researchField && researchField.length === 0) {
            toast.error(`Please enter an observatory research field`);
            return false;
        }

        if (value !== this.props.label && value.length !== 0) {
            await this.updateObservatoryName(id, value);
            isUpdatedLabel = true;
        }

        if (description !== this.props.description && description.length !== 0) {
            await this.updateObservatoryDescription(id, description);
            isUpdatedDescription = true;
        }

        if (researchField !== this.props.researchField && researchField.length !== 0) {
            await this.updateObservatoryResearchField(id, researchField);
            isUpdatedResearchField = true;
        }

        if (isUpdatedLabel || isUpdatedDescription || isUpdatedResearchField) {
            toast.success(`Observatory updated successfully`);
            this.props.updateObservatoryMetadata(value, description, researchField);
            this.props.toggle();
        } else {
            this.props.toggle();
        }
    };

    updateObservatoryName = async (id, name) => {
        this.setState({ isLoadingName: true });
        try {
            await updateObservatoryName(id, name);
            this.setState({ isLoadingName: false });
        } catch (error) {
            this.setState({ isLoadingName: false });
            console.error(error);
            toast.error(`Error updating an observatory ${error.message}`);
        }
    };

    updateObservatoryDescription = async (id, description) => {
        this.setState({ isLoadingDescription: true });
        try {
            await updateObservatoryDescription(id, description);
            this.setState({ isLoadingDescription: false });
        } catch (error) {
            this.setState({ isLoadingDescription: false });
            console.error(error);
            toast.error(`Error updating an observatory ${error.message}`);
        }
    };

    updateObservatoryResearchField = async (id, researchField) => {
        this.setState({ isLoadingResearchField: true });
        try {
            await updateObservatoryResearchField(id, researchField);
            this.setState({ isLoadingResearchField: false });
        } catch (error) {
            this.setState({ isLoadingResearchField: false });
            console.error(error);
            toast.error(`Error updating an observatory ${error.message}`);
        }
    };

    render() {
        const isLoading = this.state.isLoadingName || this.state.isLoadingDescription || this.state.isLoadingResearchField;
        return (
            <>
                <Modal size="lg" isOpen={this.props.showDialog} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>Update an Observatory</ModalHeader>
                    <ModalBody>
                        <>
                            {' '}
                            <FormGroup>
                                <Label for="ObservatoryName">Observatory Name</Label>
                                <Input
                                    onChange={this.handleChange}
                                    type="text"
                                    name="label"
                                    id="ObservatoryName"
                                    value={this.state.label}
                                    placeholder="Observatory Name"
                                    disabled={isLoading}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="ObservatoryResearchField">Observatory Research Field</Label>
                                <AutoComplete
                                    requestUrl={resourcesUrl}
                                    optionsClass="ResearchField"
                                    placeholder="Observatory research field"
                                    onItemSelected={async rf => {
                                        this.setState({ researchField: { ...rf, label: rf.value } });
                                    }}
                                    value={this.state.researchField || ''}
                                    allowCreate={false}
                                    autoLoadOption={true}
                                    isDisabled={true}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="ObservatoryDescription">Observatory Description</Label>
                                <Input
                                    onChange={this.handleChange}
                                    type="textarea"
                                    name="description"
                                    id="observatoryDescription"
                                    value={this.state.description}
                                    rows={4}
                                    placeholder="Observatory description"
                                    disabled={isLoading}
                                />
                            </FormGroup>
                        </>
                    </ModalBody>
                    <ModalFooter>
                        <div className="text-align-center mt-2">
                            <Button color="primary" disabled={this.state.isLoading} onClick={this.handleSubmit}>
                                {isLoading && <span className="fa fa-spinner fa-spin" />} Save
                            </Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

EditObservatory.propTypes = {
    showDialog: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
    description: PropTypes.string,
    researchField: PropTypes.string,
    updateObservatoryMetadata: PropTypes.func.isRequired
};

export default EditObservatory;
