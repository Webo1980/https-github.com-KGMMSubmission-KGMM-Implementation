import * as type from 'actions/types';
import { createLiteral, updateLiteral } from 'services/backend/literals';
import { createResource, updateResource, updateResourceClasses } from 'services/backend/resources';
import { CLASSES, PREDICATES } from 'constants/graphSettings';
import { createLiteralStatement, createResourceStatement } from 'services/backend/statements';

export const load = payload => dispatch => {
    dispatch({
        type: type.ARTICLE_WRITER_LOAD,
        payload
    });
};

export const setIsLoading = isLoading => dispatch => {
    dispatch({
        type: type.ARTICLE_WRITER_SET_IS_LOADING,
        isLoading
    });
};

export const updateTitle = ({ id, title }) => async dispatch => {
    // on purpose don't have a blocking update there (so don't wait with dispatching the change before updating resource)
    dispatch({
        type: type.ARTICLE_WRITER_UPDATE_TITLE,
        title
    });
    dispatch(setIsLoading(true));
    await updateResource(id, title);
    dispatch(setIsLoading(false));
};

export const updateSectionTitle = ({ sectionId, title }) => async dispatch => {
    dispatch({
        type: type.ARTICLE_WRITER_UPDATE_SECTION_TITLE,
        payload: {
            title,
            sectionId
        }
    });
    dispatch(setIsLoading(true));
    await updateResource(sectionId, title);
    dispatch(setIsLoading(false));
};

export const updateSectionMarkdown = ({ id, markdown }) => async dispatch => {
    dispatch({
        type: type.ARTICLE_WRITER_UPDATE_SECTION_MARKDOWN,
        payload: {
            markdown,
            id
        }
    });
    dispatch(setIsLoading(true));
    await updateLiteral(id, markdown);
    dispatch(setIsLoading(false));
};

export const updateSectionType = ({ sectionId, type: sectionType }) => async dispatch => {
    dispatch({
        type: type.ARTICLE_WRITER_UPDATE_SECTION_TYPE,
        payload: {
            sectionType,
            sectionId
        }
    });
    dispatch(setIsLoading(true));
    await updateResourceClasses(sectionId, [CLASSES.SECTION, sectionType]);
    dispatch(setIsLoading(false));
};

export const updateAuthors = authorResources => async dispatch => {
    dispatch({
        type: type.ARTICLE_WRITER_UPDATE_AUTHORS,
        authorResources
    });
};
export const createSection = ({ paperId, afterIndex, sectionType }) => async dispatch => {
    // TODO: based on sectionType decide what to do...
    // TODO: replace by contribution id instead of paper id
    const sectionResource = await createResource('Title', [CLASSES.SECTION, 'Introduction']);
    const markdownResource = await createLiteral('Text');
    await createResourceStatement(paperId, PREDICATES.HAS_SECTION, sectionResource.id);
    await createLiteralStatement(sectionResource.id, PREDICATES.HAS_CONTENT, markdownResource.id);
    dispatch({
        type: type.ARTICLE_WRITER_CREATE_SECTION,
        payload: {
            afterIndex,
            sectionId: sectionResource.id,
            markdownId: markdownResource.id,
            typeId: 'Introduction'
        }
    });
};
