'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  cartQuantity?: number;
}

export function ProductCard({
  product,
  onClick,
  onAddToCart,
  cartQuantity = 0,
}: ProductCardProps) {
  const inCart = cartQuantity > 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-gold-300/20 bg-dark-800 p-4 transition-all duration-200 hover:border-gold-300/40 hover:shadow-[0_0_25px_rgba(212,175,55,0.1)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-dark-700">
        {inCart && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-2 top-2 z-10 rounded-full bg-gold-300 px-2.5 py-1 text-xs font-semibold text-dark-900"
          >
            En el carrito{cartQuantity > 1 ? `: ${cartQuantity}` : ''}
          </motion.span>
        )}
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            Sin imagen
          </div>
        )}
      </div>

      <h3 className="mt-3 font-bold text-gold-200 line-clamp-1">{product.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-white/70">
        {product.description || 'Sin descripción'}
      </p>
      <p className="mt-2 text-lg font-semibold text-gold-100">
        {formatPrice(product.price)}/kg
      </p>

      <div
        className="mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="secondary"
          className="w-full"
          onClick={onAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="size-4" />
          Agregar al carrito
        </Button>
      </div>
    </motion.article>
  );
}
