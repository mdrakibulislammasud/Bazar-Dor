export function ProductCardSkeleton() {
  return (
    <div className="card border border-base-300 bg-base-100" aria-hidden>
      <div className="card-body gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="skeleton size-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-3 w-1/3" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-6 w-24" />
          </div>
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading…">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="skeleton h-72 w-full rounded-3xl" aria-hidden />;
}

export function SectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="space-y-4" aria-hidden>
      <div className="skeleton h-7 w-48" />
      <ProductGridSkeleton count={count} />
    </section>
  );
}
