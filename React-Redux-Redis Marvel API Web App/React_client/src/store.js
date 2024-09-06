import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import rootReducer from './reducers/rootReducers';

// Redux-persist configuration
const persistConfig = {
  key: 'root', // key for localStorage
  storage, // storage engine
};

// Wrap the root reducer with redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
});

// Create the persistor object
const persistor = persistStore(store);

// Export both the store and persistor
export { store, persistor };
