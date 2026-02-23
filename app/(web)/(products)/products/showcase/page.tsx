// app/(web)/(products)/products/page1/page.tsx
import { Suspense } from "react";
import { fetchProducts } from "../utils";
import Link from "next/link";

export const revalidate = 120;

// Async server component that actually fetches + renders the grid
async function ProductsGrid() {
  const data = await fetchProducts("Mode=all");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {data.items.map((it: any) => (
        <Link
          href={`/products/showcase/${it._id}`}
          key={it._id}
          className="rounded-xl border border-white/10 bg-white/[0.04] p-0 overflow-hidden"
        >
          <div className="aspect-[16/10] overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {it.images?.[0]?.url ? (
              <img
                src={`/api/v1/controllers/getImage/productcontent?name=${encodeURIComponent(
                  it.images?.[0]?.url.replace("/productcontent/", "")
                )}`}
                alt={it.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={`/creaive/Creaive Logo Final 06.png`}
                alt={it.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="mt-2 text-sm font-medium px-3">{it.title}</div>
          <div className="text-xs text-slate-400 px-3 pb-3">
            {it.subtitle ?? ""}
          </div>
          <div>
            <div className="text-xs text-slate-400 px-3 pb-3 text-end">
              {it.tags
                ?.slice(0, 3)
                .map((t) => `#${t}`)
                .join(" ")}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Simple skeleton while the server streams the grid
function GridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-white/10 bg-white/[0.03] p-3"
        >
          <div className="aspect-[16/10] rounded-md bg-white/[0.06]" />
          <div className="mt-2 h-3 w-2/3 rounded bg-white/[0.08]" />
          <div className="mt-1 h-3 w-1/3 rounded bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

export default function Page1() {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">Latest products</h2>
      <Suspense fallback={<GridSkeleton />}>
        <ProductsGrid />
      </Suspense>
    </section>
  );
}
