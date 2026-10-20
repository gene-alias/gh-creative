import Link from 'next/link';
import { ArrowUpRight, ArrowUp, Send } from 'lucide-react';
import { GHMonogram } from '@/components/brand/gh-monogram';
import { ProjectBriefTrigger } from '@/components/project/project-brief';

export function MiniHeader() {
  return (
    <header className="mini-header">
      <Link href="/" className="mini-logo" aria-label="GH Creative home">
        <GHMonogram wordmark />
      </Link>
      <ProjectBriefTrigger className="mini-header-cta">
        LET’S TALK <ArrowUpRight size={15} aria-hidden="true" />
      </ProjectBriefTrigger>
    </header>
  );
}

export function MiniFooter() {
  return (
    <>
      <footer className="mini-footer">
        <p>
          INDEPENDENT BY DESIGN.
          <br />
          <span>© {new Date().getFullYear()} GH CREATIVE</span>
        </p>
        <a href="#top" aria-label="Back to top">
          <ArrowUp size={19} aria-hidden="true" />
        </a>
      </footer>
      <nav className="mini-bottom-nav" aria-label="Quick navigation">
        <Link href="/#services">SERVICES</Link>
        <Link href="/#work">WORK</Link>
        <Link href="/#studio">ABOUT</Link>
        <ProjectBriefTrigger>
          <Send size={15} aria-hidden="true" /> INQUIRE
        </ProjectBriefTrigger>
      </nav>
    </>
  );
}
