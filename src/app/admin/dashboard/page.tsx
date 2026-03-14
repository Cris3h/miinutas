'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import type { Period } from '@/lib/dashboard-utils';
import { adminApi } from '@/lib/adminApi';
import { formatPrice } from '@/lib/utils';
import { getDateRange } from '@/lib/dashboard-utils';
import { MetricCard } from '@/components/admin/MetricCard';
import { MetricCardSkeleton } from '@/components/admin/MetricCardSkeleton';
import { LowStockTable } from '@/components/admin/LowStockTable';
import { PendingOrdersList } from '@/components/admin/PendingOrdersList';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import type { Order, Payment, Product } from '@/lib/types';

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mes' },
];

function getPaymentAmount(payment: Payment): number {
  return payment.mpResponse?.transaction_amount ?? 0;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('today');
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

  const { start, end } = useMemo(() => getDateRange(period), [period]);

  const { data: ordersData, mutate: mutateOrders } = useSWR(
    'dashboard-orders',
    () => adminApi.getAllOrders({ limit: 200 }),
    { revalidateOnFocus: false, refreshInterval: 60000 }
  );

  const { data: paymentsData, mutate: mutatePayments } = useSWR(
    'dashboard-payments',
    () => adminApi.getAllPayments({ limit: 500 }),
    { revalidateOnFocus: false, refreshInterval: 60000 }
  );

  const { data: productsData } = useSWR(
    'dashboard-products',
    () =>
      adminApi.getAllProducts({
        limit: 200,
        includeInactive: false,
      }),
    { revalidateOnFocus: false }
  );

  const isMetricsLoading = !ordersData || !paymentsData;
  const isProductsLoading = !productsData;

  const orders = ordersData?.data ?? [];
  const payments = paymentsData?.data ?? [];
  const products = productsData?.data ?? [];

  const ordersInPeriod = useMemo(() => {
    return orders.filter((order) => {
      const d = new Date(order.createdAt);
      return d >= start && d <= end;
    });
  }, [orders, start, end]);

  const approvedPaymentsInPeriod = useMemo(() => {
    return payments.filter((p) => {
      const d = new Date(p.createdAt);
      const isApproved = p.status === 'approved';
      return isApproved && d >= start && d <= end;
    });
  }, [payments, start, end]);

  const pendingPaymentsInPeriod = useMemo(() => {
    return payments.filter((p) => {
      const d = new Date(p.createdAt);
      return p.status === 'pending' && d >= start && d <= end;
    });
  }, [payments, start, end]);

  const totalSales = useMemo(
    () =>
      approvedPaymentsInPeriod.reduce(
        (sum, p) => sum + getPaymentAmount(p),
        0
      ),
    [approvedPaymentsInPeriod]
  );

  const averageTicket =
    approvedPaymentsInPeriod.length > 0
      ? totalSales / approvedPaymentsInPeriod.length
      : 0;

  const lowStockProducts = useMemo(
    () =>
      (products as Product[])
        .filter((p) => p.stock < 10 && p.active)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5),
    [products]
  );

  const pendingOrders = useMemo(
    () =>
      (orders as Order[])
        .filter((o) => o.status === 'pending' || o.status === 'paid')
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10),
    [orders]
  );

  const lowStockCount = lowStockProducts.length;
  const hasLowStock = lowStockCount > 0;

  const handleRefresh = () => {
    mutateOrders();
    mutatePayments();
  };

  const handleStatusChange = () => {
    mutateOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gold-200">Dashboard</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="welcome-glow text-lg font-medium">
              bienvenido chupapija
            </span>
            <div className="flex shrink-0 rounded-lg bg-dark-600/90 p-1.5 ring-1 ring-gold-300/40">
              <img
                src="/adminIc.png"
                alt="Admin"
                className="h-10 w-10 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gold-300/20 bg-dark-800 p-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPeriod(opt.value)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  period === opt.value
                    ? 'bg-gold-200 text-dark-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-lg border border-gold-300/20 bg-dark-800 p-2 text-white/70 transition-colors hover:bg-dark-700 hover:text-gold-200"
            aria-label="Refrescar"
          >
            <RefreshCw className="size-5" />
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isMetricsLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <MetricCard
              title="Pedidos"
              value={ordersInPeriod.length}
              subtitle="Pedidos en el período"
              icon={<ShoppingBag className="size-8 text-gold-200/50" />}
            />
            <MetricCard
              title="Ventas Totales"
              value={formatPrice(totalSales)}
              subtitle="Ventas aprobadas"
              icon={<DollarSign className="size-8 text-gold-200/50" />}
            />
            <MetricCard
              title="Ticket Promedio"
              value={formatPrice(averageTicket)}
              subtitle="Por pedido"
              icon={<TrendingUp className="size-8 text-gold-200/50" />}
            />
            <MetricCard
              title="Ventas Aprobadas"
              value={approvedPaymentsInPeriod.length}
              subtitle="Pagos confirmados"
              icon={<CheckCircle className="size-8 text-gold-200/50" />}
            />
            <MetricCard
              title="Ventas Pendientes"
              value={pendingPaymentsInPeriod.length}
              subtitle="Pagos pendientes"
              icon={<Clock className="size-8 text-gold-200/50" />}
            />
            <MetricCard
              title="Stock Bajo"
              value={lowStockCount}
              subtitle="Stock < 10 unidades"
              icon={
                <AlertTriangle
                  className={`size-8 ${hasLowStock ? 'text-orange-400/80' : 'text-gold-200/50'}`}
                />
              }
              variant={hasLowStock ? 'warning' : 'default'}
            />
          </>
        )}
      </div>

      {/* Tables section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isProductsLoading ? (
          <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-dark-700" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded bg-dark-700"
                />
              ))}
            </div>
          </div>
        ) : (
          <LowStockTable products={lowStockProducts} />
        )}
        {!ordersData ? (
          <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-dark-700" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded bg-dark-700"
                />
              ))}
            </div>
          </div>
        ) : (
          <PendingOrdersList
            orders={pendingOrders}
            onViewOrder={setDetailOrderId}
          />
        )}
      </div>

      <OrderDetailModal
        isOpen={!!detailOrderId}
        onClose={() => setDetailOrderId(null)}
        orderId={detailOrderId}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
