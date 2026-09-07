import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  AlertCircle,
  Quote,
  Zap,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { PortfolioProfile } from '../types.ts';

const INSPIRATIONAL_QUOTES = [
  {
    quote: "Simplicity is prerequisite for reliability. Complex systems always break in complex ways.",
    author: "Edsger W. Dijkstra",
    title: "Computer Scientist & Turing Laureate"
  },
  {
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    title: "Chief Scientist & Author of Refactoring"
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    title: "Software Architect"
  },
  {
    quote: "Make it work, make it right, make it fast — in that exact order.",
    author: "Kent Beck",
    title: "Creator of Extreme Programming & TDD"
  },
  {
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    title: "Creator of Linux & Git"
  }
];

interface ContactSectionProps {
  profile: PortfolioProfile | null;
  whatsappNumber: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, whatsappNumber }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Full Stack Web Development');
  const [budget, setBudget] = useState('$1,000 - $3,000');
  const [timeline, setTimeline] = useState('2 - 4 Weeks');
  const [message, setMessage] = useState('');

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeWhatsApp = profile?.whatsappNumber || whatsappNumber || '923001234567';
  const targetEmail = profile?.email || 'muhammad.bsit594@iiu.edu.pk';

  const currentQuote = INSPIRATIONAL_QUOTES[quoteIndex];

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
  };

  // Real-time structured WhatsApp message preview
  const previewStructuredMessage = [
    `*New Portfolio Inquiry* 📬`,
    `Hello Ammar! I am reaching out to you from your portfolio website.`,
    ``,
    `*Sender Details:*`,
    `• *Name:* ${name.trim() || '[Your Name]'}`,
    `• *Email:* ${email.trim() || '[Your Email]'}`,
    phone ? `• *Phone/WhatsApp:* ${phone.trim()}` : null,
    ``,
    `*Project Details:*`,
    `• *Subject / Topic:* ${subject}`,
    budget ? `• *Estimated Budget:* ${budget}` : null,
    timeline ? `• *Expected Timeline:* ${timeline}` : null,
    ``,
    `*Message:*`,
    `"${message.trim() || '[Your project scope or inquiry message will appear here]'}"`,
    ``,
    `Looking forward to discussing further!`
  ].filter(Boolean).join('\n');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage('Please fill in your Name, Email, Phone number, and Message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          budget,
          timeline,
          message
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process inquiry');
      }

      setGeneratedWhatsAppUrl(data.whatsappUrl);
      setSubmittedSuccess(true);

      // Open WhatsApp directly for the user
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.warn('API submission failed, falling back to direct WhatsApp launch:', err);
      const sanitizedPhone = activeWhatsApp.replace(/[^0-9]/g, '');
      const encoded = encodeURIComponent(previewStructuredMessage);
      const fallbackUrl = `https://wa.me/${sanitizedPhone}?text=${encoded}`;
      setGeneratedWhatsAppUrl(fallbackUrl);
      setSubmittedSuccess(true);
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setSubmittedSuccess(false);
    setGeneratedWhatsAppUrl(null);
  };

  return (
    <section id="contact" className="py-20 border-t border-zinc-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em] mb-2">
            <span>Direct Inquiry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-50">
            Let's Connect
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Direct WhatsApp integration with live structured formatting and zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Professional Polish Card */}
          <div className="lg:col-span-7 bg-zinc-900/60 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl">
            {submittedSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100">
                  Message Structured & Dispatched!
                </h3>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Your inquiry has been formatted and launched directly in WhatsApp.
                </p>

                {generatedWhatsAppUrl && (
                  <div className="pt-2">
                    <a
                      href={generatedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-colors shadow-lg shadow-emerald-500/15"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Re-open WhatsApp Chat</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-mono text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors text-zinc-100 placeholder-zinc-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors text-zinc-100 placeholder-zinc-600"
                    />
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors text-zinc-100 placeholder-zinc-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">
                      Project Type / Subject <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors text-zinc-100"
                    >
                      <option value="Full Stack Web Development">Full Stack Web Development</option>
                      <option value="MERN Architecture & APIs">MERN Architecture & APIs</option>
                      <option value="Database Indexing & Performance">Database Indexing & Performance</option>
                      <option value="Frontend UI/UX Implementation">Frontend UI/UX Implementation</option>
                      <option value="Technical Consultation">Technical Consultation</option>
                      <option value="Other Project Inquiry">Other Project Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">
                      Estimated Budget <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors text-zinc-100"
                    >
                      <option value="< $1,000">&lt; $1,000</option>
                      <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                      <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                      <option value="$5,000+">$5,000+</option>
                      <option value="Flexible / Hourly">Flexible / Hourly</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">
                      Estimated Timeline <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors text-zinc-100"
                    >
                      <option value="Immediate (< 2 Weeks)">Immediate (&lt; 2 Weeks)</option>
                      <option value="2 - 4 Weeks">2 - 4 Weeks</option>
                      <option value="1 - 2 Months">1 - 2 Months</option>
                      <option value="Flexible Schedule">Flexible Schedule</option>
                    </select>
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400">
                    Project Message / Scope *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your project requirements, goals, or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors text-zinc-100 placeholder-zinc-600 resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="contact-submit-whatsapp-btn"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Formatting Message...' : 'Send to WhatsApp'}</span>
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Engineering Philosophy Quote & Architecture Graphic */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dynamic Engineering Quote Card */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-xl overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 text-zinc-800/40 pointer-events-none">
                <Quote className="w-32 h-32 rotate-12" />
              </div>

              <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Engineering Philosophy
                  </span>
                </div>

                <button
                  type="button"
                  onClick={cycleQuote}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-emerald-400 bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Cycle to next quote"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Next Quote</span>
                </button>
              </div>

              <div className="relative z-10">
                <blockquote className="text-base sm:text-lg font-medium text-zinc-100 leading-relaxed italic">
                  "{currentQuote.quote}"
                </blockquote>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-emerald-500 rounded-full" />
                  <div>
                    <cite className="not-italic text-xs font-bold text-zinc-200 block">
                      {currentQuote.author}
                    </cite>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {currentQuote.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <h4 className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-400">
                Alternative Inquiries
              </h4>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <a href={`mailto:${targetEmail}`} className="hover:underline text-zinc-200 font-medium">
                    {targetEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono">+{activeWhatsApp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
