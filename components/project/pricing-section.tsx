'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ProjectBriefTrigger } from './project-brief';

const options = [
  {
    menu: 'Essentials', title: 'Essentials.', tag: 'THE ESSENTIALS',
    description: 'One-off projects with a simpler scope, tailored to smaller budgets.',
    points: ['Focused scope, less complexity', 'Built around your budget', 'A high standard of delivery', 'Ongoing support after delivery'],
  },
  {
    menu: 'Premium', title: 'Premium.', tag: 'MORE POSSIBILITIES',
    description: 'Animation and motion graphics for a cinematic finish, with creative services combined around your project.',
    points: ['Animation & motion graphics', 'Cinematic output across creative services', 'Discounts on bundled services', 'Ongoing support & project refinements'],
  },
  {
    menu: 'Pro', title: 'Pro.', tag: 'THE COMPLETE PICTURE',
    description: 'Immersive digital experiences with our highest level of ongoing support, from project iterations to life after delivery.',
    points: ['Immersive digital experiences', 'Ongoing project iterations & refinements', 'Our highest level of ongoing support after delivery'],
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
      <p className="eyebrow section-index"><span>04 / PRICING</span><span>↗</span></p>
      <h2 id="pricing-title">
        <span className="section-title-line"><span className="section-title-reveal">Pricing tailored</span></span>
        <span className="section-title-line"><span className="section-title-reveal"><em>to your needs</em></span></span>
      </h2>
      <p className="body-copy pricing-intro">Transparent pricing from day one.</p>
      <div className="pricing-showcase">
      <fieldset className="pricing-menu" aria-label="Choose a pricing option">
        {options.map((option, index) => (
          <button key={option.menu} type="button" aria-pressed={selected === index}
            aria-controls="pricing-cards" onClick={() => select(index)}>{option.menu}</button>
        ))}
      </fieldset>
      <section className="pricing-track" id="pricing-cards" ref={track}
        aria-roledescription="carousel" aria-label="One-off project packages"
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
