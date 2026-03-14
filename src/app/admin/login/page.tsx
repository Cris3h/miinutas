'use client';

import { motion } from 'framer-motion';
import { LoginForm } from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[400px] rounded-lg border border-gold-300/30 bg-dark-800 p-8 shadow-xl"
      >
        <h1 className="mb-8 text-center text-4xl font-bold text-gold-200">
          miinuta Admin
        </h1>
        <LoginForm />
      </motion.div>
    </div>
  );
}
