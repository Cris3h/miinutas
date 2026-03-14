import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold-300/20 bg-dark-800 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <Link
            href="/"
            className="text-xl font-bold text-gold-200 hover:text-gold-100 transition-colors"
          >
            miinuta
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Menú
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-sm text-white/50">
          © 2025 miinuta. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
