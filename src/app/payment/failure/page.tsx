'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';

export default function PaymentFailurePage() {
  return (
    <PageTransition>
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-dark-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex max-w-md flex-col items-center text-center"
      >
        <div className="mb-6 rounded-full bg-red-400/10 p-6">
          <XCircle className="size-16 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Pago rechazado</h1>
        <p className="mt-3 text-white/80">
          Hubo un problema con el pago. Podés intentar nuevamente o
          contactarnos.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link href="/cart">
            <Button variant="primary">Reintentar</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Volver al inicio</Button>
          </Link>
        </div>
      </motion.div>
    </main>
    </PageTransition>
  );
}
