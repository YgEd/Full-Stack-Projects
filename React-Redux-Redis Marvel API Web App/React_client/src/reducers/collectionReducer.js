import {v4 as uuid} from 'uuid';

//have a default collection in the initial state
const initalState = {
    ["your collection"]: []
}

let copyState = null;
let index = 0;


const collectionReducer = (state = initalState, action) => {
    switch (action.type) {
        case 'ADD_COLLECTION':
            const {newCollection} = action.payload
            console.log(`from add_collection: ${state}`);
            return {...state, [newCollection]: state[newCollection] || []};
        case 'ADD_TO_COLLECTION':
            const {addCollection, comic} = action.payload;
            const collect = state[addCollection] || [];
            console.log(`addCollection: ${JSON.stringify(addCollection)}, comic: ${comic}`);
            console.log(`state: ${JSON.stringify(state)}`)
            // 20 is the maximum number of comics in a collection
            if (collect.length >= 20){
                return state;
            }
            return {
                    ...state, 
                    [addCollection]: [...collect, {...comic, id: comic.id}]
                 };
        case 'REMOVE_FROM_COLLECTION':
            const {removeCollection, comic_id} = action.payload;
            const collection = state[removeCollection];
            index = collection.findIndex((comic) => comic.id === comic_id);
            copyState = [...collection];
            copyState.splice(index, 1);
            return {...state, [removeCollection]: copyState};
        case 'DELETE_COLLECTION':
            const {deleteCollection} = action.payload;
            copyState = {...state};
            delete copyState[deleteCollection];
            return copyState;
        default:
            return state;
    }
}

export default collectionReducer;