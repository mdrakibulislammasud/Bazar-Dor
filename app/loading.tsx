import { HeroSkeleton, SectionSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-10" role="status" aria-label="Loading…">
      <HeroSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton count={9} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
