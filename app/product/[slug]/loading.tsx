export default function ProductLoading() {
  return (
    <div role="status" aria-label="Loading product details" className="space-y-5">
      <div className="skeleton h-4 w-56" />
      <div className="skeleton h-44 w-full rounded-2xl sm:h-52" />
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
        <div className="skeleton mb-4 h-6 w-48" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="skeleton h-24 rounded-xl" />
          <div className="skeleton h-24 rounded-xl" />
          <div className="skeleton h-24 rounded-xl" />
        </div>
        <div className="skeleton mt-6 h-48 w-full rounded-xl" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
