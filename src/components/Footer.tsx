import React from 'react';
import { ArrowUp, Lock, ShieldCheck, MessageCircle, Github, Linkedin, Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setAdminOpen } from '../store/adminSlice.ts';

export const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.portfolio.profile);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-[#0f0f0f] py-10 text-zinc-400 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800/80">
          {/* Brand & Title */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="font-mono font-black text-lg text-emerald-400 tracking-wider">
                {profile?.logoText || 'AN'}
              </span>
              <span className="font-bold text-sm text-zinc-100 tracking-tight">
                {profile?.name ? profile.name.toUpperCase() : 'AMMAR NAZIR'}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {profile?.title || 'Full Stack MERN & Software Engineer'}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            <a
              href={`https://wa.me/${profile?.whatsappNumber || '923001234567'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${profile?.email || 'muhammad.bsit594@iiu.edu.pk'}`}
              className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation and Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © {currentYear} {profile?.name || 'Ammar Nazir'}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => dispatch(setAdminOpen(true))}
              className="hover:text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              {isAuthenticated ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>Manage Site</span>
            </button>

            <span>•</span>

            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer text-xs"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
