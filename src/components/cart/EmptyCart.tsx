'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12"
    >
      <div className="mb-6 rounded-full bg-dark-700 p-8">
        <ShoppingCart className="size-16 text-white/50" />
      </div>
      <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
      <p className="mt-2 text-center text-white/70">
        Descubrí nuestros productos y empezá a agregar
      </p>
      <Link href="/menu" className="mt-8">
        <Button variant="secondary">Ver Menú</Button>
      </Link>
    </motion.div>
  );
}
