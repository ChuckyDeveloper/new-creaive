"use client";
import React, { useState, useRef } from "react";

import { FaMediumM, FaInstagram, FaLinkedin } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineChatAlt2,
  HiOutlineLocationMarker,
} from "react-icons/hi";

/* ── shared input style ─────────────────────────────────────────────── */
const INPUT_CLS =
  "w-full rounded-xl h-11 px-4 bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 outline-none focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 focus:bg-white/[0.06] transition-all duration-300";

/* ── component ──────────────────────────────────────────────────────── */
const ContactComponant = ({ title }: { title?: string }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [detail, setDetails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !email.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !country.trim() ||
      !company.trim() ||
      !phone.trim() ||
      !subject.trim() ||
      !detail.trim()
    ) {
      setError("All fields are required!");
      return;
    }

    const phoneRegex = /^[0-9+()\s-]{8,}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError("Invalid phone number format!");
      return;
    }

    setSubmitting(true);

    try {
      const webhookResponse = await fetch(
        "https://hook.us2.make.com/b3a8g7xh3xfh4yaav39hqw8b9wnw45ss",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            country: country.trim(),
            phone: phone.trim(),
            email: email.trim(),
            company: company.trim(),
            subject: subject.trim(),
            message: detail.trim(),
          }),
        },
      );

      if (!webhookResponse.ok) {
        throw new Error("Failed to send webhook.");
      }

      setSuccess("Message sent successfully! We'll get back to you soon.");

      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);

      form.current?.reset();
      setFirstName("");
      setLastName("");
      setEmail("");
      setCountry("");
      setCompany("");
      setPhone("");
      setSubject("");
      setDetails("");
    } catch (error) {
      console.log("Error during contact submit: ", error);
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  /* ── social links data ─── */
  const socials = [
    {
      icon: <FaMediumM size={18} />,
      label: "Medium",
      href: "https://medium.com/@creaive",
    },
    {
      icon: <FaLinkedin size={18} />,
      label: "LinkedIn",
      href: "https://linkedin.com/creaive",
    },
    {
      icon: <FaInstagram size={18} />,
      label: "Instagram",
      href: "https://instagram.com/creaive.ai",
    },
  ];

  /* ── info cards data ─── */
  const infoCards = [
    {
      icon: <HiOutlineMail size={22} />,
      label: "Email",
      value: "hello@creaive.ai",
      accent: "from-primary-500/20 to-primary-500/5",
    },
    {
      icon: <HiOutlinePhone size={22} />,
      label: "Phone",
      value: "(+66) 080-169-9741",
      accent: "from-complementary-500/20 to-complementary-500/5",
    },
    {
      icon: <HiOutlineChatAlt2 size={22} />,
      label: "Line Official",
      value: "@creaive.ai",
      accent: "from-green-500/20 to-green-500/5",
    },
    {
      icon: <HiOutlineLocationMarker size={22} />,
      label: "Location",
      value: "Bangkok, Thailand",
      accent: "from-amber-500/20 to-amber-500/5",
    },
  ];

  return (
    <div className="text-white">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* ── LEFT COLUMN ───────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* Info cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {infoCards.map((card, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                {/* subtle gradient accent */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/50 transition-colors duration-300 group-hover:text-white">
                    {card.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-white/35">
                      {card.label}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-white/80">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/40 transition-all duration-300 hover:border-primary-500/30 hover:bg-primary-500/10 hover:text-white hover:shadow-[0_0_20px_rgba(120,42,144,0.15)]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Decorative quote */}
          <div className="hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-primary-500/[0.06] to-complementary-500/[0.04] p-6 lg:block">
            <svg
              className="mb-3 h-8 w-8 text-primary-400/40"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.3 2.6c-4.2 1-7.5 4.5-7.5 9.4 0 3 1.4 5.3 3.7 6.7.5.3 1.1.1 1.3-.4l.4-1c.2-.5 0-1-.4-1.3C7.3 15 6.5 13.6 6.5 12c0-2.6 1.5-4.8 3.7-5.9.5-.2.8-.8.6-1.3l-.4-1c-.2-.5-.7-.8-1.2-.6l.1.4zm8 0c-4.2 1-7.5 4.5-7.5 9.4 0 3 1.4 5.3 3.7 6.7.5.3 1.1.1 1.3-.4l.4-1c.2-.5 0-1-.4-1.3C15.3 15 14.5 13.6 14.5 12c0-2.6 1.5-4.8 3.7-5.9.5-.2.8-.8.6-1.3l-.4-1c-.2-.5-.7-.8-1.2-.6l.1.4z" />
            </svg>
            <p className="text-sm leading-relaxed text-white/40">
              We believe every interaction deserves creativity. Let&apos;s turn
              your vision into reality with the power of AI.
            </p>
            <p className="mt-3 text-xs font-medium text-white/25">
              — The Creaive Team
            </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN — FORM ───────────────────────────────── */}
        <div className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-primary-500/5 backdrop-blur-sm md:p-10">
            {/* corner glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-500/10 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-complementary-500/10 blur-[60px]" />

            <div className="relative">
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Send us a message
              </h3>
              <p className="mt-1.5 text-sm text-white/40">
                Fill in the form below and we&apos;ll get back to you within 24
                hours.
              </p>

              <form
                ref={form}
                onSubmit={(e) => handleSubmit(e)}
                className="mt-8 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2"
              >
                {/* First Name */}
                <label className="group flex flex-col gap-2">
                  <span className="text-xs font-medium text-white/50 transition-colors group-focus-within:text-primary-400">
                    First Name <span className="text-red-400">*</span>
                  </span>
                  <input
                    type="text"
                    placeholder="John"
                    className={INPUT_CLS}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>

                {/* Last Name */}
                <label className="group flex flex-col gap-2">
                  <span className="text-xs font-medium text-white/50 transition-colors group-focus-within:text-primary-400">
                    Last Name <span className="text-red-400">*</span>
                  </span>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={INPUT_CLS}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>

                {/* Email */}
                <label className="group flex flex-col gap-2">
                  <span className="text-xs font-medium text-white/50 transition-colors group-focus-within:text-primary-400">
                    Email Address <span className="text-red-400">*</span>
                  </span>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    className={INPUT_CLS}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                {/* Country */}
                <label className="group flex flex-col gap-2">
                  <span className="text-xs font-medium text-white/50 transition-colors group-focus-within:text-primary-400">
                    Country <span className="text-red-400">*</span>
                  </span>
                  <input
                    type="text"
                    placeholder="Thailand"
                    className={INPUT_CLS}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </label>

                {/* Company */}
                <label className="group flex flex-col gap-2">
                  <span className="text-xs font-medium text-white/50 transition-colors group-focus-within:text-primary-400">
                    Company <span className="text-red-400">*</span>
                  </span>
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    className={INPUT_CLS}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </label>

                {/* Phone */}
                <label className="group flex flex-col gap-2">
                  <span className="text-xs font-medium text-white/50 transition-colors group-focus-within:text-primary-400">
                    Phone Number <span className="text-red-400">*</span>
                  </span>
                  <input
                    type="text"
                    placeholder="+66 80-169-9741"
                    className={INPUT_CLS}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>

                {/* Subject */}
                <label className="group flex flex-col gap-2 md:col-span-2">
                  <span className="text-xs font-medium text-white/50 transition-colors group-focus-within:text-primary-400">
                    Subject <span className="text-red-400">*</span>
                  </span>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className={INPUT_CLS}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </label>

                {/* Message */}
                <label className="group flex flex-col gap-2 md:col-span-2">
                  <span className="text-xs font-medium text-white/50 transition-colors group-focus-within:text-primary-400">
                    Your Message <span className="text-red-400">*</span>
                  </span>
                  <textarea
                    placeholder="Tell us about your project, goals, or anything you'd like to discuss..."
                    className="w-full resize-y rounded-xl px-4 py-3 min-h-[130px] max-h-[220px] bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 outline-none focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 focus:bg-white/[0.06] transition-all duration-300"
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </label>

                {/* Alerts */}
                {error && (
                  <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {success}
                  </div>
                )}

                {/* Submit button */}
                <div className="md:col-span-2 flex items-center justify-between pt-3">
                  <p className="hidden text-xs text-white/25 sm:block">
                    <span className="text-red-400">*</span> All fields are
                    required
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactComponant;
