'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { api } from '@/lib/api';
import type { CheckoutFormData } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PageTransition } from '@/components/layout/PageTransition';

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  const handleSubmit = useCallback(
    async (data: CheckoutFormData) => {
      if (items.length === 0) {
        toast.error('El carrito está vacío');
        return;
      }

      setLoading(true);

      try {
        const address = data.notes
          ? [data.customerAddress, `Notas: ${data.notes}`]
              .filter(Boolean)
              .join(' | ')
          : data.customerAddress;

        const order = await api.createOrder({
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerAddress: address || undefined,
          customerEmail: data.customerEmail,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        });

        const { initPoint } = await api.createPaymentPreference(order._id);

        clearCart();

        window.location.href = initPoint;
      } catch (err) {
        setLoading(false);
        const message =
          err instanceof Error ? err.message : 'Ocurrió un error inesperado';
        if (message.includes('preference') || message.includes('payment')) {
          toast.error('Error al procesar el pago. Contactanos.');
        } else {
          toast.error(message);
        }
      }
    },
    [items, clearCart, toast]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-dark-900 pb-32 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-gold-200">
            Finalizar compra
          </h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
                <h2 className="mb-6 text-xl font-semibold text-gold-200">
                  Datos de entrega
                </h2>
                <CheckoutForm onSubmit={handleSubmit} loading={loading} />
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24">
                <OrderSummary items={items} total={total} />
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
            <Link
              href="/cart"
              className="shrink-0 text-sm font-medium text-gold-200 transition-colors hover:text-gold-100"
            >
              Ver carrito
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
