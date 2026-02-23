import { fetchProducts } from "../utils";
export const revalidate = 0;

export default async function Page3() {
    const data = await fetchProducts("all=1&sort=title");
    return (
        <section>
            <h2 className="mb-3 text-xl font-semibold">All products (sorted by title)</h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {data.items.map((it) => (
                    <article key={it._id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={it.images?.[0]?.url ?? ""}
                                alt={it.title}
                                className="h-14 w-20 rounded-md border border-white/10 object-cover"
                            />
                            <div>
                                <div className="font-medium leading-tight">{it.title}</div>
                                <div className="text-xs text-slate-400 px-3 pb-3">{it.tags?.slice(0, 3).map(t => `#${t}`).join(" ")}</div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
