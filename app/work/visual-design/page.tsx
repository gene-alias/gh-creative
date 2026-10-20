import { MiniHeader, MiniFooter } from '@/components/mini/site-shell';
import { VisualArtGallery } from '@/components/work/visual-gallery';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
export const metadata = { title: 'Visual art / GH Creative' };
export default function VisualArt() {
  return (
    <main className="mini-site" id="top">
      <MiniHeader />
      <Link className="mini-work-back" href="/#work">
        <ArrowLeft size={16} /> BACK TO SELECTED WORK
      </Link>
      <section className="mini-work-intro">
        <p className="mini-index">
          <span>02 / VISUAL ART</span>
          <ArrowUpRight size={15} />
        </p>
        <h1>Visual work.</h1>
        <p>
          Image-making, art direction and visual concepts across products,
          people and spaces.
        </p>
      </section>
      <VisualArtGallery />
      <div className="mini-work-inquiry">
        <ProjectBriefTrigger
          className="mini-button mini-button-primary"
          data-service="Visual design"
        >
          LET’S CREATE SOMETHING <ArrowUpRight size={20} />
        </ProjectBriefTrigger>
      </div>
      <MiniFooter />
    </main>
  );
}
