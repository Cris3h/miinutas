'use client';

import type { CartItem } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
      <h3 className="text-lg font-semibold text-gold-200">Resumen del pedido</h3>
      <div className="mt-4 max-h-[300px] space-y-3 overflow-y-auto pr-1">
        {items.map((item) => {
          const subtotal = item.price * item.quantity;
          return (
            <div
              key={item.productId}
              className="flex justify-between gap-2 text-sm"
            >
              <span className="text-white/90">
                {item.name} ×{item.quantity}
              </span>
              <span className="shrink-0 text-gold-100">
                {formatPrice(subtotal)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 space-y-2 border-t border-gold-300/20 pt-4">
        <div className="flex justify-between text-white/80">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between pt-2">
          <span className="text-xl font-semibold text-white">Total</span>
          <span className="text-2xl font-bold text-gold-100">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
