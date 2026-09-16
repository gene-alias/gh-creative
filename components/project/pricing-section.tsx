'use client';
import { StaggeredText } from '@/components/ui/staggered-text';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Sparkles, Layers, Orbit } from 'lucide-react';
import * as PricingCard from '@/components/ui/pricing-card';
import { ProjectBriefTrigger } from './project-brief';

const options = [
  {
    menu: 'Focused Project', title: 'Focused Project.', tag: 'ONE CLEAR GOAL',
    description: 'A defined project in web, branding, visual design or audio, built around what you need next.',
    points: ['One service with a focused scope', 'Clear deliverables and timeline', 'Feedback and refinement along the way', 'Final files and a considered handover'],
  },
  {
    menu: 'Brand & Digital', title: 'Brand & Digital.', tag: 'BRING IT ALL TOGETHER',
    description: 'A coordinated identity, website and launch assets that give your business a consistent presence.',
    points: ['Brand identity and creative direction', 'Website design and development', 'Visual and audio assets as needed', 'A coordinated launch across your channels'],
  },
  {
    menu: 'Creative Partnership', title: 'Creative Partnership.', tag: 'KEEP MOVING FORWARD',
    description: 'Ongoing creative support for businesses that need fresh work, regular updates and a familiar collaborator.',
    points: ['Ongoing design, content and audio', 'Website updates and improvements', 'Agreed priorities and regular check-ins', 'A scope shaped around your ongoing needs'],
  },
];

export function PricingSection() {
  const track = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const change = (event: Event) => {
      const index = (event as CustomEvent<number>).detail;
      if (Number.isInteger(index)) setSelected(Math.max(0, Math.min(options.length - 1, index)));
    };
    element.addEventListener('pricing:select', change);
    return () => element.removeEventListener('pricing:select', change);
  }, []);

  function select(index: number) {
    setSelected(Math.max(0, Math.min(options.length - 1, index)));
  }

  return (
    <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
      <p className="eyebrow section-index"><span>04 / WORK TOGETHER</span><span>↗</span></p>
      <h2 id="pricing-title">
        <span className="section-title-line"><span className="section-title-reveal"><StaggeredText as="span" text="Ways to work" desktopOnly viewportReveal segmentBy="chars" delay={28} duration={0.8} direction="bottom" blur={false} /></span></span>
        <span className="section-title-line"><span className="section-title-reveal"><em><StaggeredText as="span" text="together" desktopOnly viewportReveal segmentBy="chars" delay={28} duration={0.8} direction="bottom" blur={false} /></em></span></span>
      </h2>
      <p className="body-copy pricing-intro">Every project is different. Scope, timing and pricing are agreed around your needs.</p>
      <div className="desktop-pricing-grid">
        {options.map((option, index) => {
          const Icon = [Sparkles, Layers, Orbit][index];
          return (
            <PricingCard.Card className="desktop-plan" key={option.menu}>
              <PricingCard.Header className="desktop-plan__header">
                <PricingCard.Plan className="desktop-plan__plan">
                  <PricingCard.PlanName className="desktop-plan__name">
                    <Icon aria-hidden="true" /><h3>{option.menu}</h3>
                  </PricingCard.PlanName>
                </PricingCard.Plan>
                <p className="eyebrow desktop-plan__tag">{option.tag}</p>
                <ProjectBriefTrigger className="button primary desktop-plan__cta">
                  GET A PROJECT QUOTE <ArrowUpRight size={18} aria-hidden="true" />
                </ProjectBriefTrigger>
              </PricingCard.Header>
              <PricingCard.Body className="desktop-plan__body">
                <PricingCard.Description className="desktop-plan__description">{option.description}</PricingCard.Description>
                <PricingCard.List>
                  {option.points.map((point) => (
                    <PricingCard.ListItem key={point} className="desktop-plan__feature">
                      <CheckCircle2 size={18} aria-hidden="true" /><span>{point}</span>
                    </PricingCard.ListItem>
                  ))}
                </PricingCard.List>
              </PricingCard.Body>
            </PricingCard.Card>
          );
        })}
      </div>
      <div className="pricing-showcase">
      <fieldset className="pricing-menu" aria-label="Choose a pricing option">
        {options.map((option, index) => (
          <button key={option.menu} type="button" aria-pressed={selected === index}
            aria-controls="pricing-cards" onClick={() => select(index)}>{option.menu}</button>
        ))}
      </fieldset>
      <section className="pricing-track" id="pricing-cards" ref={track}
        aria-roledescription="carousel" aria-label="Ways to work together"
        >
        {options.map((option, index) => (
          <article className="pricing-card" key={option.menu} data-active={selected === index ? '' : undefined}
            inert={selected !== index} aria-roledescription="slide" aria-label={`${index + 1} of ${options.length}: ${option.menu}`}>
            <p className="eyebrow">0{index + 1} / {option.tag}</p>
            <h3><span className="pricing-title-mask"><span>{option.title}</span></span></h3>
            <p className="pricing-description">{option.description}</p>
            <ul>{option.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <ProjectBriefTrigger className="button primary pricing-cta">
              GET A PROJECT QUOTE <ArrowUpRight size={19} aria-hidden="true" />
            </ProjectBriefTrigger>
          </article>
        ))}
      </section>
      <div className="pricing-controls">
        <span className="eyebrow" aria-live="polite">0{selected + 1} / 03 — {options[selected].menu}</span>
        <div>
          <button type="button" aria-label="Previous pricing option" disabled={selected === 0} onClick={() => select(selected - 1)}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" aria-label="Next pricing option" disabled={selected === options.length - 1} onClick={() => select(selected + 1)}><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
      </div>
    </section>
  );
}
