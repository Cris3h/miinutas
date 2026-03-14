'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';

export default function PaymentSuccessPage() {
  return (
    <PageTransition>
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-dark-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex max-w-md flex-col items-center text-center"
      >
        <div className="mb-6 rounded-full bg-green-400/10 p-6">
          <CheckCircle className="size-16 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">¡Pago exitoso!</h1>
        <p className="mt-3 text-white/80">
          Tu pedido ha sido confirmado. Recibirás una notificación cuando esté
          listo.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link href="/">
            <Button variant="primary">Volver al inicio</Button>
          </Link>
          <Link href="/menu">
            <Button variant="secondary">Ver menú</Button>
          </Link>
        </div>
      </motion.div>
    </main>
    </PageTransition>
  );
}
