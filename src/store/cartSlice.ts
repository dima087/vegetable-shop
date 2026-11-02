import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Product } from '../api/products';

interface CartState {
    items: Record<string, number>;
}

const initialState: CartState = {
    items: {},
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: { payload: { productId: string; quantity: number } }) => {
            const { productId, quantity } = action.payload;
            if (quantity <= 0) return;
            state.items[productId] = (state.items[productId] || 0) + quantity;
        },
        removeFromCart: (state, action: { payload: string }) => {
            delete state.items[action.payload];
        },
        updateCartQuantity: (state, action: { payload: { productId: string; quantity: number } }) => {
            const { productId, quantity } = action.payload;
            if (quantity <= 0) {
                delete state.items[productId];
            } else {
                state.items[productId] = quantity;
            }
        },
    },
});

export const { addToCart, removeFromCart, updateCartQuantity } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartDetails = createSelector(
    [(state: RootState) => state.cart.items, (state: RootState) => state.products.items],
    (cartItems, products) => {
        return Object.entries(cartItems)
            .map(([id, qty]) => {
                const product = products.find((p) => String(p.id) === id);
                return product ? { product, qty } : null;
            })
            .filter(Boolean) as { product: Product; qty: number }[];
    }
);

export const selectTotalItems = createSelector([selectCartDetails], (details) =>
    details.reduce((sum, item) => sum + item.qty, 0)
);

export const selectTotalPrice = createSelector([selectCartDetails], (details) =>
    details.reduce((sum, item) => sum + item.product.price * item.qty, 0)
);