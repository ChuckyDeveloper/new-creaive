/* ------------------ small UI parts ------------------ */

import { useEffect, useRef, useState } from "react";

export function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="panel p-4" >
            <div className="mb-3 flex items-center gap-2" >
                <div className="h-5 w-1 rounded bg-white/70" />
                <h2 className="panel-title text-lg" > {title} </h2>
            </div>
            {children}
        </section>
    );
}

export function Field({
    label,
    children,
    colSpan,
}: {
    label: string;
    children: React.ReactNode;
    colSpan?: boolean;
}) {
    return (
        <label className={["flex flex-col gap-1", colSpan ? "sm:col-span-2" : ""].join(" ")} >
            <span className="text-sm text-slate-300" > {label} </span>
            {children}
        </label>
    );
}

export function Hint({ children }: { children: React.ReactNode }) {
    return <div className="mt-1 text-xs text-slate-500" > {children} </div>;
}

export function Pill({
    label,
    value,
    tone = "indigo",
}: {
    label: string;
    value: string | number;
    tone?: "indigo" | "emerald" | "sky";
}) {
    const t: Record<string, string> = {
        indigo: "bg-indigo-500/15 text-indigo-200 border-indigo-400/20",
        emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
        sky: "bg-sky-500/15 text-sky-200 border-sky-400/20",
    };
    return (
        <div className={["rounded-full border px-3 py-1.5 text-xs", t[tone] ?? t.indigo].join(" ")}>
            <span className="font-medium">{label}</span> <span className="ml-1 opacity-90">{value}</span>
        </div>
    );
}

export function Segmented({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <div className="mb-1 text-sm text-slate-300" > {label} </div>
            < div className="flex rounded-xl border border-white/10 bg-black/30 p-1" >
                {
                    options.map((opt) => {
                        const active = value === opt;
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onChange(opt)
                                }
                                className={
                                    [
                                        "flex-1 rounded-lg px-3 py-1.5 text-sm transition",
                                        active
                                            ? "bg-fuchsia-500/30 text-fuchsia-100 border border-fuchsia-400/40"
                                            : "text-slate-300 hover:bg-white/10",
                                    ].join(" ")
                                }
                            >
                                {opt}
                            </button>
                        );
                    })
                }
            </div>
        </div>
    );
}

export function TokenInput({
    label,
    tokens,
    onAdd,
    onRemove,
    placeholder,
    colSpan,
}: {
    label: string;
    tokens: string[];
    onAdd: (s: string) => void;
    onRemove: (i: number) => void;
    placeholder?: string;
    colSpan?: boolean;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className={colSpan ? "sm:col-span-2" : ""} >
            <div className="mb-1 text-sm text-slate-300" > {label} </div>
            < div className="rounded-md border border-white/10 bg-black/40 px-2 py-1" >
                <div className="flex flex-wrap items-center gap-2" >
                    {
                        tokens.map((t, i) => (
                            <span
                                key={`${t}-${i}`}
                                className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-3 py-1 text-sm text-fuchsia-100"
                            >
                                {t}
                                < button
                                    type="button"
                                    onClick={() => onRemove(i)
                                    }
                                    className="rounded-full border border-white/20 px-1 text-xs text-white/90 hover:bg-white/10"
                                    title="Remove"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    <input
                        ref={inputRef}
                        onKeyDown={(e) => onTokensKey(e, (xs) => onAdd(xs.join(",")), tokens)}
                        onBlur={(e) => {
                            const v = e.currentTarget.value.trim();
                            if (v) onAdd(v);
                            e.currentTarget.value = "";
                        }}
                        placeholder={placeholder || "add… (Enter or ,)"}
                        className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                    />
                </div>
            </div>
        </div>
    );
}

export function onTokensKey(
    e: React.KeyboardEvent<HTMLInputElement>,
    add: (xs: string[]) => void,
    current: string[]
) {
    if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const v = (e.target as HTMLInputElement).value.trim();
        if (v) add([v]);
        (e.target as HTMLInputElement).value = "";
    }
}

export const TAGS = [
    "ai-microsites",
    "ai-humans",
    "ai-chatbots",
    "ai-lab",
    "holovue",
    "platforms",
] as const;

export type Tag = typeof TAGS[number];

export default function TagsDropdown({
    selected,
    onChange,
    label = "Tags",
    className = "",
}: {
    selected: Tag[];
    onChange: (next: Tag[]) => void;
    label?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggle = (tag: Tag) => {
        const has = selected.includes(tag);
        const next = has ? selected.filter((t) => t !== tag) : [...selected, tag];
        onChange(next);
    };

    return (
        <div className={`relative ${className}`} ref={boxRef}>
            <div className="mb-1 text-sm text-slate-300">{label}</div>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-left text-sm text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <div className="flex flex-wrap gap-2">
                    {selected.length ? (
                        selected.map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-2 py-0.5 text-xs text-fuchsia-100"
                            >
                                {labelize(t)}
                            </span>
                        ))
                    ) : (
                        <span className="">
                            Select tags
                        </span>
                    )}
                </div>
            </button>

            {open && (
                <div
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-white/10 bg-black/70 p-2 shadow-xl backdrop-blur"
                >
                    {TAGS.map((tag) => {
                        const checked = selected.includes(tag);
                        return (
                            <label
                                key={tag}
                                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm text-slate-200 hover:bg-white/10"
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-white/20 bg-black/40 text-fuchsia-500 focus:ring-fuchsia-500"
                                    checked={checked}
                                    onChange={() => toggle(tag)}
                                />
                                <span>{labelize(tag)}</span>
                            </label>
                        );
                    })}
                    <div className="mt-2 flex justify-between px-1">
                        <button
                            type="button"
                            className="text-xs text-slate-400 underline hover:text-slate-200"
                            onClick={() => onChange([])}
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            className="text-xs text-slate-400 underline hover:text-slate-200"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function labelize(v: string) {
    return v.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}