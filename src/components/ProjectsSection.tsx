import React, { useState } from 'react';
import { ExternalLink, Github, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Project } from '../types.ts';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setSelectedCategory } from '../store/portfolioSlice.ts';
import { getGoogleDriveDirectLink } from '../utils/drive.ts';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.portfolio.selectedCategory);
  const profile = useAppSelector((state) => state.portfolio.profile);
  const [showAll, setShowAll] = useState(false);

  // Ensure 'All Projects' is the first category and category IDs are strictly unique
  const rawCategories = profile?.projectCategories && profile.projectCategories.length > 0
    ? profile.projectCategories
    : [
        { id: 'all', label: 'All Projects' },
        { id: 'fullstack', label: 'MERN & Full Stack' },
        { id: 'backend', label: 'Backend & APIs' },
        { id: 'frontend', label: 'Frontend & UI' }
      ];

  const categories = React.useMemo(() => {
    const withoutAll = rawCategories.filter((cat) => cat.id !== 'all');
    return [{ id: 'all', label: 'All Projects' }, ...withoutAll];
  }, [rawCategories]);

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3);

  return (
    <section id="projects" className="py-20 border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em] mb-2">
              <span>Selected Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-50">
              Featured Projects & Systems
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Production-ready applications featuring clean architecture and high-performance engineering.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  dispatch(setSelectedCategory(cat.id));
                  setShowAll(false);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-black font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid or Single Centered */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 font-mono text-sm border border-dashed border-zinc-800 rounded-2xl">
            No projects in this category yet.
          </div>
        ) : (
          <div
            className={
              displayedProjects.length === 1
                ? 'max-w-xl mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            }
          >
            {displayedProjects.map((project) => {
              const displayImage = getGoogleDriveDirectLink(project.coverImage);
              return (
                <div
                  key={project.id}
                  className="group flex flex-col justify-between rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500 transition-all duration-200 overflow-hidden shadow-xs hover:shadow-lg hover:shadow-emerald-500/5"
                >
                  <div className="flex flex-col flex-1">
                    {/* Thumbnail Banner */}
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                      <img
                        src={displayImage}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />

                      {project.featured && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono bg-zinc-900/90 text-emerald-400 backdrop-blur-md border border-emerald-500/30 font-bold uppercase tracking-wider">
                          <Star className="w-3 h-3 fill-emerald-400" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-6 pb-4 space-y-3 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                          {project.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-zinc-100 tracking-tight group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed flex-1">
                        {project.description}
                      </p>

                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={`${project.id}-${tag}-${idx}`}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-950 text-zinc-300 border border-zinc-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Links: Generous padding, no overlap with separation border */}
                  <div className="px-6 py-3.5 border-t border-zinc-800/80 mt-auto bg-zinc-950/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 transition-colors"
                          title="GitHub Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Show More / Show Less Toggle Button (3 at a time) */}
        {filteredProjects.length > 3 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-md"
            >
              <span>{showAll ? 'Show Less Projects' : `Show More Projects (${filteredProjects.length - 3} more)`}</span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
