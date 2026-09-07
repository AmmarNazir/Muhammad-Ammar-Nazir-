import React from 'react';
import { GraduationCap, ShieldCheck, Zap, Database, ExternalLink, FileText } from 'lucide-react';
import { PortfolioProfile } from '../types.ts';

interface AboutProps {
  profile: PortfolioProfile | null;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const paragraphs = profile?.aboutText || [
    'I am a Full Stack Software Engineer focused on engineering high-efficiency web applications and performant backend services with the MERN stack.',
    'Graduated in Information Technology from the International Islamic University Islamabad (IIUI), my work combines rigorous computational principles with practical frontend finesse.',
    'I prioritize sub-millisecond database indexing, stateless authentication security, and modular Redux architectures.'
  ];

  const education = profile?.education || [
    {
      degree: 'BS Information Technology (BSIT)',
      institution: 'International Islamic University Islamabad (IIUI)',
      period: '2020 - 2024',
      details: 'Focused on Database Systems, Software Architecture, Web Engineering, and Network Security.'
    }
  ];

  const resumeUrl = profile?.resumeDriveUrl || 'https://drive.google.com';

  const corePillars = [
    {
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      title: 'High-Performance APIs',
      desc: 'Optimized Express middleware chains and streamlined JSON payloads for lightning-quick client roundtrips.'
    },
    {
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      title: 'Database Indexing',
      desc: 'Compound indices and ESR query execution strategies reducing complex lookups from seconds to milliseconds.'
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: 'JWT Session Security',
      desc: 'Stateless bearer tokens, strict cryptographic hashing, and fine-grained role-based permission tiers.'
    }
  ];

  return (
    <section id="about" className="py-20 border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em] mb-2">
            <span>Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-50">
            About & Engineering Philosophy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Narrative Text */}
          <div className="md:col-span-7 space-y-4 text-zinc-300 leading-relaxed text-sm sm:text-base">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Education Card */}
          <div className="md:col-span-5 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Academic Foundation</span>
            </div>

            {education.map((edu, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-xs font-mono text-emerald-400 font-semibold">
                  {edu.period}
                </div>
                <div className="font-bold text-zinc-100 text-sm">
                  {edu.degree}
                </div>
                <div className="text-xs text-zinc-400">
                  {edu.institution}
                </div>
                {edu.details && (
                  <p className="text-xs text-zinc-500 pt-1 leading-relaxed">
                    {edu.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core Engineering Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {corePillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 font-bold text-zinc-100 text-sm mb-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10">
                  {pillar.icon}
                </div>
                <span>{pillar.title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
