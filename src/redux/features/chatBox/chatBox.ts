import { createSlice } from '@reduxjs/toolkit';

export interface ProductState {
    isOpen: boolean;
}

const initialState: ProductState = {
    isOpen: true,
};

export const productSlice = createSlice({
    name: 'chatbox',
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.isOpen = !state.isOpen;
          },
    },
});

export const { toggleSidebar } = productSlice.actions;

export default productSlice.reducer;