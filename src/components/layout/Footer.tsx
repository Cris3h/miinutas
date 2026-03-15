'use client';

import Link from 'next/link';
import { Phone, MapPin, Clock } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';
import {
  WHATSAPP_NUMBER,
  WHATSAPP_MESSAGE,
  CONTACT_PHONE,
  DELIVERY_ZONE,
  BUSINESS_HOURS,
} from '@/lib/constants';

export function Footer() {
  const whatsappUrl = getWhatsAppUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gold-300/20 bg-dark-800">
      {/* Contenido principal */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Branding - full width en mobile */}
          <div>
            <h3 className="text-2xl font-bold text-gold-200">miinuta</h3>
            <p className="mt-2 text-sm text-white/80">
              Milanesas y empanados con onda.
            </p>
            <p className="mt-1 text-sm text-white/50">
              Cocina casera, sabor de verdad.
            </p>
          </div>

          {/* Links + Contacto: 2 cols en mobile, separados en tablet/desktop */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:contents">
            {/* Links de navegación */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-200">
                Navegación
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-sm text-white/70 transition-colors hover:text-gold-200"
                >
                  Inicio
                </Link>
                <Link
                  href="/menu"
                  className="text-sm text-white/70 transition-colors hover:text-gold-200"
                >
                  Menú
                </Link>
              </nav>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-200">
                Contacto
              </h4>
              <div className="flex flex-col gap-3 text-sm text-white/70">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-gold-200"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{CONTACT_PHONE}</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{DELIVERY_ZONE}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{BUSINESS_HOURS}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gold-300/10 bg-dark-900/50 px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-white/50">
          © {currentYear} miinuta. Hecho con ❤️.
        </p>
      </div>
    </footer>
  );
}
