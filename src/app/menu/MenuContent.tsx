'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Product, Category, PaginatedResponse } from '@/lib/types';
import { useCartStore } from '@/store/cart';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { SearchBar } from '@/components/menu/SearchBar';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { SortDropdown } from '@/components/menu/SortDropdown';
import { ProductCard } from '@/components/menu/ProductCard';
import { ProductCardPlaceholder } from '@/components/menu/ProductCardPlaceholder';
import { ProductCardSkeleton } from '@/components/menu/ProductCardSkeleton';
import { ProductModal } from '@/components/menu/ProductModal';
import { ScrollToTop } from '@/components/menu/ScrollToTop';

const ITEMS_PER_PAGE = 8;

export function MenuContent() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get('search') ?? ''
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    () => searchParams.get('category') ?? null
  );
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc'>('price-desc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedCategoryId) params.set('category', selectedCategoryId);
    const qs = params.toString();
    const url = qs ? `/menu?${qs}` : '/menu';
    window.history.replaceState(null, '', url);
  }, [debouncedSearch, selectedCategoryId]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  const { data: productsData, error: productsError } = useSWR<
    PaginatedResponse<Product>
  >(
    ['products', selectedCategoryId, currentPage],
    () =>
      api.getProducts({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        categoryId: selectedCategoryId ?? undefined,
      })
  );

  const { data: categoriesData } = useSWR<PaginatedResponse<Category>>(
    'categories',
    () => api.getCategories({ page: 1, limit: 20 })
  );

  const products = productsData?.data ?? [];
  const categories = categoriesData?.data ?? [];

  const filteredBySearch = debouncedSearch
    ? products.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : products;

  const sortedProducts = [...filteredBySearch].sort((a, b) =>
    sortBy === 'price-asc' ? a.price - b.price : b.price - a.price
  );

  const isLoading = !productsData && !productsError;
  const hasProducts = sortedProducts.length > 0;
  const hasFilters = searchQuery || selectedCategoryId || sortBy !== 'price-desc';
  const totalProducts = productsData?.total ?? 0;
  const totalPages = productsData?.totalPages ?? 1;

  const getCartQuantity = useCallback(
    (productId: string) =>
      items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items]
  );

  const handleAddToCart = useCallback(
    (product: Product, quantity: number) => {
      if (product.stock <= 0) return;
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl || '',
      });
    },
    [addItem]
  );

  const handleShowToast = useCallback(
    (message: string) => toast.success(message),
    [toast]
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setSortBy('price-desc');
  }, []);

  const handleCardClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleAddFromCard = useCallback(
    (e: React.MouseEvent, product: Product) => {
      e.stopPropagation();
      if (product.stock <= 0) return;
      handleAddToCart(product, 1);
      handleShowToast('Producto agregado al carrito');
    },
    [handleAddToCart, handleShowToast]
  );

  return (
    <>
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gold-200 sm:text-5xl">
            Nuestro Menú
          </h1>
          <p className="mt-2 text-lg text-white/70">
            Explorá nuestra selección de milanesas
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
          <CategoryFilter
            categories={categories}
            selected={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
          {hasFilters && (
            <div className="flex items-center justify-between rounded-xl border border-gold-300/20 bg-dark-800/50 px-4 py-3">
              <span className="text-sm text-white/70">
                {sortedProducts.length} producto
                {sortedProducts.length !== 1 ? 's' : ''} encontrado
                {sortedProducts.length !== 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-sm font-medium text-gold-200 transition-colors hover:text-gold-100"
              >
                <X className="size-4" />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {productsError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center">
            <p className="font-medium text-red-400">
              No pudimos cargar los productos
            </p>
            <p className="mt-1 text-sm text-white/70">
              {productsError instanceof Error
                ? productsError.message
                : 'Error desconocido'}
            </p>
          </div>
        )}

        {!isLoading && !productsError && !hasProducts && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 rounded-full bg-dark-700 p-6">
              <Search className="size-12 text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              No encontramos productos
            </h3>
            <p className="mt-2 text-center text-white/70">
              {hasFilters
                ? 'Probá con otros filtros o limpiá la búsqueda'
                : 'Por el momento no hay productos disponibles'}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-6 rounded-lg bg-gold-200 px-6 py-2.5 font-semibold text-dark-900 transition-colors hover:bg-gold-100"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {!productsError && hasProducts && (
          <p className="mb-4 text-sm text-white/70">
            Página {currentPage} de {totalPages}
            {totalProducts > 0 &&
              ` · ${sortedProducts.length} de ${totalProducts} productos`}
          </p>
        )}

        {!productsError && (
          <>
            <div className="grid grid-cols-1 grid-rows-[auto] gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {isLoading
                ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : (() => {
                    const placeholdersCount = Math.max(
                      0,
                      ITEMS_PER_PAGE - sortedProducts.length
                    );
                    return (
                      <>
                        {sortedProducts.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            onClick={() => handleCardClick(product)}
                            onAddToCart={(e) => handleAddFromCard(e, product)}
                            cartQuantity={getCartQuantity(product._id)}
                          />
                        ))}
                        {Array.from({ length: placeholdersCount }).map(
                          (_, i) => (
                            <ProductCardPlaceholder
                              key={`placeholder-${i}`}
                            />
                          )
                        )}
                      </>
                    );
                  })()}
            </div>

            {hasProducts && totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex h-10 items-center gap-1 rounded-lg border border-gold-300/30 bg-dark-800/50 px-4 py-2 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-300/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-gold-200 text-dark-900'
                            : 'border border-gold-300/30 bg-dark-800/50 text-gold-200 hover:bg-gold-300/10'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="flex h-10 items-center gap-1 rounded-lg border border-gold-300/30 bg-dark-800/50 px-4 py-2 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-300/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        onShowToast={handleShowToast}
        cartQuantity={
          selectedProduct ? getCartQuantity(selectedProduct._id) : 0
        }
      />

      <ScrollToTop />
    </>
  );
}
