import { GridSkeleton } from "./skeleton";

export default function Loading() {
  return (
    <section>
      <header className="mb-6 space-y-2">
        <div className="h-6 w-48 rounded bg-white/[0.12] animate-pulse" />
        <div className="h-4 w-64 rounded bg-white/[0.08] animate-pulse" />
      </header>
      <GridSkeleton />
    </section>
  );
}