import React, { useState } from 'react';
import { 
  Code2, 
  Database, 
  Server, 
  Wrench, 
  Search, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { Skill } from '../types.ts';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Competencies', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'frontend', label: 'Frontend & UI', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'backend', label: 'Backend & APIs', icon: <Server className="w-3.5 h-3.5" /> },
    { id: 'database', label: 'Databases & Indexing', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'tools', label: 'DevOps & Tooling', icon: <Wrench className="w-3.5 h-3.5" /> }
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const visibleSkills = showAll ? filteredSkills : filteredSkills.slice(0, 6);
  const hasMore = filteredSkills.length > 6;

  const getGridClass = () => {
    if (visibleSkills.length === 1) return 'max-w-md mx-auto';
    if (visibleSkills.length === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
  };

  return (
    <section id="skills" className="py-20 border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em] mb-2">
              <span>Technical Stack</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-50">
              Core Skills & Technologies
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Production expertise across modern frontend libraries, backend runtimes, and high-concurrency storage engines.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter skills..."
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setShowAll(false);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-black border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setShowAll(false);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-black font-bold shadow-xs'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {visibleSkills.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 font-mono text-sm border border-dashed border-zinc-800 rounded-2xl">
            No matching skills found.
          </div>
        ) : (
          <div className={getGridClass()}>
            {visibleSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500 transition-colors shadow-xs group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden mb-2 border border-zinc-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>

                {skill.description && (
                  <p className="text-xs text-zinc-500 line-clamp-1 font-mono">
                    {skill.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* See More / See Less Button */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-emerald-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm group"
            >
              <span>{showAll ? 'Show Less Skills' : `See More Skills (+${filteredSkills.length - 6})`}</span>
              <ChevronDown
                className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${
                  showAll ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
