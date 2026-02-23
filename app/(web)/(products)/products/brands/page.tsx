import { Suspense } from "react";
import Link from "next/link";
import { GridSkeleton } from "./skeleton";
import { fetchBrands, type PublicBrand } from "../utils";

type BrandsPageProps = {
  searchParams?: {
    page?: string;
  };
};

function brandInitial(name?: string) {
  const trimmed = (name ?? "").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function BrandCard({ brand }: { brand: PublicBrand }) {
  const href = `/products/brands/${encodeURIComponent(
    brand.slug ?? brand._id
  )}`;
  const cover = brand.coverUrl ?? "";
  const logo = brand.logoUrl ?? "";

  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden transition-colors hover:border-white/20"
    >
      <div className="relative overflow-hidden border-b border-white/10 bg-white/[0.02]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/v1/controllers/getImage/uploads/brands?name=${encodeURIComponent(
              cover.replace("/uploads/brands/", "")
            )}`}
            alt={`${brand.name} cover`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 to-white/5 text-2xl font-semibold text-white/70">
            {brandInitial(brand.name)}
          </div>
        )}
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/v1/controllers/getImage/uploads/brands?name=${encodeURIComponent(
              logo.replace("/uploads/brands/", "")
            )}`}
            alt={`${brand.name} logo`}
            className="absolute bottom-3 left-3 h-12 w-12 rounded-full border border-white/40 bg-black/60 p-2 object-contain"
          />
        ) : null}
      </div>
      <div className="px-3 py-4">
        <div className="text-sm font-semibold text-white">{brand.name}</div>
        {brand.description ? (
          <p className="mt-1 text-xs text-slate-400 line-clamp-3">
            {brand.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

type BrandsGridProps = {
  page: number;
};

type PaginationProps = {
  page: number;
  pages: number;
};

function buildQuery(page: number) {
  const params = new URLSearchParams({
    page: `${page}`,
    limit: "8",
    fields: "_id,name,slug,description,logoUrl,coverUrl",
    sort: "name",
  });

  return params.toString();
}

async function BrandsGrid({ page }: BrandsGridProps) {
  const data = await fetchBrands(buildQuery(page));

  if (!data.items.length) {
    if (data.total > 0 && data.pages > 0 && page > data.pages) {
      return (
        <p className="text-sm text-slate-400">
          That page is empty.{" "}
          <Link
            href={`?page=${data.pages}`}
            className="text-slate-200 underline decoration-white/30 underline-offset-2 transition hover:text-white hover:decoration-white/60"
          >
            Go back to page {data.pages}
          </Link>
          .
        </p>
      );
    }

    return (
      <p className="text-sm text-slate-400">
        No brands available yet. Please check back soon.
      </p>
    );
  }

  return (
    <>
      <BrandsPagination page={data.page} pages={data.pages} />
      <div className="grid gap-4 sm:grid-cols-2">
        {data.items.map((brand) => (
          <BrandCard key={brand._id} brand={brand} />
        ))}
      </div>
      {/* <BrandsPagination page={data.page} pages={data.pages} /> */}
    </>
  );
}

function BrandsPagination({ page, pages }: PaginationProps) {
  if (pages <= 1) {
    return null;
  }

  const maxVisible = Math.min(5, pages);
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  if (start + maxVisible - 1 > pages) {
    start = Math.max(1, pages - maxVisible + 1);
  }

  const visiblePages = Array.from({ length: maxVisible }, (_, i) => start + i);
  const baseClass =
    "rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:text-white";
  const activeClass = "border-white/40 bg-white/10 text-white shadow";

  return (
    <nav
      className="my-8 flex flex-wrap items-center gap-2"
      aria-label="Brands pagination"
    >
      {visiblePages.map((p) => (
        <Link
          key={p}
          href={`?page=${p}`}
          className={`${baseClass} ${p === page ? activeClass : ""}`.trim()}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}
      {page < pages ? (
        <Link
          href={`?page=${page + 1}`}
          className={baseClass}
          aria-label={`Go to page ${page + 1}`}
        >
          See more
        </Link>
      ) : null}
    </nav>
  );
}

export default function BrandsPage({ searchParams }: BrandsPageProps) {
  const requestedPage = Number.parseInt(searchParams?.page ?? "1", 10);
  const page =
    Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage;

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Our Customer Brands
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Discover the customers and partners building with us.
        </p>
      </header>
      <Suspense key={page} fallback={<GridSkeleton count={6} />}>
        <BrandsGrid page={page} />
      </Suspense>
    </section>
  );
}
