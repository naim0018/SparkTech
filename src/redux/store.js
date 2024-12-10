import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import cartReducer from './features/CartSlice';
import authReducer from './features/AuthSlice';
import wishlistReducer from './features/wishlistSlice';
import { persistStore, persistReducer, REGISTER, PURGE, PERSIST, PAUSE, REHYDRATE, FLUSH } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'auth',
    storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        cart: cartReducer, 
        auth: persistedReducer,
        wishlist: wishlistReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: { ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
