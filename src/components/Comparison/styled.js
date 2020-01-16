import styled from 'styled-components';
import { Container } from 'reactstrap';

export const SubtitleSeparator = styled.div`
    background: ${props => props.theme.darkblue};
    width: 2px;
    height: 30px;
    margin: 0 15px;
    content: '';
    display: block;
    opacity: 0.7;
`;

export const ComparisonTitle = styled.div`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-right: 20px;
    color: #62687d;
`;

export const ContainerAnimated = styled(Container)`
    transition: 0.5s max-width;
`;

export const ReactTableWrapper = styled.div`
    clear: both;
    .rthfc .-filters .rt-th.rthfc-th-fixed-left-last,
    .rthfc .rt-th.rthfc-th-fixed-left-last,
    .rthfc .rt-td.rthfc-td-fixed-left-last,
    .ReactTable .rt-tbody .rt-td,
    .ReactTable {
        border: 0;
    }
    .ReactTable .rt-th,
    .ReactTable .rt-td,
    .ReactTable .rt-thead .rt-th,
    .ReactTable .rt-thead .rt-td {
        padding: 0;
        border: 0;
        overflow: initial;
        white-space: initial;
    }
    .ReactTable .rt-th > div {
        height: 100%;
    }
    .ReactTable .rt-tbody .rt-tr-group {
        border: 0;
    }
    .ReactTable .rt-thead .rt-tr {
        text-align: left;
        position: sticky;
        top: 0;
        background: white;
    }
    .ReactTable .rt-table {
        position: relative;
    }
    .ReactTable .rt-thead.-header {
        box-shadow: none;
    }
    .ReactTable .rt-tbody .rt-tr-group:last-child .rt-td > div div:first-child {
        border-bottom: 2px solid #cfcbcb !important;
        border-radius: 0 0 11px 11px !important;
    }
`;

export const Properties = styled.div`
    padding-right: 10px;
    padding: 0 10px 0 0 !important;
    margin: 0;
    display: inline-block;
    height: 100%;
    width: 250px;
    position: relative;
    background: transparent;
`;

export const PropertiesInner = styled.div`
    background: ${props => (props.transpose ? '#E86161' : '#80869B')};
    height: 100%;
    color: #fff;
    padding: 10px;
    border-bottom: ${props => (props.transpose ? '2px solid #fff!important' : '2px solid #8B91A5!important')};

    a {
        color: #fff !important;
    }

    &.first {
        border-radius: 11px 11px 0 0;
    }

    &.last {
        border-radius: 0 0 11px 11px;
    }
`;

export const ItemHeader = styled.div`
    padding-right: 10px;
    min-height: 50px;
    padding: 0 10px !important;
    margin: 0;
    display: inline-block;
    height: 100%;
    width: 250px;
    position: relative;
`;

export const ItemHeaderInner = styled.div`
    padding: 5px 10px;
    background: ${props => (!props.transpose ? '#E86161' : '#80869B')};
    border-radius: 11px 11px 0 0;
    color: #fff;
    height: 100%;

    a {
        color: #fff !important;
    }
`;

export const Contribution = styled.div`
    color: #ffa5a5;
    font-size: 85%;
`;

export const Delete = styled.div`
    position: absolute;
    top: 0px;
    right: 5px;
    background: #ffa3a3;
    border-radius: 20px;
    width: 24px;
    height: 24px;
    text-align: center;
    color: #e86161;
    cursor: pointer;

    &:hover {
        background: #fff;
    }
`;
