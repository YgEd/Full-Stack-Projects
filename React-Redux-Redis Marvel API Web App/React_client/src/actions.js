// Selector function


export const addCollection = (newCollection) => {
    return {
        type: 'ADD_COLLECTION',
        payload: {newCollection}
    }
}

export const addComic = (addCollection, comic) => {
    return {
        type: 'ADD_TO_COLLECTION',
        payload: {addCollection, comic}
    }
}

export const removeComic = (removeCollection, comic_id) => {
    return {
        type: 'REMOVE_FROM_COLLECTION',
        payload: {removeCollection, comic_id}
    }
}

export const deleteCollection = (collection) => {
    return {
        type: 'DELETE_COLLECTION',
        payload: {deleteCollection: collection}
    }
}

export const setCollection = (value) => ({
    type: 'SET_COLLECTION',
    payload: value,
  });

