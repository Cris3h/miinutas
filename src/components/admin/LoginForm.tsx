'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/useToast';
import { validateLoginForm, type LoginFormErrors } from '@/lib/validations';
import { Button } from '@/components/ui/Button';

const INITIAL_EMAIL = '';
const INITIAL_PASSWORD = '';

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState(INITIAL_EMAIL);
  const [password, setPassword] = useState(INITIAL_PASSWORD);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value);
    else setPassword(value);
    if (touched[field]) {
      const newErrors = validateLoginForm({
        email: field === 'email' ? value : email,
        password: field === 'password' ? value : password,
      });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateLoginForm({ email, password });
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateLoginForm({ email, password });
    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const { access_token } = await api.login(email.trim(), password);
      useAuthStore.getState().login(access_token);
      toast.success('Bienvenido de vuelta');
      router.push('/admin/dashboard');
    } catch {
      toast.error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full rounded-lg border bg-dark-700 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300/50 transition-colors';
  const inputError =
    'border-red-400 focus:border-red-400 focus:ring-red-400/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="admin-email"
          className="mb-2 block font-semibold text-gold-200"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="admin@miinuta.com"
          disabled={loading}
          autoComplete="email"
          className={`${inputBase} ${errors.email ? inputError : 'border-gold-300/20'}`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block font-semibold text-gold-200"
        >
          Contraseña
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          placeholder="••••••••"
          disabled={loading}
          autoComplete="current-password"
          minLength={6}
          className={`${inputBase} ${errors.password ? inputError : 'border-gold-300/20'}`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 text-lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </form>
  );
}
