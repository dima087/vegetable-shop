import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppShell, Container, Title } from '@mantine/core';
import { fetchProductsThunk } from './store/productsSlice';
import { useCart } from './hooks/useCart';
import { AppHeader } from './components/AppHeader';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import type { RootState, AppDispatch } from './store';

export default function App() {
    const dispatch = useDispatch<AppDispatch>();

    const { items: products, loading, error } = useSelector((state: RootState) => state.products);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { cartDetails, totalItems, totalPrice, addToCart, removeFromCart, updateCartQuantity } = useCart();

    useEffect(() => {
        if (products.length === 0 && !loading) {
            dispatch(fetchProductsThunk());
        }
    }, [dispatch, products.length, loading]);

    const handleRetry = () => {
        dispatch(fetchProductsThunk());
    };

    return (
        <AppShell header={{ height: 60 }} padding={0}>
            <AppShell.Header withBorder>
                <AppHeader
                    totalItems={totalItems}
                    totalPrice={totalPrice}
                    onCartClick={() => setIsCartOpen(true)}
                />
            </AppShell.Header>

            <AppShell.Main bg="#f0f2f5">
                <Container size="xl" fluid mih="calc(100vh - 60px)" p="xl">
                    <Title order={2} mb="lg" ta="left" style={{ fontSize: 32, fontWeight: 700 }} c="dark">
                        Catalog
                    </Title>

                    <ProductList
                        products={products}
                        loading={loading}
                        error={error}
                        onRetry={handleRetry}
                        onAddToCart={addToCart}
                    />
                </Container>
            </AppShell.Main>

            <CartDrawer
                opened={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartDetails={cartDetails}
                totalPrice={totalPrice}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
            />
        </AppShell>
    );
}