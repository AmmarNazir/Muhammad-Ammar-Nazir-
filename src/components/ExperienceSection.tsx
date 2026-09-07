import React from 'react';
import { Briefcase, Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { Experience } from '../types.ts';

interface ExperienceProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-20 border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em] mb-2">
            <span>Career Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-50">
            Professional Experience
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Proven track record designing and maintaining high-velocity production systems.
          </p>
        </div>

        <div className="relative border-l border-zinc-800 ml-3 md:ml-4 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-6 md:pl-8 group">
              {/* Timeline marker */}
              <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-[#0a0a0a] bg-emerald-500 ring-4 ring-[#0a0a0a] group-hover:scale-125 transition-transform" />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {exp.role}
                  </h3>
                  <span className="text-zinc-500 font-mono text-sm">@</span>
                  {exp.companyUrl ? (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>{exp.company}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-zinc-200 font-semibold">{exp.company}</span>
                  )}

                  {exp.current && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.period}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              {/* Bullet Points */}
              <ul className="mt-3 space-y-2 text-sm text-zinc-400 leading-relaxed">
                {exp.description.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Badges */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
