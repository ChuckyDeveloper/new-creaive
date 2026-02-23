import { notFound } from "next/navigation";
import { fetchBrand, fetchProducts, type PublicProduct } from "../../utils";
import Link from "next/link";

function brandInitial(name?: string) {
  const trimmed = (name ?? "").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function productImageUrl(product: PublicProduct) {
  const image = product.images?.[0]?.url;
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  const name = image.includes("/productcontent/")
    ? image.replace("/productcontent/", "")
    : image.replace(/^\/+/, "");
  return `/api/v1/controllers/getImage/productcontent?name=${encodeURIComponent(
    name
  )}`;
}

export default async function BrandShowcasePage({
  params,
}: {
  params: { id: string };
}) {
  const idOrSlug = decodeURIComponent(params.id ?? "");
  let brandData;
  try {
    brandData = await fetchBrand(
      idOrSlug,
      "_id,name,slug,description,logoUrl,coverUrl,createdAt,updatedAt"
    );
  } catch {
    notFound();
  }

  const brand = brandData?.item;
  if (!brand) {
    notFound();
  }

  const productsData = await fetchProducts(
    `all=1&fields=_id,title,slug,subtitle,summary,images&sort=-publishedAt,-createdAt&brand=${encodeURIComponent(
      brand._id
    )}`
  );
  const products = productsData.items ?? [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-white">
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="relative  bg-gradient-to-br from-white/10 to-white/5">
          {brand.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              // src={brand.coverUrl}
              src={`/api/v1/controllers/getImage/uploads/brands?name=${encodeURIComponent(
                brand.coverUrl.replace("/uploads/brands/", "")
              )}`}
              alt={`${brand.name} cover`}
              className="h-full w-full "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl font-semibold text-white/20">
              {brandInitial(brand.name)}
            </div>
          )}
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              // src={brand.logoUrl}
              src={`/api/v1/controllers/getImage/uploads/brands?name=${encodeURIComponent(
                brand.logoUrl.replace("/uploads/brands/", "")
              )}`}
              alt={`${brand.name} logo`}
              className="absolute bottom-6 left-6 h-10 lg:h-20 w-10 lg:w-20 rounded lg:rounded-2xl border border-white/50 bg-black/60 p-0 lg:p-3 object-contain"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-4 p-3 lg:px-6 pb-3 lg:pb-8 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold">{brand.name}</h1>
            {brand.description ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {brand.description}
              </p>
            ) : null}
          </div>
          {/* <div className="text-sm text-slate-400">
            Updated{" "}
            {new Date(
              brand.updatedAt ?? brand.createdAt ?? Date.now()
            ).toLocaleDateString()}
          </div> */}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products</h2>
          <span className="text-sm text-slate-400">
            {products.length} item{products.length === 1 ? "" : "s"}
          </span>
        </div>

        {products.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: PublicProduct) => {
              const imageUrl = productImageUrl(product);
              return (
                <Link
                  href={`/products/showcase/${product._id}`}
                  key={product._id}
                  className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden border-b border-white/10">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/[0.06] text-base text-white/60">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-4">
                    <div className="text-sm font-semibold text-white">
                      {product.title}
                    </div>
                    {product.subtitle ? (
                      <div className="mt-1 text-xs text-slate-400">
                        {product.subtitle}
                      </div>
                    ) : null}
                    {product.summary ? (
                      <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                        {product.summary}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No products published for this brand yet.
          </p>
        )}
      </section>
    </main>
  );
}
