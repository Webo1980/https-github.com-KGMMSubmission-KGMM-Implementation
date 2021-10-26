import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import StatementActionButton from 'components/StatementBrowser/StatementActionButton/StatementActionButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DescriptionTooltip from 'components/DescriptionTooltip/DescriptionTooltip';
import { getSuggestedProperties, createProperty } from 'actions/statementBrowser';
import { useSelector, useDispatch } from 'react-redux';
import { ENTITIES } from 'constants/graphSettings';

const PropertySuggestions = () => {
    const dispatch = useDispatch();
    const selectedResource = useSelector(state => state.statementBrowser.selectedResource);
    const suggestedProperties = useSelector(state => getSuggestedProperties(state, selectedResource));

    return (
        <>
            <p className="text-muted mt-4">Suggested properties</p>
            <ListGroup>
                {suggestedProperties.map((c, index) => (
                    <ListGroupItem
                        onClick={() => {
                            dispatch(
                                createProperty({
                                    resourceId: selectedResource,
                                    existingPredicateId: c.property.id,
                                    label: c.property.label,
                                    isTemplate: false,
                                    createAndSelect: true
                                })
                            );
                        }}
                        style={{ cursor: 'pointer' }}
                        key={`suggested-property-${index}`}
                    >
                        <StatementActionButton
                            className="mr-2"
                            title="Add property"
                            icon={faPlus}
                            action={() => {
                                dispatch(
                                    createProperty({
                                        resourceId: selectedResource,
                                        existingPredicateId: c.property.id,
                                        label: c.property.label,
                                        isTemplate: false,
                                        createAndSelect: true
                                    })
                                );
                            }}
                        />
                        <DescriptionTooltip id={c.property.id} typeId={ENTITIES.PREDICATE}>
                            {c.property.label}
                            <Badge pill className="ml-2">
                                {c.value?.label ?? ''}
                            </Badge>
                        </DescriptionTooltip>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </>
    );
};

export default PropertySuggestions;
