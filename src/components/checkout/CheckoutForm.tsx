'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { CheckoutFormData } from '@/lib/types';
import type { CheckoutFormErrors } from '@/lib/validations';
import { validateCheckoutForm } from '@/lib/validations';
import { Button } from '@/components/ui/Button';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  loading: boolean;
}

const INITIAL_DATA: CheckoutFormData = {
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  customerZipCode: '',
  customerEmail: '',
  notes: '',
};

export function CheckoutForm({ onSubmit, loading }: CheckoutFormProps) {
  const [data, setData] = useState<CheckoutFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (field !== 'notes' && touched[field]) {
      const newErrors = validateCheckoutForm({
        customerName: field === 'customerName' ? value : data.customerName,
        customerPhone: field === 'customerPhone' ? value : data.customerPhone,
        customerEmail: field === 'customerEmail' ? value : data.customerEmail,
      });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof typeof newErrors] }));
    }
  };

  const handleBlur = (field: keyof CheckoutFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'notes') return;
    const newErrors = validateCheckoutForm({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
    });
    setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof typeof newErrors] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateCheckoutForm({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
    });
    setErrors(newErrors);
    setTouched({
      customerName: true,
      customerPhone: true,
      customerEmail: true,
    });

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors || !data.customerName.trim() || !data.customerPhone.trim()) {
      return;
    }

    onSubmit({
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerAddress: data.customerAddress?.trim() || undefined,
      customerZipCode: data.customerZipCode?.trim() || undefined,
      customerEmail: data.customerEmail?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
    });
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const missingRequired =
    !data.customerName.trim() || !data.customerPhone.trim();
  const isDisabled = hasErrors || missingRequired || loading;

  const inputBase =
    'w-full rounded-lg border bg-dark-700 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300/50 transition-colors';
  const inputError = 'border-red-400 focus:border-red-400 focus:ring-red-400/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="customerName"
          className="mb-2 block font-semibold text-gold-200"
        >
          Nombre completo *
        </label>
        <input
          id="customerName"
          type="text"
          value={data.customerName}
          onChange={(e) => handleChange('customerName', e.target.value)}
          onBlur={() => handleBlur('customerName')}
          placeholder="Juan Pérez"
          disabled={loading}
          className={`${inputBase} ${errors.customerName ? inputError : 'border-gold-300/20'}`}
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-400">{errors.customerName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="customerPhone"
          className="mb-2 block font-semibold text-gold-200"
        >
          Teléfono *
        </label>
        <input
          id="customerPhone"
          type="tel"
          value={data.customerPhone}
          onChange={(e) => handleChange('customerPhone', e.target.value)}
          onBlur={() => handleBlur('customerPhone')}
          placeholder="+54 9 341 123-4567"
          disabled={loading}
          className={`${inputBase} ${errors.customerPhone ? inputError : 'border-gold-300/20'}`}
        />
        {errors.customerPhone && (
          <p className="mt-1 text-sm text-red-400">{errors.customerPhone}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="customerAddress"
          className="mb-2 block font-semibold text-gold-200"
        >
          Dirección de entrega
        </label>
        <input
          id="customerAddress"
          type="text"
          value={data.customerAddress || ''}
          onChange={(e) => handleChange('customerAddress', e.target.value)}
          placeholder="Calle 123, Rosario, Santa Fe"
          disabled={loading}
          className={`${inputBase} border-gold-300/20`}
        />
      </div>

      <div>
        <label
          htmlFor="customerZipCode"
          className="mb-2 block font-semibold text-gold-200"
        >
          Código postal
        </label>
        <input
          id="customerZipCode"
          type="text"
          value={data.customerZipCode || ''}
          onChange={(e) => handleChange('customerZipCode', e.target.value)}
          onBlur={() =>
            setData((prev) => ({
              ...prev,
              customerZipCode: (prev.customerZipCode ?? '').trim(),
            }))
          }
          placeholder="Ej: 1234"
          disabled={loading}
          className={`${inputBase} border-gold-300/20`}
        />
      </div>

      <div>
        <label
          htmlFor="customerEmail"
          className="mb-2 block font-semibold text-gold-200"
        >
          Email
        </label>
        <input
          id="customerEmail"
          type="email"
          value={data.customerEmail || ''}
          onChange={(e) => handleChange('customerEmail', e.target.value)}
          onBlur={() => handleBlur('customerEmail')}
          placeholder="juan@ejemplo.com"
          disabled={loading}
          className={`${inputBase} ${errors.customerEmail ? inputError : 'border-gold-300/20'}`}
        />
        {errors.customerEmail && (
          <p className="mt-1 text-sm text-red-400">{errors.customerEmail}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-2 block font-semibold text-gold-200"
        >
          Notas adicionales (opcional)
        </label>
        <textarea
          id="notes"
          value={data.notes || ''}
          onChange={(e) =>
            handleChange('notes', e.target.value.slice(0, 500))
          }
          placeholder="Ej: Sin cebolla, tocar timbre 2 veces"
          disabled={loading}
          maxLength={500}
          rows={3}
          className={`${inputBase} resize-none border-gold-300/20`}
        />
        <p className="mt-1 text-xs text-white/50">
          {(data.notes?.length ?? 0)}/500 caracteres
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 text-lg"
        disabled={isDisabled}
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Procesando compra...
          </>
        ) : (
          'Finalizar compra'
        )}
      </Button>
    </form>
  );
}
