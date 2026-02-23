import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — CREAIVE",
    description: "Read the terms of service for CREAIVE.",
    alternates: { canonical: "/terms" },
};

export default function TermsPage() {
    return (
        <main className="min-h-[60vh] px-6 py-12 text-slate-100">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
                <p className="mt-3 text-sm text-slate-400">
                    These Terms govern your use of CREAIVE services and website.
                </p>

                <section className="prose prose-invert mt-8 max-w-none">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using our services, you agree to be bound by these Terms.
                    </p>
                    <h2>2. Use of Service</h2>
                    <p>
                        You agree to use the service in compliance with applicable laws and not to misuse
                        the platform.
                    </p>
                    <h2>3. Contact</h2>
                    <p>
                        For questions about these Terms, contact us at support@creaive.ai.
                    </p>
                </section>
            </div>
        </main>
    );
}