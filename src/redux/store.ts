import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productReducer from './features/product/productSlice'; 
import messageReducer from './features/openAI/messageSlice';  
// store variable is a global variable.
export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer, 
            message: messageReducer,
        }
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];