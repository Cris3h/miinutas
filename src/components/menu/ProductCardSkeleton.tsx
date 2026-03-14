import { Skeleton } from '@/components/ui/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gold-300/20 bg-dark-800 p-4">
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="mt-3 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-2/3" />
      <Skeleton className="mt-2 h-6 w-1/3" />
      <Skeleton className="mt-4 h-11 w-full" />
    </div>
  );
}
