import { ProductGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-24 w-full rounded-2xl" />
      <div className="skeleton h-14 w-full rounded-2xl" />
      <div className="skeleton h-4 w-40" />
      <ProductGridSkeleton count={6} />
    </div>
  );
}
