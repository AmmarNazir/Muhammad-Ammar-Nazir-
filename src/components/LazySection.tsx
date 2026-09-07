import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  id?: string;
  minHeight?: string;
  className?: string;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  id,
  minHeight = '200px',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(element);
          }
        },
        {
          rootMargin: '120px 0px',
          threshold: 0.05
        }
      );

      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    } else {
      // Fallback for environments without IntersectionObserver
      setIsVisible(true);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id={id}
      style={{ minHeight: isVisible ? undefined : minHeight }}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {isVisible ? (
        children
      ) : (
        <div className="w-full flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-emerald-500 animate-spin" />
            <div className="w-24 h-2 rounded bg-zinc-800 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};
