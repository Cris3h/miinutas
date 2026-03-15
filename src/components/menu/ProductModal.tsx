'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

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
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setQuantity(mode === 'edit' ? initialQuantity : 1);
    setJustAdded(false);
  }, [product?._id, mode, initialQuantity]);

  useEffect(() => {
    if (!isOpen) setJustAdded(false);
  }, [isOpen]);

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
  const availableStock = product
    ? product.stock - (mode === 'add' ? cartQuantity : 0)
    : 0;
  const exceedsStock =
    mode === 'add' && product && quantity + cartQuantity > product.stock;

  const handleSubmit = () => {
    if (!product) return;
    if (exceedsStock) return;
    const maxQty = mode === 'add' ? availableStock : product.stock;
    const qty = Math.min(Math.max(1, quantity), maxQty);
    if (product.stock <= 0 && mode === 'add') return;

    if (mode === 'edit' && onUpdateQuantity) {
      onUpdateQuantity(product._id, qty);
      onShowToast('Cantidad actualizada');
      onClose();
    } else {
      onAddToCart(product, qty);
      onShowToast('Producto agregado al carrito');
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        onClose();
      }, 800);
    }
  };

  const clampedQty = product
    ? Math.min(
        Math.max(1, quantity),
        mode === 'add' ? availableStock : product.stock
      )
    : 1;
  const isEdit = mode === 'edit';
  const displayStock = mode === 'add' ? availableStock : (product?.stock ?? 0);
  const canAdd = product && displayStock > 0 && !exceedsStock;

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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="fixed left-4 right-4 top-1/2 z-50 max-h-[85vh] -translate-y-1/2 overflow-y-auto overflow-x-hidden rounded-2xl border border-gold-300/20 bg-dark-800 shadow-2xl min-w-0 md:left-1/2 md:right-auto md:my-8 md:max-h-[90vh] md:w-full md:max-w-3xl md:-translate-x-1/2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-title"
            aria-describedby="product-description"
          >
            <div className="min-w-0 p-6 md:p-8">
              {!showContent ? (
                <div className="animate-pulse space-y-6">
                  <div className="aspect-video rounded-xl bg-dark-700" />
                  <div className="h-8 w-3/4 rounded bg-dark-700" />
                  <div className="h-4 w-full rounded bg-dark-700" />
                  <div className="h-4 w-2/3 rounded bg-dark-700" />
                  <div className="h-12 w-1/3 rounded bg-dark-700" />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Header: título + badge + cerrar */}
                  <div className="flex items-start justify-between border-b border-gold-300/20 pb-4">
                    <div className="flex-1 pr-4">
                      <h2
                        id="product-title"
                        className="break-words text-2xl font-bold text-gold-200"
                      >
                        {product.name}
                      </h2>
                      {product.category?.name && (
                        <span className="mt-2 inline-block rounded-full bg-gold-300/20 px-3 py-1 text-xs font-medium text-gold-200">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="shrink-0 rounded-full bg-dark-700/50 p-2 text-white/70 transition-colors hover:bg-dark-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-300/50"
                      aria-label="Cerrar modal"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {/* Imagen / Video */}
                  <div className="relative overflow-hidden rounded-xl">
                    {product.videoUrl ? (
                      <video
                        src={product.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="aspect-video w-full object-cover"
                      />
                    ) : product.imageUrl ? (
                      <motion.img
                        src={product.imageUrl}
                        alt={product.name}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-dark-700 text-white/30">
                        Sin imagen
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                  </div>

                  {/* Descripción */}
                  <p
                    id="product-description"
                    className="break-words text-base leading-relaxed text-white/80"
                  >
                    {product.description || 'Sin descripción'}
                  </p>

                  {/* Precio destacado con animación */}
                  <div className="rounded-lg bg-gradient-to-br from-gold-300/10 to-gold-300/5 p-4">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <motion.div
                        key={quantity}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl font-bold text-gold-100"
                      >
                        {formatPrice(product.price * quantity)}
                      </motion.div>
                      {quantity > 1 && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-sm text-white/50"
                        >
                          ({formatPrice(product.price)} c/u)
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Stock con indicador visual */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        displayStock > 10
                          ? 'bg-green-400'
                          : displayStock > 0
                            ? 'bg-orange-400'
                            : 'bg-red-400'
                      }`}
                    />
                    <span className="text-sm text-white/70">
                      {mode === 'add' && cartQuantity > 0
                        ? `${displayStock} disponibles (${cartQuantity} en carrito)`
                        : displayStock > 0
                          ? `${displayStock} unidades disponibles`
                          : 'Sin stock'}
                    </span>
                  </div>
                  {exceedsStock && (
                    <p className="text-sm text-red-400">
                      Stock insuficiente (máx: {availableStock} disponibles)
                    </p>
                  )}

                  {/* Selector de cantidad */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gold-300/30 bg-dark-700/50 p-4">
                    <span className="text-sm font-medium text-white/70">
                      Cantidad
                    </span>
                    <div className="flex items-center gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setQuantity((q) => Math.max(1, q - 1))
                        }
                        disabled={quantity <= 1}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gold-300/50 ${
                          quantity <= 1
                            ? 'cursor-not-allowed border-white/10 text-white/30'
                            : 'border-gold-300/30 text-gold-200 hover:border-gold-300 hover:bg-gold-300/10'
                        }`}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="h-5 w-5" />
                      </motion.button>
                      <motion.div
                        key={quantity}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="min-w-[3rem] text-center text-xl font-bold text-gold-100"
                      >
                        {quantity}
                      </motion.div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gold-300/50 ${
                          quantity >=
                          (mode === 'add' ? availableStock : product.stock)
                            ? 'cursor-not-allowed border-white/10 text-white/30'
                            : 'border-gold-300/30 text-gold-200 hover:border-gold-300 hover:bg-gold-300/10'
                        }`}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Botón agregar / actualizar */}
                  <motion.button
                    type="button"
                    whileHover={canAdd && !justAdded ? { scale: 1.02 } : {}}
                    whileTap={canAdd && !justAdded ? { scale: 0.98 } : {}}
                    onClick={handleSubmit}
                    disabled={
                      justAdded ||
                      (product.stock <= 0 && !isEdit) ||
                      exceedsStock ||
                      availableStock <= 0
                    }
                    className={`w-full rounded-xl py-4 text-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-offset-2 focus:ring-offset-dark-800 ${
                      (product.stock <= 0 && !isEdit) ||
                      exceedsStock ||
                      availableStock <= 0
                        ? 'cursor-not-allowed bg-gray-600 text-gray-400'
                        : 'bg-gold-300 text-dark-900 hover:bg-gold-200 hover:shadow-lg hover:shadow-gold-300/30'
                    }`}
                  >
                    {isEdit ? (
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Actualizar cantidad ({clampedQty})
                      </span>
                    ) : justAdded ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-6 w-6" />
                        ¡Agregado!
                      </motion.span>
                    ) : product.stock <= 0 ? (
                      'Sin stock'
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Agregar{' '}
                        {quantity > 1 ? `${quantity} ` : ''}al carrito
                        <span className="opacity-70">
                          {' '}
                          • {formatPrice(product.price * quantity)}
                        </span>
                      </span>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
