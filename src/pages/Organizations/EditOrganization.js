import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup } from 'reactstrap';
import { updateOrganizationName, updateOrganizationUrl, updateOrganizationLogo } from 'network';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

class EditOrganization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            label: '',
            value: '',
            url: '',
            organizationId: '',
            previewSrc: '',
            isLoadingName: true,
            isLoadingUrl: true,
            isLoadingLogo: true
        };
    }

    componentDidUpdate = prevProps => {
        if (prevProps.label !== this.props.label) {
            this.setState({ label: this.props.label });
        }

        if (prevProps.url !== this.props.url) {
            this.setState({ url: this.props.url });
        }

        if (prevProps.previewSrc !== this.props.previewSrc) {
            this.setState({ previewSrc: this.props.previewSrc });
        }
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handlePreview = async e => {
        e.preventDefault();

        const file = e.target.files[0];
        const reader = new FileReader();

        if (e.target.files.length === 0) {
            return;
        }

        reader.onloadend = e => {
            this.setState({
                previewSrc: [reader.result]
            });
        };

        reader.readAsDataURL(file);
    };

    handleSubmit = async e => {
        const value = this.state.label;
        const image = this.state.previewSrc;
        const url = this.state.url;
        const id = this.props.id;

        let isSavedLabel = true;
        let isSavedImage = true;
        let isSavedUrl = true;

        if (value !== this.props.label) {
            if (value.length !== 0) {
                await this.updateOgranizationName(id, value);
            } else {
                toast.error(`Please enter an organization name`);
                isSavedLabel = false;
            }
        }

        if (url !== this.props.url) {
            if (url.match(/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi)) {
                await this.updateOgranizationUrl(id, url);
            } else {
                toast.error(`Please enter a vlaid url`);
                isSavedUrl = false;
            }
        }

        if (image !== this.props.previewSrc) {
            if (image.length !== 0) {
                await this.updateOgranizationLogo(id, image[0]);
            } else {
                toast.error(`Please enter an organization image`);
                isSavedImage = false;
            }
        }

        if (isSavedLabel && isSavedUrl && isSavedImage) {
            this.props.updateOrganizationMetadata(value, url, image);
        }
    };

    updateOgranizationName = async (id, name) => {
        this.setState({ isLoadingName: true });
        try {
            await updateOrganizationName(id, name);
        } catch (error) {
            this.setState({ isLoadingName: false });
            console.error(error);
            toast.error(`Error updating an organization ${error.message}`);
        }
    };

    updateOgranizationUrl = async (id, url) => {
        this.setState({ isLoadingUrl: true });
        try {
            await updateOrganizationUrl(id, url);
        } catch (error) {
            this.setState({ isLoadingUrl: false });
            console.error(error);
            toast.error(`Error updating an organization ${error.message}`);
        }
    };

    updateOgranizationLogo = async (id, image) => {
        this.setState({ isLoadingLogo: true });
        try {
            await updateOrganizationLogo(id, image);
        } catch (error) {
            this.setState({ isLoadingLogo: false });
            console.error(error);
            toast.error(`Error updating an organization ${error.message}`);
        }
    };

    render() {
        return (
            <>
                <Modal isOpen={this.props.showDialog} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>Update an Organization</ModalHeader>
                    <ModalBody>
                        <>
                            {' '}
                            <FormGroup>
                                <Label for="ResourceLabel">Organization Name</Label>
                                <Input
                                    onChange={this.handleChange}
                                    type="text"
                                    name="label"
                                    id="ResourceLabel"
                                    value={this.state.label}
                                    placeholder="Organization Name"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="OrganizationUrl">Organization URL</Label>
                                <Input
                                    onChange={this.handleChange}
                                    type="text"
                                    name="url"
                                    id="OrganizationUrl"
                                    value={this.state.url}
                                    placeholder="https://www.example.com"
                                />
                            </FormGroup>
                            <div>
                                <img src={this.state.previewSrc} style={{ width: '20%', height: '20%' }} className="Avatar" alt="" />
                            </div>
                            <FormGroup>
                                <Label>Logo</Label>
                                <br />
                                <Input type="file" onChange={this.handlePreview} />
                            </FormGroup>
                        </>
                    </ModalBody>
                    <ModalFooter>
                        <div className="text-align-center mt-2">
                            <Button color="primary" disabled={this.state.isLoading} onClick={this.handleSubmit}>
                                {this.state.isLoading && <span className="fa fa-spinner fa-spin" />} Save
                            </Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}
EditOrganization.propTypes = {
    showDialog: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
    url: PropTypes.string,
    previewSrc: PropTypes.string,
    updateOrganizationMetadata: PropTypes.func.isRequired
};

export default connect()(EditOrganization);
