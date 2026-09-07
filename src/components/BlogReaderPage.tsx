import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Share2, Check, BookOpen, Tag, ArrowRight } from 'lucide-react';
import { BlogPost, PortfolioProfile } from '../types.ts';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setSelectedPost } from '../store/blogSlice.ts';

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-2 my-4 text-zinc-300">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${idx}`} className="my-6 rounded-2xl bg-black text-emerald-400 p-5 font-mono text-xs sm:text-sm overflow-x-auto border border-zinc-800 shadow-xl">
            <pre><code>{codeBlockLines.join('\n')}</code></pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushList(`list-${idx}`);
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // List items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2));
      return;
    } else {
      flushList(`list-${idx}`);
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="text-lg sm:text-xl font-bold text-zinc-100 mt-8 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="text-xl sm:text-2xl font-black text-zinc-100 mt-10 mb-4 pb-2 border-b border-zinc-800">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={idx} className="text-2xl sm:text-3xl font-black text-zinc-100 mt-12 mb-6">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.trim().startsWith('![') && line.includes('](') && line.trim().endsWith(')')) {
      const match = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
      if (match) {
        elements.push(
          <div key={idx} className="my-6 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-xl">
            <img
              src={match[2]}
              alt={match[1] || 'Blog image'}
              className="w-full h-auto max-h-[500px] object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {match[1] && (
              <div className="p-2.5 text-center text-xs text-zinc-400 font-mono bg-zinc-900/80 border-t border-zinc-800">
                {match[1]}
              </div>
            )}
          </div>
        );
      }
    } else if (line.trim() === '') {
      elements.push(<div key={idx} className="h-3" />);
    } else {
      elements.push(
        <p key={idx} className="my-3 text-zinc-300 leading-relaxed text-base sm:text-lg">
          {line}
        </p>
      );
    }
  });

  flushList('final-list');

  return elements;
}

interface BlogReaderPageProps {
  post: BlogPost;
  allPosts: BlogPost[];
  profile: PortfolioProfile | null;
}

export const BlogReaderPage: React.FC<BlogReaderPageProps> = ({ post, allPosts, profile }) => {
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Scroll to top when post loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  const handleBack = () => {
    dispatch(setSelectedPost(null));
    setTimeout(() => {
      const el = document.getElementById('blog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Find next and previous posts
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            title="Share article"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Article Metadata & Breadcrumbs */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{post.readTimeMinutes} min read</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">
              <BookOpen className="w-3 h-3" />
              <span>Technical Article</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-50 tracking-tight leading-tight sm:leading-tight">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-3 py-4 border-y border-zinc-800/80">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black font-mono text-sm shadow-md">
              AN
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-100">
                {profile?.name || 'Muhammad Ammar Nazir'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {profile?.title || 'Full Stack Engineer & MERN Specialist'}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono bg-zinc-900 text-emerald-400 border border-zinc-800 font-medium"
              >
                <Tag className="w-3 h-3 text-emerald-400/70" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Cover Image Banner (if available) */}
          {post.coverImage && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 mt-6 shadow-2xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Excerpt Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-zinc-200 text-sm sm:text-base leading-relaxed font-medium">
            <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold mb-1.5">
              Summary Overview
            </div>
            {post.excerpt}
          </div>
        </div>

        {/* Rendered Body Content */}
        <article className="pt-6 text-zinc-200 prose prose-invert max-w-none">
          {renderMarkdown(post.content)}
        </article>

        {/* Blog Image Gallery / Attached Media */}
        {post.images && post.images.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Article Media & Gallery ({post.images.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {post.images.map((imgUrl, i) => (
                <a
                  key={i}
                  href={imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group shadow-md"
                >
                  <img
                    src={imgUrl}
                    alt={`Attached graphic ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-emerald-400">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Pagination & Navigation */}
        <div className="mt-16 pt-8 border-t border-zinc-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-emerald-400 border border-zinc-800 text-xs font-semibold transition-all cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all articles</span>
            </button>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              ↑ Back to top
            </button>
          </div>

          {/* Previous / Next Article Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {prevPost ? (
              <div
                onClick={() => dispatch(setSelectedPost(prevPost))}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  <span>Previous Article</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-emerald-400 line-clamp-1">
                  {prevPost.title}
                </h4>
              </div>
            ) : <div />}

            {nextPost ? (
              <div
                onClick={() => dispatch(setSelectedPost(nextPost))}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group text-right"
              >
                <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                  <span>Next Article</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-emerald-400 line-clamp-1">
                  {nextPost.title}
                </h4>
              </div>
            ) : <div />}
          </div>
        </div>
      </main>

      {/* Reader Page Footer */}
      <footer className="mt-auto py-8 border-t border-zinc-800/80 text-center text-xs font-mono text-zinc-500">
        <p>© {new Date().getFullYear()} {profile?.name || 'Muhammad Ammar Nazir'}. Built with MERN Stack.</p>
      </footer>
    </div>
  );
};
