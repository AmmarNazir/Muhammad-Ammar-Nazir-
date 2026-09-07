import React, { useEffect, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from './store/index.ts';
import { fetchPortfolioData } from './store/portfolioSlice.ts';
import { fetchBlogs } from './store/blogSlice.ts';
import { verifySession } from './store/authSlice.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { LazySection } from './components/LazySection.tsx';

// Code-split / lazy load below-the-fold sections and modals
const About = React.lazy(() => import('./components/About.tsx').then((m) => ({ default: m.About })));
const ExperienceSection = React.lazy(() =>
  import('./components/ExperienceSection.tsx').then((m) => ({ default: m.ExperienceSection }))
);
const ProjectsSection = React.lazy(() =>
  import('./components/ProjectsSection.tsx').then((m) => ({ default: m.ProjectsSection }))
);
const SkillsSection = React.lazy(() =>
  import('./components/SkillsSection.tsx').then((m) => ({ default: m.SkillsSection }))
);
const BlogSection = React.lazy(() =>
  import('./components/BlogSection.tsx').then((m) => ({ default: m.BlogSection }))
);
const ContactSection = React.lazy(() =>
  import('./components/ContactSection.tsx').then((m) => ({ default: m.ContactSection }))
);
const Footer = React.lazy(() => import('./components/Footer.tsx').then((m) => ({ default: m.Footer })));
const ProjectModal = React.lazy(() =>
  import('./components/ProjectModal.tsx').then((m) => ({ default: m.ProjectModal }))
);
const BlogReaderPage = React.lazy(() =>
  import('./components/BlogReaderPage.tsx').then((m) => ({ default: m.BlogReaderPage }))
);
const AdminPanel = React.lazy(() =>
  import('./components/AdminPanel.tsx').then((m) => ({ default: m.AdminPanel }))
);

const SectionFallback = () => (
  <div className="w-full py-24 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-zinc-800 border-t-emerald-500 animate-spin" />
      <div className="w-20 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
    </div>
  </div>
);

export default function App() {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDark);
  const portfolioState = useAppSelector((state) => state.portfolio);
  const blogsState = useAppSelector((state) => state.blog);

  useEffect(() => {
    // Initial data hydration from backend
    dispatch(fetchPortfolioData());
    dispatch(fetchBlogs());
    dispatch(verifySession());
  }, [dispatch]);

  useEffect(() => {
    // Sync dark class on documentElement
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // If a blog post is selected, render the dedicated BlogReaderPage on a separate page
  if (blogsState.selectedPost) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
        <Suspense fallback={<SectionFallback />}>
          <BlogReaderPage
            post={blogsState.selectedPost}
            allPosts={blogsState.posts}
            profile={portfolioState.profile}
          />
        </Suspense>
        <Suspense fallback={null}>
          <AdminPanel />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100 transition-colors duration-200 selection:bg-emerald-500 selection:text-black flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Above-the-fold Hero loads instantly */}
        <Hero
          profile={portfolioState.profile}
          whatsappNumber={portfolioState.whatsappNumber}
        />

        {/* Below-the-fold sections are lazily loaded on scroll for maximum performance */}
        <LazySection id="about" minHeight="400px">
          <Suspense fallback={<SectionFallback />}>
            <About profile={portfolioState.profile} />
          </Suspense>
        </LazySection>

        <LazySection id="experience" minHeight="350px">
          <Suspense fallback={<SectionFallback />}>
            <ExperienceSection experiences={portfolioState.experiences} />
          </Suspense>
        </LazySection>

        <LazySection id="projects" minHeight="500px">
          <Suspense fallback={<SectionFallback />}>
            <ProjectsSection projects={portfolioState.projects} />
          </Suspense>
        </LazySection>

        <LazySection id="skills" minHeight="400px">
          <Suspense fallback={<SectionFallback />}>
            <SkillsSection skills={portfolioState.skills} />
          </Suspense>
        </LazySection>

        <LazySection id="blog" minHeight="400px">
          <Suspense fallback={<SectionFallback />}>
            <BlogSection posts={blogsState.posts} />
          </Suspense>
        </LazySection>

        <LazySection id="contact" minHeight="450px">
          <Suspense fallback={<SectionFallback />}>
            <ContactSection
              profile={portfolioState.profile}
              whatsappNumber={portfolioState.whatsappNumber}
            />
          </Suspense>
        </LazySection>
      </main>

      {/* Footer */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Modals & Overlays */}
      <Suspense fallback={null}>
        <ProjectModal />
        <AdminPanel />
      </Suspense>
    </div>
  );
}
