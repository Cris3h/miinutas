const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{8,20}$/;

export function validateEmail(value: string): string | null {
  if (!value.trim()) return null;
  return EMAIL_REGEX.test(value.trim()) ? null : 'Email inválido';
}

export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 ? null : 'Ingresá un teléfono válido (mín. 8 dígitos)';
}

export function validateCustomerName(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length >= 3 ? null : 'Mínimo 3 caracteres';
}

export interface CheckoutFormErrors {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerEmail?: string;
}

export function validateCheckoutForm(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  const nameError = validateCustomerName(data.customerName);
  if (nameError) errors.customerName = nameError;

  const phoneError = validatePhone(data.customerPhone);
  if (phoneError) errors.customerPhone = phoneError;

  if (data.customerEmail?.trim()) {
    const emailError = validateEmail(data.customerEmail);
    if (emailError) errors.customerEmail = emailError;
  }

  return errors;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(data: {
  email: string;
  password: string;
}): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email requerido';
  } else {
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
  }

  if (!data.password) {
    errors.password = 'Contraseña requerida';
  } else if (data.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }

  return errors;
}
