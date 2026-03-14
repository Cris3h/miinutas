'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';

export default function PaymentPendingPage() {
  return (
    <PageTransition>
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-dark-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex max-w-md flex-col items-center text-center"
      >
        <div className="mb-6 rounded-full bg-orange-400/10 p-6">
          <Clock className="size-16 text-orange-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Pago pendiente</h1>
        <p className="mt-3 text-white/80">
          Estamos esperando la confirmación del pago. Te notificaremos cuando se
          procese.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="primary">Volver al inicio</Button>
          </Link>
        </div>
      </motion.div>
    </main>
    </PageTransition>
  );
}
