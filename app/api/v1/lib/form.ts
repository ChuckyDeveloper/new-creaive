// app/api/v1/lib/form.ts
export const asString = (v: FormDataEntryValue | null | undefined) =>
    (v?.toString().trim() || undefined) as string | undefined;

export const asNumber = (v: FormDataEntryValue | null | undefined) => {
    if (v == null) return undefined;
    const n = Number(v.toString());
    return Number.isFinite(n) ? n : undefined;
};

export const asBool = (v: FormDataEntryValue | null | undefined) => {
    if (v == null) return undefined;
    const s = v.toString().toLowerCase();
    return s === "true" || s === "1" || s === "yes";
};

export const asDate = (v: FormDataEntryValue | null | undefined) => {
    if (!v) return undefined;
    const d = new Date(v.toString());
    return isNaN(d.getTime()) ? undefined : d;
};

export const asStringArray = (v: FormDataEntryValue | null | undefined) => {
    if (!v) return [];
    const s = v.toString().trim();
    if (!s) return [];
    try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed.map(String);
    } catch { }
    return s.split(",").map(x => x.trim()).filter(Boolean);
};

/** try JSON.parse then fallback to raw string */
export const asJsonOrString = (v: FormDataEntryValue | null | undefined): any => {
    if (!v) return undefined;
    const s = v.toString();
    try { return JSON.parse(s); } catch { return s; }
};
