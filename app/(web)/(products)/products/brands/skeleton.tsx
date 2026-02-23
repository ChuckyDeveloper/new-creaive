export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
        >
          <div className="aspect-[16/10] border-b border-white/10 bg-white/[0.06]" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-1/2 rounded bg-white/[0.08]" />
            <div className="h-3 w-3/4 rounded bg-white/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  );
}
