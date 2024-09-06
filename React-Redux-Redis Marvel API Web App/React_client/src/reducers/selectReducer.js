const initalState = {
    currCollection: "your collection"
};

const selectReducer = (state = initalState, action) => {
    switch (action.type) {
        case 'SET_COLLECTION':
            return { ...state, currCollection: action.payload };
        default:
            return state;
    }
};

export default selectReducer;