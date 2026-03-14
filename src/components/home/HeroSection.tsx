'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CONTACT_PHONE, DELIVERY_ZONE } from '@/lib/constants';
import { Phone, MapPin } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-dark-900 px-4">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-900 to-gold-300/5"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-300/5 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-5xl font-bold tracking-tight text-gold-200 sm:text-6xl md:text-7xl"
        >
          miinuta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mt-4 max-w-md text-lg text-white/80 sm:text-xl"
        >
          Milanesas y empanados con onda. Cocina casera, sabor de verdad.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mt-10"
        >
          <Link href="/menu">
            <Button variant="primary" className="text-lg px-8 py-4">
              Ver Menú
            </Button>
          </Link>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-col items-center gap-4 text-sm text-white/60 sm:flex-row sm:gap-8"
        >
          <a
            href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
            className="flex items-center gap-2 hover:text-gold-200 transition-colors"
          >
            <Phone className="h-4 w-4" />
            {CONTACT_PHONE}
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {DELIVERY_ZONE}
          </span>
        </motion.footer>
      </div>
    </section>
  );
}
