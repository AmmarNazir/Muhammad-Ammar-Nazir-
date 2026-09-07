import React, { useEffect } from 'react';
import { X, ExternalLink, Github, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setSelectedProject } from '../store/portfolioSlice.ts';
import { getGoogleDriveDirectLink } from '../utils/drive.ts';

export const ProjectModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.portfolio.selectedProject);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(setSelectedProject(null));
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, dispatch]);

  if (!project) return null;

  const displayImage = getGoogleDriveDirectLink(project.coverImage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0f0f0f] border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Banner */}
        <div className="relative aspect-video w-full bg-zinc-950 shrink-0">
          <img
            src={displayImage}
            alt={project.title}
            className="w-full h-full object-cover opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <button
            type="button"
            onClick={() => dispatch(setSelectedProject(null))}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/80 hover:bg-black text-zinc-100 backdrop-blur-md transition-colors cursor-pointer border border-zinc-800"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 font-mono">
              {project.category} Project
            </span>
            <span className="text-xs font-mono text-zinc-500">
              {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
            {project.title}
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed">
            {project.fullDescription || project.description}
          </p>

          {/* Tech stack */}
          <div className="pt-2">
            <h4 className="text-[10px] uppercase font-bold text-zinc-500 mb-2 font-mono">Technologies & Frameworks</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Project Gallery Screenshots */}
          {project.images && project.images.length > 0 && (
            <div className="pt-3 space-y-2">
              <h4 className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Project Screenshots & Gallery</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {project.images.map((imgUrl, i) => (
                  <a
                    key={i}
                    href={getGoogleDriveDirectLink(imgUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black group"
                  >
                    <img
                      src={getGoogleDriveDirectLink(imgUrl)}
                      alt={`${project.title} preview ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Links */}
        <div className="p-4 sm:px-8 bg-black/60 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}

            {project.driveUrl && (
              <a
                href={project.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Drive Specs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors shadow-sm"
            >
              <span>Launch Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
