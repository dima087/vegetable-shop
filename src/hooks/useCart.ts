import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import {
    addToCart as addToCartAction,
    removeFromCart as removeFromCartAction,
    updateCartQuantity as updateCartQuantityAction
} from '../store/cartSlice';
import { selectCartDetails, selectTotalItems, selectTotalPrice } from '../store/cartSlice';
import type { Product } from '../api/products';

export function useCart() {
    const dispatch = useDispatch<AppDispatch>();

    const cartDetails = useSelector(selectCartDetails);
    const totalItems = useSelector(selectTotalItems);
    const totalPrice = useSelector(selectTotalPrice);

    const addToCart = useCallback((product: Product, quantity: number) => {
        dispatch(addToCartAction({ productId: String(product.id), quantity }));
    }, [dispatch]);

    const removeFromCart = useCallback((productId: string | number) => {
        dispatch(removeFromCartAction(String(productId)));
    }, [dispatch]);

    const updateCartQuantity = useCallback((productId: string | number, quantity: number) => {
        dispatch(updateCartQuantityAction({ productId: String(productId), quantity }));
    }, [dispatch]);

    return {
        cartDetails,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateCartQuantity,
    };
}