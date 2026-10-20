'use client';

import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { ArrowLeft, ArrowRight, Check, Download, Send, X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { GHMonogram } from '@/components/brand/gh-monogram';
import { BriefContext, BriefMountContext } from './brief-context';
import { createPortal } from 'react-dom';
import {
  budgetOptions,
  emptyBrief,
  formatBrief,
  serviceOptions,
  timingOptions,
  validateBriefStep,
  type ProjectBrief,
} from './brief-model';

const steps = [
  {
    label: 'INTRODUCTIONS',
    title: 'First, what’s your name?',
    description:
      'Good projects start with a conversation. Let’s get to know you.',
  },
  {
    label: 'YOUR DETAILS',
    title: 'How can we reach you?',
    description:
      'An email is all we need. Add a phone number if you prefer a call.',
  },
  {
    label: 'YOUR BUSINESS',
    title: 'Who are we creating for?',
    description:
      'A business, a personal project, or something new. These details are optional.',
  },
  {
    label: 'THE DISCIPLINES',
    title: 'What do you have in mind?',
    description:
      'Choose all that apply. We can work out the right mix together.',
  },
  {
    label: 'YOUR PROJECT',
    title: 'Tell us about your idea.',
    description:
      'What are you making, who is it for, and what would a great outcome look like? Include any links or references.',
  },
  {
    label: 'THE INVESTMENT',
    title: 'What’s your budget?',
    description:
      'An approximate range helps shape the scope. All amounts are in AUD.',
  },
  {
    label: 'THE TIMING',
    title: 'When do you need it?',
    description:
      'A rough timeframe is fine. We’ll work through the details together.',
  },
  {
    label: 'YOUR BRIEF',
    title: 'Confirm your details.',
    description: 'Review your answers, then send your project brief to Gene.',
  },
];

export function ProjectBriefTrigger({
  onClick,
  children,
  ...props
}: ComponentProps<'button'>) {
  const openBrief = useContext(BriefContext);
  if (!openBrief)
    throw new Error('ProjectBriefTrigger requires ProjectBriefProvider');
  return (
    <button
      {...props}
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openBrief(event.currentTarget);
      }}
    >
      {children}
    </button>
  );
}

export function ProjectBriefProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dialogMounted, setDialogMounted] = useState(false);
  const [inlineMount, setInlineMount] = useState<HTMLDivElement | null>(null);
  const [brief, setBrief] = useState<ProjectBrief>(emptyBrief);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [editing, setEditing] = useState(false);
  const [sending, setSending] = useState(false);
  const [contactFax, setContactFax] = useState('');
  const inFlight = useRef(false);
  const submission = useRef<{ content: string; id: string } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const lastStep = steps.length - 1;
  const current = steps[step];

  useEffect(() => {
    if (!open && (!inlineMount || (step === 0 && !complete))) return;
    const frame = requestAnimationFrame(() => {
      scroller.current?.scrollTo({ top: 0, behavior: 'instant' });
      heading.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [step, open, complete, inlineMount]);

  useEffect(() => {
    if (!error || (!open && !inlineMount)) return;
    const frame = requestAnimationFrame(() => {
      const panel = scroller.current;
      if (panel)
        panel.scrollTo({ top: panel.scrollHeight, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [error, open, inlineMount]);

  function update<K extends keyof ProjectBrief>(
    key: K,
    value: ProjectBrief[K],
  ) {
    setBrief((previous) => ({ ...previous, [key]: value }));
    setError(null);
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([formatBrief(brief)], { type: 'text/plain;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gh-creative-project-brief.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function sendBrief() {
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setError(null);
    try {
      const content = JSON.stringify(brief);
      if (submission.current?.content !== content) {
        submission.current = { content, id: crypto.randomUUID() };
      }
      const response = await fetch('/api/project-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          contactFax,
          submissionId: submission.current.id,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      const result: unknown = await response.json();
      if (
        response.ok &&
        result &&
        typeof result === 'object' &&
        'sent' in result &&
        result.sent === true
      ) {
        setConfirmationSent(
          'confirmationSent' in result && result.confirmationSent === true,
        );
        setComplete(true);
      } else {
        const message =
          result &&
          typeof result === 'object' &&
          'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : 'We couldn’t confirm your brief was sent. Please try again.';
        setError(message);
      }
    } catch {
      setError(
        'We couldn’t confirm your brief was sent. Check your connection and try again. Your answers are still here.',
      );
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  function advance(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const problem = validateBriefStep(step, brief);
    if (problem) {
      setError(problem);
      return;
    }
    if (step < lastStep) {
      setStep(editing ? lastStep : step + 1);
      setEditing(false);
    } else {
      const invalid = steps.findIndex((_, index) =>
        validateBriefStep(index, brief),
      );
      if (invalid !== -1) {
        setStep(invalid);
        setError(validateBriefStep(invalid, brief));
        return;
      }
      void sendBrief();
    }
  }

  const review = [
    { label: 'Name', value: brief.name, step: 0 },
    {
      label: 'Contact',
      value: [brief.email, brief.phone].filter(Boolean).join('\n'),
      step: 1,
    },
    {
      label: 'Business',
      value:
        [brief.company, brief.website].filter(Boolean).join('\n') ||
        'Not provided',
      step: 2,
    },
    { label: 'Services', value: brief.services.join(', '), step: 3 },
    { label: 'Project', value: brief.project, step: 4 },
    { label: 'Budget · AUD', value: brief.budget, step: 5 },
    { label: 'Timing', value: brief.timing, step: 6 },
  ];
  const errorAttributes = {
    'aria-invalid': !!error,
    'aria-describedby': error ? 'brief-error' : undefined,
  };

  const Title = dialogMounted ? DialogTitle : 'h3';
  const Description = dialogMounted ? DialogDescription : 'p';
  const content = (
    <>
      <div className="brief-topbar">
        <GHMonogram />
        <span>LET’S MAKE IT HAPPEN</span>
        {open && (
          <DialogClose className="brief-close" aria-label="Close project brief">
            <X size={20} />
          </DialogClose>
        )}
      </div>
      <div className="brief-progress" aria-hidden="true">
        {steps.map((item, index) => (
          <span
            key={item.label}
            data-complete={index <= step || complete ? '' : undefined}
          />
        ))}
      </div>
      <div className="brief-scroll" ref={scroller}>
        <div className="brief-step" key={complete ? 'complete' : step}>
          <p className="brief-eyebrow">
            {complete
              ? 'BRIEF SENT'
              : `${String(step + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')} / ${current.label}`}
          </p>
          <Title ref={heading} tabIndex={-1} className="brief-title">
            {complete ? 'Your next chapter starts here.' : current.title}
          </Title>
          <Description className="brief-description">
            {complete
              ? 'Thanks for sharing your idea. Your project brief has been sent to Gene at GH Creative.'
              : current.description}
          </Description>
          {complete ? (
            <div className="brief-complete">
              <span className="brief-complete-icon">
                <Check size={28} />
              </span>
              <p>
                {confirmationSent
                  ? `A confirmation email is on its way to ${brief.email}. Gene will review your brief and reply to you.`
                  : `Your inquiry was sent to Gene, but we couldn’t confirm your receipt email was sent to ${brief.email}. You can save a copy below.`}
              </p>
              {!confirmationSent && (
                <button
                  type="button"
                  className="brief-next"
                  disabled={sending}
                  onClick={() => void sendBrief()}
                >
                  {sending ? 'SENDING…' : 'TRY CONFIRMATION AGAIN'}{' '}
                  <Send size={18} />
                </button>
              )}
              {error && (
                <p className="brief-error" role="alert">
                  {error}
                </p>
              )}
              <button type="button" className="brief-next" onClick={download}>
                SAVE A COPY <Download size={18} />
              </button>
              <button
                type="button"
                className="brief-back"
                disabled={sending}
                onClick={() => {
                  setBrief(emptyBrief());
                  setStep(0);
                  setComplete(false);
                  setConfirmationSent(false);
                  setEditing(false);
                  setError(null);
                  setContactFax('');
                  submission.current = null;
                }}
              >
                START ANOTHER PROJECT
              </button>
              {open && <DialogClose className="brief-back">CLOSE</DialogClose>}
            </div>
          ) : (
            <form
              id="project-brief-form"
              onSubmit={advance}
              aria-busy={sending}
            >
              <div className="brief-honeypot" aria-hidden="true">
                <label htmlFor="brief-fax">Leave this field empty</label>
                <input
                  id="brief-fax"
                  name="contactFax"
                  tabIndex={-1}
                  autoComplete="off"
                  value={contactFax}
                  onChange={(event) => setContactFax(event.target.value)}
                />
              </div>
              {step === 0 && (
                <label className="brief-field" htmlFor="brief-name">
                  Your name
                  <input
                    id="brief-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    maxLength={120}
                    value={brief.name}
                    onChange={(event) => update('name', event.target.value)}
                    {...errorAttributes}
                  />
                </label>
              )}
              {step === 1 && (
                <>
                  <label className="brief-field" htmlFor="brief-email">
                    Email address
                    <input
                      id="brief-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@company.com"
                      required
                      maxLength={254}
                      value={brief.email}
                      onChange={(event) => update('email', event.target.value)}
                      {...errorAttributes}
                    />
                  </label>
                  <label className="brief-field" htmlFor="brief-phone">
                    Phone <span>optional</span>
                    <input
                      id="brief-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Your phone number"
                      maxLength={40}
                      value={brief.phone}
                      onChange={(event) => update('phone', event.target.value)}
                    />
                  </label>
                </>
              )}
              {step === 2 && (
                <>
                  <label className="brief-field" htmlFor="brief-company">
                    Business or project name <span>optional</span>
                    <input
                      id="brief-company"
                      name="company"
                      autoComplete="organization"
                      placeholder="Your business or project"
                      maxLength={160}
                      value={brief.company}
                      onChange={(event) =>
                        update('company', event.target.value)
                      }
                    />
                  </label>
                  <label className="brief-field" htmlFor="brief-website">
                    Current website <span>optional</span>
                    <input
                      id="brief-website"
                      name="website"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="yourwebsite.com"
                      maxLength={500}
                      value={brief.website}
                      onChange={(event) =>
                        update('website', event.target.value)
                      }
                    />
                  </label>
                </>
              )}
              {step === 3 && (
                <fieldset
                  className="brief-options"
                  aria-describedby={error ? 'brief-error' : undefined}
                >
                  <legend className="sr-only">Choose services</legend>
                  {serviceOptions.map((service) => (
                    <label className="brief-option" key={service}>
                      <input
                        type="checkbox"
                        name="services"
                        value={service}
                        checked={brief.services.includes(service)}
                        onChange={(event) =>
                          update(
                            'services',
                            event.target.checked
                              ? [...brief.services, service]
                              : brief.services.filter(
                                  (item) => item !== service,
                                ),
                          )
                        }
                      />
                      <span>{service}</span>
                      <Check size={17} aria-hidden="true" />
                    </label>
                  ))}
                </fieldset>
              )}
              {step === 4 && (
                <label className="brief-field" htmlFor="brief-project">
                  Your project brief
                  <textarea
                    id="brief-project"
                    name="project"
                    rows={5}
                    placeholder="The idea, the audience, the ambition…"
                    required
                    minLength={20}
                    maxLength={5000}
                    value={brief.project}
                    onChange={(event) => update('project', event.target.value)}
                    {...errorAttributes}
                  />
                  <span className="brief-character-count">
                    {brief.project.length} / 5,000
                  </span>
                </label>
              )}
              {(step === 5 || step === 6) && (
                <fieldset
                  className="brief-options"
                  aria-describedby={error ? 'brief-error' : undefined}
                >
                  <legend className="sr-only">
                    {step === 5 ? 'Budget in AUD' : 'Project timeframe'}
                  </legend>
                  {(step === 5 ? budgetOptions : timingOptions).map(
                    (option) => {
                      const field = step === 5 ? 'budget' : 'timing';
                      return (
                        <label className="brief-option" key={option}>
                          <input
                            type="radio"
                            name={field}
                            value={option}
                            checked={brief[field] === option}
                            onChange={() => update(field, option)}
                          />
                          <span>{option}</span>
                          <Check size={17} aria-hidden="true" />
                        </label>
                      );
                    },
                  )}
                </fieldset>
              )}
              {step === lastStep && (
                <>
                  <dl className="brief-review">
                    {review.map((item) => (
                      <div key={item.label}>
                        <dt>
                          {item.label}
                          <button
                            type="button"
                            disabled={sending}
                            onClick={() => {
                              setEditing(true);
                              setError(null);
                              setStep(item.step);
                            }}
                            aria-label={`Edit ${item.label}`}
                          >
                            EDIT
                          </button>
                        </dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="brief-delivery-note">
                    Your details and project brief will be emailed to Gene at GH
                    Creative. You’ll also receive a confirmation email, with
                    replies going directly to Gene.
                  </p>
                </>
              )}
              {error && (
                <p id="brief-error" className="brief-error" role="alert">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
      {!complete && (
        <div className="brief-footer">
          <div className="brief-actions">
            <button
              type="button"
              className="brief-back"
              disabled={sending || (step === 0 && !editing)}
              onClick={() => {
                setError(null);
                setStep(editing ? lastStep : step - 1);
                setEditing(false);
              }}
            >
              <ArrowLeft size={16} /> BACK
            </button>
            <button
              type="submit"
              form="project-brief-form"
              className="brief-next"
              disabled={sending}
            >
              {sending
                ? 'SENDING…'
                : step === lastStep
                  ? 'SEND PROJECT BRIEF'
                  : editing
                    ? 'SAVE CHANGES'
                    : step === lastStep - 1
                      ? 'REVIEW DETAILS'
                      : 'CONTINUE'}
              {step === lastStep ? (
                <Send size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
            </button>
          </div>
          <p className="brief-footnote" aria-live="polite">
            {sending
              ? 'Sending your brief. Please wait for confirmation.'
              : 'Your answers stay here while you browse this visit.'}
          </p>
          <p className="brief-call">
            Prefer a call? <a href="tel:+61405179803">+61 405 179 803</a>
          </p>
        </div>
      )}
    </>
  );

  return (
    <BriefMountContext.Provider value={setInlineMount}>
      <BriefContext.Provider
        value={(opener) => {
          returnFocus.current = opener;
          const service = opener.dataset.service;
          if (
            service &&
            serviceOptions.includes(service) &&
            !complete &&
            !inFlight.current
          ) {
            setBrief((previous) => ({
              ...previous,
              services: [...new Set([...previous.services, service])],
            }));
            if (step === lastStep) setStep(3);
          }
          setDialogMounted(true);
          setOpen(true);
        }}
      >
        {children}
        {!dialogMounted &&
          inlineMount &&
          createPortal(
            <div
              className="project-brief project-brief--inline"
              data-slot="dialog-content"
            >
              {content}
            </div>,
            inlineMount,
          )}
        <Dialog
          open={open}
          onOpenChange={setOpen}
          onOpenChangeComplete={(isOpen) => {
            if (!isOpen) setDialogMounted(false);
          }}
        >
          <DialogContent
            className="project-brief"
            showCloseButton={false}
            initialFocus={heading}
            finalFocus={() =>
              returnFocus.current?.isConnected
                ? returnFocus.current
                : document.querySelector<HTMLElement>(
                    '.menu-trigger, .portfolio-nav a',
                  )
            }
          >
            {content}
          </DialogContent>
        </Dialog>
      </BriefContext.Provider>
    </BriefMountContext.Provider>
  );
}
