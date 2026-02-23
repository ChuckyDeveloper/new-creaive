import { fetchProducts } from "../utils";
export const revalidate = 0;


export default async function Page2() {
    const data = await fetchProducts("category=showcase&limit=8");
    return (
        <section>
            <h2 className="mb-3 text-xl font-semibold">Category: showcase</h2>
            <ul className="space-y-2">
                {data.items.map((it) => (
                    <li key={it._id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="font-medium">{it.title}</div>
                        <div className="text-sm text-slate-400">{it.summary ?? it.subtitle ?? ""}</div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
