'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { ProductModal } from '@/components/menu/ProductModal';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function CartPage() {
  const router = useRouter();
  const toast = useToast();
  const { items, updateQuantity, removeItem, getTotal, clearCart } =
    useCartStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [modalProductId, setModalProductId] = useState<string | null>(null);

  const total = getTotal();

  const { data: product, isLoading: productLoading } = useSWR<Product | null>(
    modalProductId ? ['product', modalProductId] : null,
    async () => (modalProductId ? api.getProduct(modalProductId) : null),
    { revalidateOnFocus: false }
  );

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  const handleProductClick = useCallback((productId: string) => {
    setModalProductId(productId);
  }, []);

  const handleRemove = useCallback(
    (productId: string) => {
      removeItem(productId);
      toast.info('Producto eliminado');
    },
    [removeItem, toast]
  );

  const handleAddToCart = useCallback(
    (p: Product, quantity: number) => {
      useCartStore.getState().addItem({
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity,
        imageUrl: p.imageUrl || '',
      });
    },
    []
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const cartItem = items.find((i) => i.productId === modalProductId);

  const handleClearCart = useCallback(() => {
    clearCart();
    toast.info('Carrito vaciado');
  }, [clearCart, toast]);

  if (items.length === 0) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-dark-900">
          <EmptyCart />
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-dark-900 pb-32 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-gold-200">
              Carrito de Compras
            </h1>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="size-4" />
              Vaciar carrito
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={handleRemove}
                    onProductClick={handleProductClick}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24">
                <CartSummary subtotal={total} total={total} />
                <Button
                  variant="primary"
                  className="mt-6 w-full py-4 text-lg"
                  onClick={handleProceedToCheckout}
                >
                  Proceder al checkout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-300/20 bg-dark-900/95 p-4 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/70">Total</p>
              <p className="text-2xl font-bold text-gold-100">
                {formatPrice(total)}
              </p>
            </div>
            <Button
              variant="primary"
              className="shrink-0 px-8 py-4"
              onClick={handleProceedToCheckout}
            >
              Proceder al checkout
            </Button>
          </div>
        </div>
      </main>

      <ProductModal
        product={product ?? null}
        isOpen={!!modalProductId}
        isLoading={productLoading}
        onClose={() => setModalProductId(null)}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onShowToast={toast.success}
        mode="edit"
        initialQuantity={cartItem?.quantity ?? 1}
      />

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCart}
        title="Vaciar carrito"
        message="¿Estás seguro de que querés vaciar el carrito?"
        confirmLabel="Vaciar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </PageTransition>
  );
}
