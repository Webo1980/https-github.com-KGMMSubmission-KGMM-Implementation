import React from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input } from 'reactstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';

const DeleteButton = styled(Button)`
    &&& {
        margin: 0 10px 0 0;
        padding: 0;
        color: #f87474;
    }
`;

// some adjustments for caret position with tippy
const TippyDropdownToggle = styled(DropdownToggle)`
    ::after {
        vertical-align: 0.555em !important;
    }
`;

export const addYAxisSelector = ref => {
    // FETCH POSSIBLE CANDIDATES;
    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    const selectedCols = ref.selfVisModel.__sharedStateObject.selectedColumns;
    const Y_possibleValueCandidates = selectedCols.filter(item => item.propertyMapperType === 'Number');

    const newItem = Y_possibleValueCandidates[0];
    currentCustomState.yAxisSelector.push(newItem);
    // TODO some validation here;
    ref.setState({
        yAxisSelectorCount: ref.state.yAxisSelectorCount + 1,
        yAxisSelector: currentCustomState.yAxisSelector
    });
};

/** INITIALIZER **/
export const initializeFromCustomizer = ref => {
    console.log('INITIALIZING FROM CUSTOMIZER');
    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    const selectedCols = ref.selfVisModel.__sharedStateObject.selectedColumns;

    /** X-AXIS INITIALIZER **/
    const X_possibleLabelCandidates = selectedCols.filter(item => item.propertyMapperType === 'String' || item.propertyMapperType === 'Date');
    X_possibleLabelCandidates.unshift({ label: 'Contribution' });

    if (X_possibleLabelCandidates.length === 0) {
        currentCustomState.errorDataNotSupported = true;
        currentCustomState.errorValue = 0;
        currentCustomState.yAxisSelector = undefined;
        currentCustomState.yAxisLabel = ref.errorCodeItem['0'];
    } else {
        if (currentCustomState.xAxisSelector === undefined) {
            currentCustomState.xAxisSelector = X_possibleLabelCandidates[0];
        } else {
            //verify that this axis still exists;
            const selectedCols = ref.selfVisModel.__sharedStateObject.selectedColumns;
            const colId = currentCustomState.xAxisSelector.positionPropertyAnchor;
            const res = selectedCols.find(item => item.positionPropertyAnchor === colId);

            if (currentCustomState.xAxisSelector.positionPropertyAnchor && (!res || res.propertyMapperType === 'Select Mapper')) {
                // which means we need to change selector and label
                currentCustomState.xAxisSelector = X_possibleLabelCandidates[0];
                currentCustomState.xAxisLabel = X_possibleLabelCandidates[0].label;
            }
        }
        if (currentCustomState.xAxisLabel === undefined) {
            currentCustomState.xAxisLabel = X_possibleLabelCandidates[0].label;
        }
    }

    /** Y-AXIS INITIALIZER **/
    const Y_possibleValueCandidates = selectedCols.filter(item => item.propertyMapperType === 'Number');
    if (Y_possibleValueCandidates.length === 0) {
        currentCustomState.errorDataNotSupported = true;
        currentCustomState.errorValue = 1;
        currentCustomState.yAxisSelector = [];
        currentCustomState.yAxisLabel = ref.errorCodeItem['1'];
    } else {
        // update max number of dropdown items;
        ref.yAxisSelectorMaxCount = Y_possibleValueCandidates.length;
        if (!currentCustomState.yAxisSelector) {
            currentCustomState.yAxisSelector = [];
        }
        console.log('INITIALIZING Y-AXIS', currentCustomState.yAxisSelector);
        if (currentCustomState.yAxisSelector.length === 0) {
            // set it to be an array and push first item into it;
            currentCustomState.yAxisSelector = [];
            currentCustomState.yAxisSelector.push(Y_possibleValueCandidates[0]);
            currentCustomState.yAxisLabel = Y_possibleValueCandidates[0].label;
        } else {
            //check if axis still exist and is of type mapper number
            //this has to iterate over all yAxisSelectors, since it is an array;

            const validatedSelectors = [];
            currentCustomState.yAxisSelector.forEach(selector => {
                // validate
                const selectorId = selector.positionPropertyAnchor;
                const res = selectedCols.find(item => item.positionPropertyAnchor === selectorId);
                console.log('res', res);
                if (res) {
                    // is it a number?
                    if (res.propertyMapperType === 'Number') {
                        validatedSelectors.push(res);
                    }
                } else {
                    // TODO: we need to remove that thing
                    //and also check if it exists in intervals and remove it there
                }
            });
            console.log('validatedSelectors', validatedSelectors);
            currentCustomState.yAxisSelector = validatedSelectors;
        }
    }

    /** Y-AXIS INTERVALS **/
    if (currentCustomState.yAxisInterValSelectors) {
        for (const id in currentCustomState.yAxisInterValSelectors) {
            if (currentCustomState.yAxisInterValSelectors.hasOwnProperty(id)) {
                const intervalArray = currentCustomState.yAxisInterValSelectors[id];
                const validIntervalArray = [];
                intervalArray.forEach(item => {
                    if (item.item.propertyMapperType === 'Number') {
                        validIntervalArray.push(item);
                    }
                });
                currentCustomState.yAxisInterValSelectors[id] = validIntervalArray;
            }
        }
    }

    currentCustomState.isInitialized = true;
    console.log(currentCustomState);

    // apply!
    ref.setState({
        xAxisSelector: currentCustomState.xAxisSelector,
        xAxisLabel: currentCustomState.xAxisLabel,

        yAxisSelector: currentCustomState.yAxisSelector,
        yAxisLabel: currentCustomState.yAxisLabel,
        yAxisSelectorCount: currentCustomState.yAxisSelector.length,
        yAxisInterValSelectors: currentCustomState.yAxisInterValSelectors,
        isInitialized: true
    });
};

/** LABEL AXIS SELECTOR **/
export const createLabelSelectors = ref => {
    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    if (!ref.state.isInitialized) {
        // ignored state, initialization will be triggered when customization state is initialized
    } else {
        const possibleLabelCandidates = ref.selfVisModel.__sharedStateObject.selectedColumns.filter(
            item => item.propertyMapperType === 'String' || item.propertyMapperType === 'Date'
        );
        possibleLabelCandidates.unshift({ label: 'Contribution' });

        if (possibleLabelCandidates.length === 0) {
            ref.setErrorCode(0);
        } else {
            const items = possibleLabelCandidates.map((item, id) => {
                return (
                    <DropdownItem
                        key={'XSelectionDropdownItemIndexKey_' + id}
                        onClick={() => {
                            ref.setState({ xAxisSelector: item, xAxisLabel: item.label });
                            currentCustomState.xAxisSelector = item;
                            currentCustomState.xAxisLabel = item.label;
                        }}
                    >
                        <Tippy content={item.label} placement="right" disabled={item.label.length < 30}>
                            <span
                                className="d-inline-block"
                                style={{
                                    maxWidth: '150px',
                                    overflow: 'hidden',
                                    lineHeight: '1.5',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {item.label}
                            </span>
                        </Tippy>
                    </DropdownItem>
                );
            });

            return (
                <Dropdown
                    size="sm"
                    className="mt-1"
                    isOpen={ref.state.xAxisSelectorOpen}
                    toggle={() => {
                        ref.setState({
                            xAxisSelectorOpen: !ref.state.xAxisSelectorOpen
                        });
                    }}
                >
                    <TippyDropdownToggle caret color="secondary" className="text-truncate mw-100">
                        <Tippy content={ref.state.xAxisSelector.label} placement="right" disabled={ref.state.xAxisSelector.label.length < 30}>
                            <span
                                className="d-inline-block"
                                style={{
                                    maxWidth: '150px',
                                    overflow: 'hidden',
                                    lineHeight: '1.5',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {ref.state.xAxisSelector.label}
                            </span>
                        </Tippy>
                    </TippyDropdownToggle>
                    <DropdownMenu>{items}</DropdownMenu>
                </Dropdown>
            );
        }
    }
};

export const createValueSelectors = ref => {
    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    const selectedCols = ref.selfVisModel.__sharedStateObject.selectedColumns;
    if (!ref.state.isInitialized) {
        // ignored state, initialization will be triggered when customization state is initialized
    } else {
        const possibleValueCandidates = selectedCols.filter(item => item.propertyMapperType === 'Number');
        if (possibleValueCandidates.length === 0) {
            currentCustomState.errorDataNotSupported = true;
            currentCustomState.errorValue = 1;
            currentCustomState.yAxisSelector = undefined;
            currentCustomState.yAxisLabel = ref.errorCodeItem['1'];
            ref.setErrorCode(1);
        } else {
            ref.yAxisSelectorMaxCount = possibleValueCandidates.length;
            const itemsArray = [];
            for (let i = 0; i < ref.state.yAxisSelectorCount; i++) {
                const items = possibleValueCandidates.map((item, id) => {
                    return (
                        <DropdownItem
                            key={'YSelectionDropdownItemIndexKey_' + id + '_' + item.positionPropertyAnchor}
                            onClick={() => {
                                const yAxisSelector = ref.state.yAxisSelector;
                                yAxisSelector[i] = item;

                                if (i !== 0) {
                                    ref.setState({ yAxisSelector: yAxisSelector });
                                } else {
                                    currentCustomState.yAxisLabel = item.label;
                                    ref.setState({ yAxisSelector: yAxisSelector, yAxisLabel: item.label });
                                }
                            }}
                        >
                            <Tippy content={item.label} placement="right" disabled={item.label.length < 30}>
                                <span
                                    className="d-inline-block"
                                    style={{
                                        maxWidth: '220px',
                                        overflow: 'hidden',
                                        lineHeight: '1.5',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {item.label}
                                </span>
                            </Tippy>
                        </DropdownItem>
                    );
                });
                itemsArray.push(items);
            }
            return itemsArray.map((selector, id) => {
                return (
                    <div className="mt-2 mb-1" key={'ContainerValueItemSelector_' + id}>
                        <div style={{ display: 'flex' }} key={'ValueItemSelector_' + id}>
                            {id > 0 && (
                                <DeleteButton
                                    color="link"
                                    onClick={() => {
                                        removeSelector(id, ref);
                                    }}
                                >
                                    <Icon icon={faTrash} />
                                </DeleteButton>
                            )}
                            <Dropdown
                                size="sm"
                                isOpen={ref.state.yAxisSelectorOpen[id]}
                                toggle={() => {
                                    const yAxisSelectorOpen = ref.state.yAxisSelectorOpen;
                                    yAxisSelectorOpen[id] = !yAxisSelectorOpen[id];
                                    ref.setState({
                                        yAxisSelectorOpen: yAxisSelectorOpen
                                    });
                                }}
                            >
                                <TippyDropdownToggle caret color="secondary" className="text-truncate mw-100 ">
                                    <Tippy
                                        content={ref.state.yAxisSelector[id].label}
                                        placement="right"
                                        disabled={ref.state.yAxisSelector[id].label < 30}
                                    >
                                        <span
                                            className="d-inline-block"
                                            style={{
                                                maxWidth: '150px',
                                                overflow: 'hidden',
                                                lineHeight: '1.5',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {ref.state.yAxisSelector[id].label}
                                        </span>
                                    </Tippy>
                                </TippyDropdownToggle>
                                <DropdownMenu>{itemsArray[id]}</DropdownMenu>
                            </Dropdown>
                            {possibleValueCandidates.length > 1 &&
                                (!ref.state.yAxisInterValSelectors[id] ||
                                    (ref.state.yAxisInterValSelectors[id] &&
                                        ref.state.yAxisInterValSelectors[id].length < possibleValueCandidates.length)) && (
                                    <Tippy content="Add interval">
                                        <span>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                className="px-2 ml-2"
                                                //style={{ marginLeft: '5px', padding: '3px', height: ' 32px', minWidth: '82px' }}
                                                onClick={() => {
                                                    addYAxisInterval(ref, id);
                                                }}
                                            >
                                                <Icon icon={faPlus} />
                                            </Button>
                                        </span>
                                    </Tippy>
                                )}
                        </div>
                        <div className="mt-2">{createIntervalSelectors(ref, id, possibleValueCandidates)}</div>
                        <hr />
                    </div>
                );
            });
        }
    }
};

const removeSelector = (id, ref) => {
    const ySelectors = ref.state.yAxisSelector;
    const yAxisIntervals = ref.state.yAxisInterValSelectors;
    if (yAxisIntervals[id]) {
        // clear the interval for this axis
        yAxisIntervals[id] = [];
    }
    ySelectors.splice(id, 1);

    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    currentCustomState.yAxisInterValSelectors = yAxisIntervals;
    currentCustomState.yAxisSelector = ySelectors;

    ref.setState({
        ySelectors: ySelectors,
        yAxisSelectorCount: ref.state.yAxisSelectorCount - 1,
        yAxisIntervals: yAxisIntervals
    });
};

const addYAxisInterval = (ref, id) => {
    const yAxisIntervals = ref.state.yAxisInterValSelectors;
    if (!yAxisIntervals[id]) {
        // we have now an array of intervals
        yAxisIntervals[id] = [];
    }

    yAxisIntervals[id].push({ isOpen: false, item: { label: 'Select interval' } });
    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    currentCustomState.yAxisInterValSelectors = yAxisIntervals;
    ref.setState({ yAxisIntervals: yAxisIntervals });
};

const createIntervalSelectors = (ref, id, possibleValueCandidates) => {
    const yAxisIntervals = ref.state.yAxisInterValSelectors[id];
    console.log('>> HAVING INTERVAL SELECTORS: ', yAxisIntervals);
    if (yAxisIntervals && yAxisIntervals.length > 0) {
        return yAxisIntervals.map((interval, interval_id) => {
            return (
                <div key={'IntervalKey_' + interval_id} className="ml-4 mt-1">
                    <DeleteButton
                        color="link"
                        onClick={() => {
                            removeInterval(id, interval_id, ref);
                        }}
                    >
                        <Icon icon={faTrash} />
                    </DeleteButton>
                    Interval {interval_id}
                    {createIntervalDropDownSelectors(ref, id, interval_id, possibleValueCandidates)}
                </div>
            );
        });
    }
};

const removeInterval = (id, intervalId, ref) => {
    const yAxisIntervals = ref.state.yAxisInterValSelectors;
    const subInterval = yAxisIntervals[id];
    subInterval.splice(intervalId, 1);
    yAxisIntervals[id] = subInterval;
    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    currentCustomState.yAxisInterValSelectors = yAxisIntervals;
    ref.setState({ yAxisInterValSelectors: yAxisIntervals });
};

const createIntervalDropDownSelectors = (ref, id, interval_id, possibleValueCandidates) => {
    const extended = [...possibleValueCandidates];
    extended.unshift({ label: 'Select interval' });
    console.log('INTERVAL SELECTORS', extended);
    const itemsArray = extended.map((pvc, pvc_id) => {
        return (
            <DropdownItem
                className="text-truncate mw-100"
                key={'N_XSelectionDropdownItemIndexKey_' + id + '_' + interval_id + '_' + pvc_id}
                onClick={() => {
                    const intervalSelectors = ref.state.yAxisInterValSelectors;
                    intervalSelectors[id][interval_id].item = pvc;
                    ref.setState({ yAxisInterValSelectors: intervalSelectors });
                }}
            >
                {/*qnd text length handler */}

                <Tippy content={pvc.label} placement="right" disabled={pvc.label.length < 30}>
                    <span
                        className="d-inline-block"
                        style={{
                            maxWidth: '220px',
                            overflow: 'hidden',
                            lineHeight: '1.5',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {pvc.label}
                    </span>
                </Tippy>
            </DropdownItem>
        );
    });

    const isItemOpen = ref.state.yAxisInterValSelectors[id][interval_id].isOpen;
    return (
        <Dropdown
            size="sm"
            className="mt-1"
            isOpen={isItemOpen}
            toggle={() => {
                const yAxisSelectorOpen = ref.state.yAxisInterValSelectors;

                yAxisSelectorOpen[id][interval_id].isOpen = !yAxisSelectorOpen[id][interval_id].isOpen;
                ref.setState({
                    yAxisInterValSelectors: yAxisSelectorOpen
                });
            }}
        >
            <TippyDropdownToggle caret color="secondary" className="text-truncate mw-100">
                <Tippy
                    content={ref.state.yAxisInterValSelectors[id][interval_id].item.label}
                    placement="right"
                    disabled={ref.state.yAxisInterValSelectors[id][interval_id].item.label.length < 30}
                >
                    <span
                        className="d-inline-block"
                        style={{
                            maxWidth: '150px',
                            overflow: 'hidden',
                            lineHeight: '1.5',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {ref.state.yAxisInterValSelectors[id][interval_id].item.label}
                    </span>
                </Tippy>
            </TippyDropdownToggle>
            <DropdownMenu>{itemsArray}</DropdownMenu>
        </Dropdown>
    );
};

export const createLabelEditor = ref => {
    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    if (!ref.state.isInitialized) {
        // ignored state, initialization will be triggered when customization state is initialized
    } else {
        const initValue = '';

        return (
            <Input
                value={ref.state.xAxisLabel ? ref.state.xAxisLabel : initValue}
                onChange={event => {
                    currentCustomState.xAxisLabel = event.target.value;
                    ref.setState({
                        xAxisLabel: event.target.value
                    });
                }}
            />
        );
    }
};
export const createValueEditor = ref => {
    const currentCustomState = ref.selfVisModel.__sharedStateObject.customizer;
    if (!ref.state.isInitialized) {
        // ignored state, initialization will be triggered when customization state is initialized
    } else {
        const initValue = '';

        return (
            <Input
                value={ref.state.yAxisLabel ? ref.state.yAxisLabel : initValue}
                onChange={event => {
                    currentCustomState.yAxisLabel = event.target.value;
                    ref.setState({
                        yAxisLabel: event.target.value
                    });
                }}
            />
        );
    }
};
