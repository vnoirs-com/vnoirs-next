"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "WhatsApp Cloud API",
    message: "",
    botCheck: "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check honeypot
    if (formData.botCheck) {
      // Bot triggered
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver message. Please try again.");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "WhatsApp Cloud API",
        message: "",
        botCheck: "",
      });
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please contact cs@vnoirs.com directly.");
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          Send a Direct Message
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Inquiries are received by our engineering team at{" "}
          <span className="text-violet-400">cs@vnoirs.com</span>. We typically respond within 2-4 hours.
        </p>
      </div>

      {status === "success" && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Message delivered successfully!</p>
            <p className="text-emerald-400/90 mt-0.5">
              Thank you for reaching out. We have logged your inquiry and will reach out shortly. You can also message us directly on WhatsApp at +92 320 2453000.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Could not send message</p>
            <p className="text-rose-400/90 mt-0.5">
              {errorMessage || "Please try again or reach out directly to cs@vnoirs.com."}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field (hidden from genuine users) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="botCheck">Leave this empty</label>
          <input
            id="botCheck"
            name="botCheck"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.botCheck}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Your Name <span className="text-violet-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Email Address <span className="text-violet-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Phone / WhatsApp Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92 320 2453000"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div>
            <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Inquiry Focus
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#111827] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm cursor-pointer"
            >
              <option value="WhatsApp Cloud API">WhatsApp Cloud API Integration</option>
              <option value="Custom Web App">Custom Web Application (Next.js / React)</option>
              <option value="Enterprise Architecture">Enterprise System Architecture</option>
              <option value="UI/UX Engineering">UI/UX Design & Frontend</option>
              <option value="DevOps & Cloud">Cloud Deployment & DevOps</option>
              <option value="General Consultation">General Consultation</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Project Details & Requirements <span className="text-violet-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your project, timeline, expected volume, or specific technical integration needs..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer text-sm"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting message...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center pt-1">
          We protect your privacy. Your information is strictly used to evaluate your inquiry.
        </p>
      </form>
    </div>
  );
}
