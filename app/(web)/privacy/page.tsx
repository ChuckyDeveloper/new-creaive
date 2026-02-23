import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — CREAIVE",
    description: "Read the privacy policy for CREAIVE.",
    alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
    return (
        <main className="min-h-[60vh] px-6 py-12 text-slate-100">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
                <p className="mt-3 text-sm text-slate-400">
                    This page describes how we collect, use, and protect your information.
                </p>

                <section className="prose prose-invert mt-8 max-w-none">
                    <h2>1. Information We Collect</h2>
                    <p>
                        We may collect personal information such as your name, email, and usage data to
                        provide and improve our services.
                    </p>
                    <h2>2. How We Use Information</h2>
                    <p>
                        We use the information to operate the website, personalize content, and ensure
                        security.
                    </p>
                    <h2>3. Contact</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at
                        support@creaive.ai.
                    </p>
                </section>
            </div>
        </main>
    );
}