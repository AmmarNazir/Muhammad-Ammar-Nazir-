import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setAdminOpen } from '../store/adminSlice.ts';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.portfolio.profile);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoText = profile?.logoText || 'AN';
  const navLinks = profile?.navItems && profile.navItems.length > 0
    ? profile.navItems
    : [
        { label: 'About', href: '#about' },
        { label: 'Experience', href: '#experience' },
        { label: 'Projects', href: '#projects' },
        { label: 'Skills', href: '#skills' },
        { label: 'Blog', href: '#blog' },
        { label: 'Contact', href: '#contact' },
      ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-800 py-3 shadow-md'
          : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-zinc-800/60 py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand & Stylish AN Logo */}
        <a
          href="#"
          id="navbar-logo"
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <span className="text-2xl font-black tracking-tighter text-emerald-400 font-mono select-none drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            {logoText}
          </span>
          <div className="flex flex-col border-l border-zinc-800/80 pl-2.5">
            <span className="text-xs font-bold tracking-wider text-zinc-100 uppercase">
              {profile?.name || 'AMMAR NAZIR'}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
              Full Stack Dev
            </span>
          </div>
        </a>

        {/* Live Availability Status - Desktop */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono text-zinc-400">Available for new projects</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`nav-link-${link.label.toLowerCase()}`}
              className="px-3.5 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-zinc-900/80 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions: Admin access, Mobile menu */}
        <div className="flex items-center gap-3">
          {/* Admin Panel Access Button */}
          <button
            id="admin-panel-button"
            type="button"
            onClick={() => dispatch(setAdminOpen(true))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isAuthenticated
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-100 hover:border-zinc-700'
            }`}
            title={isAuthenticated ? 'Admin Dashboard (Active)' : 'Admin Login'}
          >
            {isAuthenticated ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Admin</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors cursor-pointer shrink-0 shadow-xs"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden bg-[#0f0f0f] border-b border-zinc-800 px-6 py-4 space-y-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 shadow-2xl"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800/80">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-zinc-400">Available for new projects</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-500">Admin Control</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                dispatch(setAdminOpen(true));
              }}
              className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 py-1 px-2 rounded bg-zinc-900 border border-zinc-800"
            >
              <Lock className="w-3 h-3" />
              <span>Manage Site</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
