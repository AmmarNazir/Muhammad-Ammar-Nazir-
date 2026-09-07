import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { BlogPost } from '../types.ts';
import { useAppDispatch } from '../store/index.ts';
import { setSelectedPost } from '../store/blogSlice.ts';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const dispatch = useAppDispatch();
  const [activeTag, setActiveTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);

  // Extract unique tags (excluding 'all' which is handled by the dedicated 'All Topics' button)
  const allTags = Array.from(new Set<string>(posts.flatMap((p) => p.tags || []))).filter(
    (tag) => tag.toLowerCase() !== 'all'
  );

  const filteredPosts = posts.filter((post) => {
    const matchesTag = activeTag === 'all' || post.tags.includes(activeTag);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const displayedPosts = showAll ? filteredPosts : filteredPosts.slice(0, 3);

  return (
    <section id="blog" className="py-20 border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em] mb-2">
              <span>Technical Writing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-50">
              Engineering Blog & Notes
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Articles on full-stack architecture, indexing optimizations, and secure systems engineering.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-black border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tag pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveTag('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTag === 'all'
                  ? 'bg-emerald-500 text-black font-bold shadow-xs'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTag === tag
                    ? 'bg-emerald-500 text-black font-bold shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 font-mono text-sm border border-dashed border-zinc-800 rounded-2xl">
            No articles found matching criteria.
          </div>
        ) : (
          <div
            className={
              displayedPosts.length === 1
                ? 'max-w-xl mx-auto'
                : displayedPosts.length === 2
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto'
                : 'grid grid-cols-1 md:grid-cols-3 gap-6'
            }
          >
            {displayedPosts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <article
                  key={post.id}
                  onClick={() => dispatch(setSelectedPost(post))}
                  className="group flex flex-col justify-between rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500 p-6 transition-all duration-200 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
                >
                  <div>
                    {/* Article Metadata */}
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTimeMinutes} min read</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-100 tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={`${post.id}-${tag}-${idx}`}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-black text-zinc-400 border border-zinc-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-400 text-xs group-hover:translate-x-1 transition-transform">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Show More / Show Less Toggle Button (3 at a time) */}
        {filteredPosts.length > 3 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              id="blogs-toggle-show-more-btn"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-md"
            >
              <span>{showAll ? 'Show Less Articles' : `Show More Articles (${filteredPosts.length - 3} more)`}</span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
