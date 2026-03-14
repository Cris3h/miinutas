'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  isLoading?: boolean;
  cartQuantity?: number;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onShowToast: (message: string) => void;
  mode?: 'add' | 'edit';
  initialQuantity?: number;
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onUpdateQuantity,
  onShowToast,
  mode = 'add',
  initialQuantity = 1,
  isLoading = false,
  cartQuantity = 0,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(mode === 'edit' ? initialQuantity : 1);
  }, [product?._id, mode, initialQuantity]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const showContent = product && !isLoading;

  const availableStock = product ? product.stock - (mode === 'add' ? cartQuantity : 0) : 0;
  const exceedsStock = mode === 'add' && product && quantity + cartQuantity > product.stock;

  const handleSubmit = () => {
    if (!product) return;
    if (exceedsStock) return;
    const maxQty = mode === 'add' ? availableStock : product.stock;
    const qty = Math.min(Math.max(1, quantity), maxQty);
    if (product.stock <= 0 && mode === 'add') return;

    if (mode === 'edit' && onUpdateQuantity) {
      onUpdateQuantity(product._id, qty);
      onShowToast('Cantidad actualizada');
    } else {
      onAddToCart(product, qty);
      onShowToast('Producto agregado al carrito');
    }
    onClose();
  };

  const clampedQty = product
    ? Math.min(
        Math.max(1, quantity),
        mode === 'add' ? availableStock : product.stock
      )
    : 1;
  const isEdit = mode === 'edit';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[800px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gold-300/20 bg-dark-800 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-300/50"
              aria-label="Cerrar modal"
            >
              <X className="size-5" />
            </button>

            <div className="max-h-[90vh] overflow-y-auto p-6">
              {!showContent ? (
                <div className="animate-pulse space-y-6">
                  <div className="aspect-video rounded-xl bg-dark-700" />
                  <div className="h-8 w-3/4 rounded bg-dark-700" />
                  <div className="h-4 w-full rounded bg-dark-700" />
                  <div className="h-4 w-2/3 rounded bg-dark-700" />
                  <div className="h-12 w-1/3 rounded bg-dark-700" />
                </div>
              ) : (
                <>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-dark-700">
                {product.videoUrl ? (
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/30">
                    Sin imagen
                  </div>
                )}
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gold-200">
                {product.name}
              </h2>
              <p className="mt-2 text-white/80">
                {product.description || 'Sin descripción'}
              </p>
              <p className="mt-4 text-3xl font-bold text-gold-100">
                {formatPrice(product.price)}
              </p>

              <div className="mt-6">
                <p className="mb-2 text-sm text-white/60">
                  {mode === 'add' && cartQuantity > 0
                    ? `Disponibles: ${availableStock} (${cartQuantity} en carrito)`
                    : `Stock: ${product.stock} unidades`}
                </p>
                {exceedsStock && (
                  <p className="mb-2 text-sm text-red-400">
                    Stock insuficiente (máx: {availableStock} disponibles)
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-gold-300/30 bg-dark-700">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="rounded-l-lg p-3 text-white/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-inset"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="size-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={mode === 'add' ? availableStock : product.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(
                            mode === 'add' ? availableStock : product.stock,
                            Math.max(1, parseInt(e.target.value, 10) || 1)
                          )
                        )
                      }
                      className="w-16 border-0 bg-transparent py-2 text-center text-white focus:outline-none focus:ring-0"
                      aria-label="Cantidad"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(
                            mode === 'add' ? availableStock : product.stock,
                            q + 1
                          )
                        )
                      }
                      disabled={
                        quantity >=
                        (mode === 'add' ? availableStock : product.stock)
                      }
                      className="rounded-r-lg p-3 text-white/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-inset"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full py-4 text-lg"
                  onClick={handleSubmit}
                  disabled={
                    (product.stock <= 0 && !isEdit) || exceedsStock || availableStock <= 0
                  }
                >
                  {isEdit
                    ? `Actualizar cantidad (${clampedQty})`
                    : `Agregar ${clampedQty} al carrito`}
                </Button>
              </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
