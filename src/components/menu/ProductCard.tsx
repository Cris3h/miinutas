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
  const hasPrice = typeof product.price === 'number' && !Number.isNaN(product.price);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group flex h-full min-h-[300px] cursor-pointer flex-col rounded-xl border border-gold-300/20 bg-dark-800 p-3 transition-all duration-200 hover:border-gold-300/40 hover:shadow-[0_0_25px_rgba(212,175,55,0.1)] sm:min-h-[360px] sm:p-4 md:min-h-[400px]"
    >
      {/* Imagen - altura fija con aspect ratio */}
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-lg bg-dark-700">
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

      {/* Contenido - ocupa espacio flexible, overflow con ellipsis */}
      <div className="mt-2 flex min-h-0 flex-1 flex-col sm:mt-3">
        {/* Nombre - 1 línea fija */}
        <h3
          className="h-5 shrink-0 truncate text-sm font-bold text-gold-200 sm:h-6 sm:text-base"
          title={product.name}
        >
          {product.name}
        </h3>
        {/* Descripción - 2 líneas fijas, ellipsis si excede */}
        <p
          className="mt-1 line-clamp-2 min-h-[2.25rem] shrink-0 text-xs leading-tight text-white/70 sm:min-h-[2.5rem] sm:text-sm"
          title={product.description || 'Sin descripción'}
        >
          {product.description || 'Sin descripción'}
        </p>

        {/* Precio - altura fija (min-h) para que el botón no suba si falta */}
        <div className="mt-1.5 min-h-[24px] shrink-0 sm:mt-2 sm:min-h-[28px]">
          {hasPrice ? (
            <p className="text-base font-semibold text-gold-100 sm:text-lg">
              {formatPrice(product.price)}/kg
            </p>
          ) : (
            <span className="text-white/30">—</span>
          )}
        </div>

        {/* Espaciador - empuja el botón al fondo */}
        <div className="min-h-0 flex-1" aria-hidden />

        {/* Botón - siempre al fondo, centrado */}
        <div
          className="mt-3 flex shrink-0 justify-center sm:mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="secondary"
            className="px-6 text-sm sm:px-8 sm:text-base"
            onClick={onAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="size-4" />
            Agregar al carrito
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
