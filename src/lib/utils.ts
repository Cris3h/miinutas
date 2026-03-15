/**
 * Genera URL de WhatsApp con mensaje predefinido.
 * Usa api.whatsapp.com en vez de wa.me para evitar que los emojis se corrompan en desktop/web.
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '').replace(/^\+/, '');
  const encodedMessage = encodeURIComponent(message.normalize('NFC'));
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
}
