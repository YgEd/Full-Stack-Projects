import {combineReducers} from '@reduxjs/toolkit';
import collectionReducer from './collectionReducer';
import select from './selectReducer'
const rootReducer = combineReducers({
  collections: collectionReducer,
  selectors: select
});

export default rootReducer;