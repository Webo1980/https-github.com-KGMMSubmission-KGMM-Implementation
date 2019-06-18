import React, { Component } from 'react';
import { Container, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTimes, faArrowCircleRight, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { reverse } from 'named-urls';
import ROUTES from '../../constants/routes.js';
import StatementBrowserDialog from '../StatementBrowser/StatementBrowserDialog';
import arrayMove from 'array-move';
import dotProp from 'dot-prop-immutable';
import queryString from 'query-string';
import SelectProperties from './SelectProperties.js';
import Share from './Share.js';
import GeneratePdf from './GeneratePdf.js';
import { submitGetRequest, comparisonUrl } from '../../network';
import capitalize from 'capitalize';
import classNames from 'classnames';

// TODO: component is too large, split into smaller componenets 
// There is a lot is styling needed for this table, this it is using a column structure,
// instead of the default HTML row structure
// TODO: code is too nested (bad practice), need to be improved here
const ScrollContainer = styled.div`
    overflow-x: hidden; // auto is maybe a better UX, but hidden looks better :) 
    float: left; 
    width: 100%;
    padding: 10px 0;
    scroll-behavior: smooth;

    &.overflowing-right {
        box-shadow: inset -9px 0 5px -5px #d9d9d9;
    }
    &.overflowing-left {
        box-shadow: inset 9px 0 5px -5px #d9d9d9;
    }
    &.overflowing-both {
        box-shadow: inset 9px 0 5px -5px #d9d9d9, inset -9px 0 5px -5px #d9d9d9;
    }
`;
const Row = styled.tr`
    &:last-child td > div {
        border-bottom:2px solid #CFCBCB;
        border-radius:0 0 11px 11px;
    }
`;

const Properties = styled.td`
    padding-right:10px;
    padding:0 10px!important;
    margin:0;
    display: table-cell;
    height:100%;
    width:250px;
`;

const PropertiesInner = styled.div`
    background: #80869B;
    height:100%;
    color:#fff;
    padding:10px;
    border-bottom:2px solid #8B91A5!important;

    &.first {
        border-radius:11px 11px 0 0;
    }

    &.last {
        border-radius:0 0 11px 11px;
    }
`;

const Item = styled.td`
    padding-right:10px;
    padding: 0 10px!important;
    margin:0;
    display: table-cell;
    height:100%;
`;

const ItemInner = styled.div`
    padding:10px 5px;
    border-left:2px solid #CFCBCB;
    border-right:2px solid #CFCBCB;
    border-bottom:2px solid #EDEBEB;
    text-align:center;
    height:100%;
`;

const ItemHeader = styled.td`
    padding-right:10px;
    min-height:50px;
    padding: 0 10px!important;
    margin:0;
    display: table-cell;
    height:100%;
    width:250px;
    position:relative;
`;

const ItemHeaderInner = styled.div`
    padding:5px 10px;
    background:#E86161;
    border-radius:11px 11px 0 0;
    color:#fff;
    height:100%;

    a {
        color:#fff!important;
    }
`;

const Contribution = styled.div`
    color:#FFA5A5;
    font-size:85%;
`;

const Delete = styled.div`
    position:absolute;
    top:-4px;
    right:7px;
    background:#FFA3A3;
    border-radius:20px;
    width:24px;
    height:24px;
    text-align:center;
    color:#E86161;
    cursor:pointer;
`;
const ScrollButton = styled.div`
    border-radius:30px;
    color: ${props => props.theme.darkblue};
    width:30px;
    height:30px;
    font-size:27px;
    cursor:pointer;
    transition: 0.2s filter;

    &.next {
        float: right;
    }
    &.back {
        float: left;
    }
    &:hover {
        filter: brightness(85%);
    }
`;
/*const BreadcrumbStyled = styled(Breadcrumb)`
    .breadcrumb {
        background:transparent;
        border-left: 2px solid #caccd5;
        border-radius: 0;
        margin: 0 0 0 18px;
    }
`;*/

class Comparison extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            authorNames: [],
            contributions: [],
            dropdownOpen: false,
            properties: [],
            data: [],
            csvData: [],
            redirect: null,
            modal: false,
            dialogResourceId: null,
            dialogResourceLabel: null,
            showPropertiesDialog: false,
            showShareDialog: false,
            containerScrollLeft: 0,
            showNextButton: false,
            showBackButton: false,
        }

        this.scrollContainer = React.createRef();
        this.scrollAmount = 500;
    }

    componentDidMount = () => {
        this.performComparison();
        this.scrollContainer.current.addEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate = (prevProps, prevState) => {
        // check if the csv export data needs an update
        if (this.state.properties !== prevState.properties || this.state.contributions !== prevState.contributions || this.state.data !== prevState.data) {
            this.generateMatrixOfComparison();
        }

        if (this.props.match.params !== prevProps.match.params) {
            this.performComparison();
        }
    }

    componentWillUnmount = () => {
        this.scrollContainer.current.removeEventListener('scroll', this.handleScroll);
    }

    getContributionIdsFromUrl = () => {
        let ids = this.props.match.params[0];

        if (!ids) {
            return [];
        }

        return ids.split('/');
    }

    getPropertyIdsFromUrl = () => {
        let ids = queryString.parse(this.props.location.search).properties;

        if (!ids) {
            return [];
        }
        ids = ids.split(',');
        ids = ids.filter(n => n); //filter out empty elements

        return ids;
    }

    generateMatrixOfComparison = () => {
        let header = ['Title'];

        for (let property of this.state.properties) {
            header.push(property.label);
        }

        let rows = [];

        for (let i = 0; i < this.state.contributions.length; i++) {
            let contribution = this.state.contributions[i];
            let row = [contribution.title];

            for (let property of this.state.properties) {
                row.push(this.state.data[property.id][i].label);
            }
            rows.push(row);
        }

        this.setState({
            csvData: [
                header,
                ...rows
            ]
        });
    }

    performComparison = async () => {
        const contributionIds = this.getContributionIdsFromUrl();
        let comparisonData = await submitGetRequest(`${comparisonUrl}${contributionIds.join('/')}`);

        // mocking function to allow for deletion of contributions via the url
        let contributions = [];
        for (let i = 0; i < comparisonData.contributions.length; i++) {
            let contribution = comparisonData.contributions[i];

            if (contributionIds.includes(contribution.id)) {
                contributions.push(contribution)
            }
        }

        if (comparisonData.contributions.length > 3) {
            this.setState({
                showNextButton: true,
            });
        }

        const propertyIds = this.getPropertyIdsFromUrl();

        // if there are properties in the query string 
        if (propertyIds.length > 0) {

            // sort properties based on query string (is not presented in query string, sort at the bottom)
            // TODO: sort by label when is not active
            comparisonData.properties.sort((a, b) => {
                let index1 = propertyIds.indexOf(a.id) !== -1 ? propertyIds.indexOf(a.id) : 1000;
                let index2 = propertyIds.indexOf(b.id) !== -1 ? propertyIds.indexOf(b.id) : 1000;
                return index1 - index2;
            });
            // hide properties based on query string
            comparisonData.properties.forEach((property, index) => {
                if (!propertyIds.includes(property.id)) {
                    comparisonData.properties[index].active = false;
                } else {
                    comparisonData.properties[index].active = true;
                }
            });
        } else {
            //no properties ids in the url, but the ones from the api still need to be sorted
            comparisonData.properties.sort((a, b) => {
                if (a.active === b.active) {
                    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
                } else {
                    return !a.active ? 1 : -1;
                }
            });
        }

        console.log(comparisonData.properties);

        this.setState({
            contributions: contributions,
            properties: comparisonData.properties,
            data: comparisonData.data,
        });
    }

    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    openStatementBrowser = (id, label) => {
        this.setState({
            modal: true,
            dialogResourceId: id,
            dialogResourceLabel: label,
        });
    }

    exportAsCsv = (e) => {
        this.setState({
            dropdownOpen: false,
        })
    }

    removeContribution = (contributionId) => {
        let contributionIds = this.getContributionIdsFromUrl();
        let index = contributionIds.indexOf(contributionId);

        if (index > -1) {
            contributionIds.splice(index, 1);
        }

        this.generateUrl(contributionIds.join('/'));
    }

    toggle = (type) => {
        this.setState(prevState => ({
            [type]: !prevState[type],
        }));
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ properties }) => ({
            properties: arrayMove(properties, oldIndex, newIndex),
        }), () => {
            this.generateUrl();
        });
    }

    // code is a bit ugly because the properties inside an array and not an object
    toggleProperty = (id) => {
        let newState = dotProp.set(this.state, 'properties', properties => {
            properties.forEach((property, index) => {
                if (property.id === id) {
                    properties[index].active = !properties[index].active
                }
            });

            return properties;
        });

        this.setState(newState, () => {
            this.generateUrl();
        });
    }

    propertiesToQueryString = () => {
        let queryString = '';

        this.state.properties.forEach((property, index) => {
            if (property.active) {
                queryString += property.id + ',';
            }
        });
        queryString = queryString.slice(0, -1);

        return queryString;
    }

    generateUrl = (contributionIds, propertyIds) => {
        if (!contributionIds) {
            contributionIds = this.getContributionIdsFromUrl().join('/');
        }
        if (!propertyIds) {
            propertyIds = this.propertiesToQueryString();
        }

        let url = ROUTES.COMPARISON.replace('*', '');
        this.props.history.push(url + contributionIds + '?properties=' + propertyIds);
    }

    scrollNext = () => {
        this.scrollContainer.current.scrollLeft += this.scrollAmount
    }
    scrollBack = () => {
        this.scrollContainer.current.scrollLeft -= this.scrollAmount
    }
    handleScroll = () => {
        const { scrollWidth, offsetWidth, scrollLeft } = this.scrollContainer.current;

        this.setState({
            showBackButton: this.scrollContainer.current.scrollLeft !== 0,
            showNextButton: offsetWidth + scrollLeft !== scrollWidth
        });
    }

    render() {
        const scrollContainerClasses = classNames({
            'overflowing-left': this.state.showBackButton,
            'overflowing-right': this.state.showNextButton,
            'overflowing-both': this.state.showBackButton && this.state.showNextButton 
        });
        
        return (
            <div>
                <Container className="p-0 d-flex align-items-center">
                    <h1 className="h4 mt-4 mb-4 ">Contribution comparison</h1>
                    {/* 
                    // Created a breadcrumb so it is possible to navigate back to the original paper (or the first paper)
                    // problem is: when a contribution is performed, the first paper is not the paper from where the contribution started 
                    // So maybe a breadcrumb is not intiutive, therefore it is commented out right now
                    {this.state.contributions[0] &&
                        <BreadcrumbStyled>}
                            <BreadcrumbItem><Link to={reverse(ROUTES.VIEW_PAPER, { resourceId: this.state.contributions[0].paperId })}>Paper</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Comparison</BreadcrumbItem>
                        </BreadcrumbStyled>
                    }*/}
                </Container>

                <Container className="box pt-4 pb-4 pl-5 pr-5 clearfix ">
                    <h2 className="h4 mt-4 mb-3 float-left">
                        Compare<br />
                        <span className="h6">{this.state.title}</span>
                    </h2>

                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                        <DropdownToggle color="darkblue" size="sm" className="float-right mb-4 mt-4 ml-1 pl-3 pr-3" >
                            <span className="mr-2">Options</span> <Icon icon={faEllipsisV} />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => this.toggle('showPropertiesDialog')}>Select properties</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={() => this.toggle('showShareDialog')}>Share link</DropdownItem>
                            <DropdownItem divider />
                            {this.state.csvData ?
                                <CSVLink
                                    data={this.state.csvData}
                                    filename={'ORKG Contribution Comparison.csv'}
                                    className="dropdown-item"
                                    target="_blank"
                                    onClick={this.exportAsCsv}
                                >
                                    Export as CSV
                                </CSVLink>
                                : ''}
                            <GeneratePdf id="comparisonTable" />
                        </DropdownMenu>
                    </Dropdown>

                    {/*<Button color="darkblue" className="float-right mb-4 mt-4 " size="sm">Add to comparison</Button>*/}

                    <ScrollContainer ref={this.scrollContainer} className={scrollContainerClasses}>
                        <Table id="comparisonTable" className="mb-0" style={{ borderCollapse: 'collapse', tableLayout: 'fixed', height: 'max-content', width: '100%' }}>
                            <tbody className="table-borderless">
                                <tr className="table-borderless">
                                    <Properties><PropertiesInner className="first">Properties</PropertiesInner></Properties>

                                    {this.state.contributions.map((contribution, index) => {
                                        return (
                                            <ItemHeader key={`contribution${index}`}>
                                                <ItemHeaderInner>
                                                    <Link to={reverse(ROUTES.VIEW_PAPER, { resourceId: contribution.paperId })}>
                                                        {contribution.title}
                                                    </Link>
                                                    <br />
                                                    <Contribution>{contribution.contributionLabel}</Contribution>
                                                </ItemHeaderInner>

                                                {this.state.contributions.length > 2 &&
                                                    <Delete onClick={() => this.removeContribution(contribution.id)}>
                                                        <Icon icon={faTimes} />
                                                    </Delete>}
                                            </ItemHeader>
                                        )
                                    })}
                                </tr>

                                {this.state.properties.map((property, index) => {
                                    if (!property.active) {
                                        return null;
                                    }

                                    return (
                                        <Row key={`row${index}`}>
                                            <Properties>
                                                <PropertiesInner>
                                                    {/*For when the path is available: <Tooltip message={property.path} colorIcon={'#606679'}>*/}
                                                    {capitalize(property.label)}
                                                    {/*</Tooltip>*/}
                                                </PropertiesInner>
                                            </Properties>
                                            {this.state.contributions.map((contribution, index2) => {
                                                const data = this.state.data[property.id][index2];

                                                return (
                                                    <Item key={`data${index2}`}>
                                                        <ItemInner>
                                                            {data.map((date, index) => (
                                                                Object.keys(date).length > 0 ?
                                                                    date.type === 'resource' ? (
                                                                        <span key={`value-${index}`}>
                                                                            {index > 0 && <br />}
                                                                            <span
                                                                                className="btn-link"
                                                                                onClick={() => this.openStatementBrowser(date.resourceId, date.label)}
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                {date.label}
                                                                            </span>
                                                                        </span>
                                                                    ) : date.label
                                                                    : <span className="font-italic" key={`value-${index}`}>Empty</span>
                                                            ))}
                                                        </ItemInner>
                                                    </Item>)
                                            })}
                                        </Row>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </ScrollContainer>
                    {this.state.showBackButton &&
                        <ScrollButton onClick={this.scrollBack} className="back"><Icon icon={faArrowCircleLeft} /></ScrollButton>
                    }
                    {this.state.showNextButton &&
                        <ScrollButton onClick={this.scrollNext} className="next"><Icon icon={faArrowCircleRight} /></ScrollButton>
                    }
                </Container>

                {this.state.modal &&
                    <StatementBrowserDialog
                        show={this.state.modal}
                        toggleModal={() => this.toggle('modal')}
                        resourceId={this.state.dialogResourceId}
                        resourceLabel={this.state.dialogResourceLabel}
                    />
                }

                <SelectProperties
                    properties={this.state.properties}
                    showPropertiesDialog={this.state.showPropertiesDialog}
                    togglePropertiesDialog={() => this.toggle('showPropertiesDialog')}
                    generateUrl={this.generateUrl}
                    toggleProperty={this.toggleProperty}
                    onSortEnd={this.onSortEnd}
                />

                <Share
                    showDialog={this.state.showShareDialog}
                    toggle={() => this.toggle('showShareDialog')}
                    url={window.location.href}
                />
            </div>
        );
    }
}

Comparison.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            paperId: PropTypes.string,
            comparisonId: PropTypes.string,
        }).isRequired,
    }).isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    viewPaper: state.viewPaper,
});

export default connect(
    mapStateToProps
)(Comparison);