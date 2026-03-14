'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { adminApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';

export interface CategoryOption {
  _id: string;
  name: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
  categories?: CategoryOption[];
}

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  videoUrl: string;
  category: string;
  active: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  category?: string;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  price: '',
  stock: '0',
  imageUrl: '',
  videoUrl: '',
  category: '',
  active: true,
};

function validateForm(data: FormData, isEdit: boolean): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Nombre requerido';
  else if (data.name.trim().length < 3)
    errors.name = 'Mínimo 3 caracteres';
  if (!data.price || Number(data.price) <= 0) errors.price = 'Precio requerido (mayor a 0)';
  if (data.stock === '' || Number(data.stock) < 0)
    errors.stock = 'Stock debe ser 0 o más';
  if (!data.category) errors.category = 'Categoría requerida';
  if (data.description.length > 1000) errors.description = 'Máximo 1000 caracteres';
  return errors;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
  categories = [],
}: ProductFormModalProps) {
  const toast = useToast();
  const [data, setData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const isEdit = !!product;

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setData({
          name: product.name,
          description: product.description || '',
          price: String(product.price),
          stock: String(product.stock),
          imageUrl: product.imageUrl || '',
          videoUrl: product.videoUrl || '',
          category:
            typeof product.category === 'object'
              ? product.category._id
              : product.category,
          active: product.active,
        });
      } else {
        setData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(data, isEdit);
    setErrors(formErrors);
    if (Object.values(formErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description.trim() || undefined,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl: data.imageUrl.trim() || undefined,
        videoUrl: data.videoUrl.trim() || undefined,
        category: data.category,
        ...(isEdit && { active: data.active }),
      };

      if (isEdit && product) {
        await adminApi.updateProduct(product._id, payload);
        toast.success('Producto actualizado');
      } else {
        await adminApi.createProduct({
          name: payload.name,
          description: payload.description,
          price: payload.price,
          stock: payload.stock,
          imageUrl: payload.imageUrl,
          category: payload.category,
        });
        toast.success('Producto creado');
      }
      onClose();
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al guardar producto'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full rounded-lg border bg-dark-700 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300/50 transition-colors';
  const inputError =
    'border-red-400 focus:border-red-400 focus:ring-red-400/20';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[60] max-h-[90vh] w-[calc(100%-2rem)] max-w-[600px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-gold-300/30 bg-dark-800 p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gold-200">
              {isEdit ? 'Editar producto' : 'Nuevo producto'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-gold-200">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      name: e.target.value.slice(0, 100),
                    }))
                  }
                  placeholder="Ej: Milanesa napolitana"
                  maxLength={100}
                  disabled={loading}
                  className={`${inputBase} ${errors.name ? inputError : 'border-gold-300/20'}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gold-200">
                  Descripción
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      description: e.target.value.slice(0, 1000),
                    }))
                  }
                  placeholder="Descripción del producto"
                  rows={3}
                  maxLength={1000}
                  disabled={loading}
                  className={`${inputBase} resize-none border-gold-300/20`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-semibold text-gold-200">
                    Precio *
                  </label>
                  <input
                    type="number"
                    value={data.price}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="0.00"
                    min={0.01}
                    step={0.01}
                    disabled={loading}
                    className={`${inputBase} ${errors.price ? inputError : 'border-gold-300/20'}`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-400">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block font-semibold text-gold-200">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={data.stock}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, stock: e.target.value }))
                    }
                    placeholder="0"
                    min={0}
                    disabled={loading}
                    className={`${inputBase} ${errors.stock ? inputError : 'border-gold-300/20'}`}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-400">{errors.stock}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gold-200">
                  URL de imagen
                </label>
                <input
                  type="url"
                  value={data.imageUrl}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  disabled={loading}
                  className={`${inputBase} border-gold-300/20`}
                />
                {data.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={data.imageUrl}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gold-200">
                  URL de video
                </label>
                <input
                  type="url"
                  value={data.videoUrl}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, videoUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  disabled={loading}
                  className={`${inputBase} border-gold-300/20`}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gold-200">
                  Categoría *
                </label>
                <select
                  value={data.category}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  disabled={loading}
                  className={`${inputBase} ${errors.category ? inputError : 'border-gold-300/20'}`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                )}
              </div>

              {isEdit && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={data.active}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        active: e.target.checked,
                      }))
                    }
                    disabled={loading}
                    className="size-5 rounded border-gold-300/30 bg-dark-700 text-gold-300 focus:ring-gold-300/50"
                  />
                  <label htmlFor="active" className="font-medium text-gold-200">
                    Producto activo (visible en el menú)
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
