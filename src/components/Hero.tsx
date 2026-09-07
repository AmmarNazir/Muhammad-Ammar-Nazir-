import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, FileText, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { PortfolioProfile } from '../types.ts';

interface HeroProps {
  profile: PortfolioProfile | null;
  whatsappNumber: string;
}

export const Hero: React.FC<HeroProps> = ({ profile, whatsappNumber }) => {
  const name = profile?.name || 'Ammar Nazir';
  const title = profile?.title || 'Full Stack MERN & Software Engineer';
  const bio = profile?.bio || 'Building high-performance web applications with optimized database schemas, quick indexing protocols, and robust security architectures using the MERN stack and Redux Toolkit.';
  const resumeUrl = profile?.resumeDriveUrl || 'https://drive.google.com';
  const githubUrl = profile?.githubUrl || 'https://github.com/AmmarNazir';
  const linkedinUrl = profile?.linkedinUrl || 'https://linkedin.com';
  const email = profile?.email || 'ammarnazir.864@gmail.com';

  // Hero positions for write-in / write-out transitions
  const positions = (profile?.heroPositions && profile.heroPositions.length > 0)
    ? profile.heroPositions
    : ['MERN STACK EXPERT', 'FULL STACK ARCHITECT', 'REACT & NODE SPECIALIST', 'DATABASE OPTIMIZER'];

  const transitionStyle = profile?.heroTransitionStyle || 'typewriter';

  // Typewriter write-in / write-out state
  const [positionIndex, setPositionIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (transitionStyle === 'typewriter') {
      const currentFullText = positions[positionIndex % positions.length];
      const typingSpeed = isDeleting ? 40 : 80;

      const timer = setTimeout(() => {
        if (!isDeleting) {
          if (displayText.length < currentFullText.length) {
            setDisplayText(currentFullText.slice(0, displayText.length + 1));
          } else {
            // Pause when fully typed out
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(currentFullText.slice(0, displayText.length - 1));
          } else {
            setIsDeleting(false);
            setPositionIndex((prev) => (prev + 1) % positions.length);
          }
        }
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      // For fade, slide, or flip transitions
      const interval = setInterval(() => {
        setFadeState('out');
        setTimeout(() => {
          setPositionIndex((prev) => (prev + 1) % positions.length);
          setFadeState('in');
        }, 300);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [displayText, isDeleting, positionIndex, positions, transitionStyle]);

  const coreSkills = [
    'MongoDB',
    'Express',
    'React',
    'Node.js',
    'Redux Toolkit',
    'TypeScript',
    'Tailwind',
    'JWT Auth'
  ];

  const getTransitionClasses = () => {
    if (transitionStyle === 'fade') {
      return `transition-opacity duration-300 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`;
    }
    if (transitionStyle === 'slide') {
      return `transition-all duration-300 transform ${
        fadeState === 'in' ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`;
    }
    if (transitionStyle === 'flip') {
      return `transition-all duration-300 transform ${
        fadeState === 'in' ? 'rotate-x-0 opacity-100' : 'rotate-x-90 opacity-0'
      }`;
    }
    return '';
  };

  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Subtle radial emerald aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="space-y-6 mb-10">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>MERN STACK ARCHITECTURE & QUICK INDEXING</span>
          </div>

          {/* High-impact Headline with Write-In / Write-Out Position */}
          <div className="min-h-[110px] sm:min-h-[140px] md:min-h-[160px] flex items-center">
            <h1
              id="hero-name-heading"
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none text-zinc-50"
            >
              <span className={`text-emerald-400 drop-shadow-[0_0_24px_rgba(16,185,129,0.2)] ${getTransitionClasses()}`}>
                {transitionStyle === 'typewriter'
                  ? displayText || '\u00A0'
                  : positions[positionIndex % positions.length]}
              </span>
              {transitionStyle === 'typewriter' && (
                <span className="inline-block w-2 sm:w-2.5 h-[0.75em] ml-1 bg-emerald-400 align-baseline animate-pulse" />
              )}
            </h1>
          </div>

          <div className="space-y-2">
            <p className="text-base sm:text-lg font-bold text-zinc-200">
              {name} — <span className="font-mono text-emerald-400 font-semibold">{title}</span>
            </p>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              {bio}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#contact"
              id="hero-contact-whatsapp-btn"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/15 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Connect on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#projects"
              id="hero-view-projects-btn"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>Explore Projects</span>
            </a>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-resume-btn"
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-medium transition-colors cursor-pointer"
              title="Open Resume"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Resume</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* Highlight Feature Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <a
            href="#projects"
            className="p-5 bg-zinc-900/50 hover:bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-emerald-500 transition-colors group block"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">
                Featured Architecture
              </span>
              <span className="text-emerald-500 group-hover:translate-x-1 transition-transform font-mono">
                →
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-100 mb-1 group-hover:text-emerald-400 transition-colors">
              High-Velocity MERN Applications
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Full-featured dashboards with JWT authentication, Redux Toolkit state, and sub-millisecond query execution.
            </p>
          </a>

          <a
            href="#blog"
            className="p-5 bg-zinc-900/50 hover:bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-emerald-500 transition-colors group block"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">
                Engineering Notes
              </span>
              <span className="text-emerald-500 group-hover:translate-x-1 transition-transform font-mono">
                →
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-100 mb-1 group-hover:text-emerald-400 transition-colors">
              Database Indexing & Schema Design
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Applying ESR (Equality, Sort, Range) indexing protocols to eliminate COLLSCAN bottlenecks in production.
            </p>
          </a>
        </div>

        {/* Core Skills Chips Bar */}
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em]">
            Core Competencies
          </h4>
          <div className="flex flex-wrap gap-2">
            {coreSkills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-mono text-zinc-300 transition-colors"
              >
                {skill === 'React' || skill === 'MongoDB' ? (
                  <span className="text-emerald-400 font-semibold">{skill}</span>
                ) : (
                  skill
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Social Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>IIUI Graduate • BSIT</span>
          </div>
        </div>
      </div>
    </section>
  );
};
