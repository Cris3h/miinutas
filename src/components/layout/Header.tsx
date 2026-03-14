'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors duration-200 pb-1 border-b-2 -mb-px ${
        active
          ? 'text-gold-100 border-gold-300'
          : 'text-white/70 hover:text-white border-transparent'
      }`}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-gold-300/20 bg-dark-900/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gold-200 transition-colors duration-200 hover:text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
        >
          miinuta
        </Link>

        <nav className="flex items-center gap-8" aria-label="Navegación principal">
          <NavLink href="/" active={pathname === '/'}>
            Inicio
          </NavLink>
          <NavLink href="/menu" active={pathname === '/menu'}>
            Menú
          </NavLink>

          <Link
            href="/cart"
            className="relative rounded p-2 text-white/70 transition-colors duration-200 hover:text-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:ring-offset-2 focus:ring-offset-dark-900"
            aria-label={`Carrito con ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
          >
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-300 text-xs font-bold text-dark-900"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
