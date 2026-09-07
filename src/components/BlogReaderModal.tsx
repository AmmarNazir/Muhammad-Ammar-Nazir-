import React, { useEffect } from 'react';
import { X, Calendar, Clock, Share2, Check } from 'lucide-react';
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
        <ul key={key} className="list-disc list-inside space-y-1 my-3 text-zinc-300">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
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
          <div key={`code-${idx}`} className="my-4 rounded-2xl bg-black text-emerald-400 p-4 font-mono text-xs overflow-x-auto border border-zinc-800">
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
        <h3 key={idx} className="text-base font-bold text-zinc-100 mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="text-lg font-bold text-zinc-100 mt-8 mb-3 pb-1 border-b border-zinc-800">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={idx} className="text-xl font-black text-zinc-100 mt-8 mb-4">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={idx} className="h-2" />);
    } else {
      elements.push(
        <p key={idx} className="my-2 text-zinc-300 leading-relaxed text-sm sm:text-base">
          {line}
        </p>
      );
    }
  });

  flushList('final-list');

  return elements;
}

export const BlogReaderModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.blog.selectedPost);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(setSelectedPost(null));
      }
    };
    if (post) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [post, dispatch]);

  if (!post) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0f0f0f] border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-8 border-b border-zinc-800 flex items-center justify-between gap-4 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTimeMinutes} min read</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Copy article link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => dispatch(setSelectedPost(null))}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 sm:p-10 overflow-y-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md text-xs font-mono bg-zinc-900 text-emerald-400 border border-zinc-800 font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt Lead */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border-l-4 border-emerald-500 text-zinc-300 text-sm font-medium mb-8 leading-relaxed">
            {post.excerpt}
          </div>

          {/* Rendered Body */}
          <div className="space-y-4">
            {renderMarkdown(post.content)}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono shrink-0">
          <span>By Muhammad Ammar Nazir</span>
          <button
            type="button"
            onClick={() => dispatch(setSelectedPost(null))}
            className="text-emerald-400 hover:underline cursor-pointer"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
