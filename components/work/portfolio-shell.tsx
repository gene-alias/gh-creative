/* Static export uses document navigation for work routes. */
/* oxlint-disable next/no-html-link-for-pages */
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { GHMonogram } from '@/components/brand/gh-monogram';
import { ProjectBriefTrigger } from '@/components/project/project-brief';

export function PortfolioHeader() {
  return (
    <header className="portfolio-content-header">
      <a
        href="/"
        className="portfolio-content-logo"
        aria-label="GH Creative home"
      >
        <GHMonogram wordmark />
      </a>
      <nav aria-label="Main navigation">
        <a href="/#work">WORK</a>
        <a href="/#services">SERVICES</a>
        <a href="/#studio">STUDIO</a>
      </nav>
      <ProjectBriefTrigger className="text-link">
        LET’S TALK <ArrowUpRight size={18} aria-hidden="true" />
      </ProjectBriefTrigger>
    </header>
  );
}

export function PortfolioFooter() {
  return (
    <footer className="portfolio-content-footer">
      <p>
        INDEPENDENT BY DESIGN.
        <br />
        <span>© {new Date().getFullYear()} GH CREATIVE</span>
      </p>
      <a href="/#contact">
        START A CONVERSATION <ArrowUpRight size={18} aria-hidden="true" />
      </a>
      <a href="#top" aria-label="Back to top">
        <ArrowUp size={22} aria-hidden="true" />
      </a>
    </footer>
  );
}
