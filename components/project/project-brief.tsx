'use client';

import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Send,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { BriefContext } from './brief-context';
import {
  budgetOptions,
  emptyBrief,
  serviceOptions,
  timingOptions,
  validateBriefStep,
  type ProjectBrief,
} from './brief-model';

type Phase = 'draft' | 'review' | 'sent';
const newInquiry = (): ProjectBrief => ({
  ...emptyBrief(),
  budget: 'Let’s work it out',
  timing: 'I’m flexible',
});

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
  const [brief, setBrief] = useState<ProjectBrief>(newInquiry);
  const [phase, setPhase] = useState<Phase>('draft');
  const [error, setError] = useState<string | null>(null);
  const [invalidStep, setInvalidStep] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [contactFax, setContactFax] = useState('');
  const inFlight = useRef(false);
  const submission = useRef<{ content: string; id: string } | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    scroller.current?.scrollTo({ top: 0, behavior: 'instant' });
    heading.current?.focus({ preventScroll: true });
  }, [open, phase]);

  function update<K extends keyof ProjectBrief>(
    key: K,
    value: ProjectBrief[K],
  ) {
    setBrief((previous) => ({ ...previous, [key]: value }));
    setError(null);
    setInvalidStep(null);
  }

  function validate() {
    for (const step of [0, 1, 3, 4, 5, 6]) {
      const problem = validateBriefStep(step, brief);
      if (problem) {
        setError(problem);
        setInvalidStep(step);
        setPhase('draft');
        return false;
      }
    }
    return true;
  }

  async function send() {
    if (inFlight.current || !validate()) return;
    inFlight.current = true;
    setSending(true);
    setError(null);
    try {
      const content = JSON.stringify(brief);
      if (submission.current?.content !== content)
        submission.current = { content, id: crypto.randomUUID() };
      const response = await fetch('/api/project-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          contactFax,
          submissionId: submission.current.id,
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const result: unknown = await response.json();
      if (
        response.ok &&
        result &&
        typeof result === 'object' &&
        'sent' in result &&
        result.sent === true
      ) {
        setPhase('sent');
      } else {
        setError(
          result &&
            typeof result === 'object' &&
            'error' in result &&
            typeof result.error === 'string'
            ? result.error
            : 'We couldn’t confirm your inquiry was sent. Please try again.',
        );
      }
    } catch {
      setError(
        'We couldn’t confirm your inquiry was sent. Check your connection and try again. Your answers are still here.',
      );
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  function openInquiry(opener: HTMLElement) {
    returnFocus.current = opener;
    const service = opener.dataset.service;
    if (
      service &&
      serviceOptions.includes(service) &&
      phase !== 'sent' &&
      !inFlight.current
    ) {
      setBrief((previous) => ({
        ...previous,
        services: [...new Set([...previous.services, service])],
      }));
      setPhase('draft');
    }
    setOpen(true);
  }

  const fieldError = (step: number) => ({
    'aria-invalid': invalidStep === step,
    'aria-describedby': invalidStep === step ? 'inquiry-error' : undefined,
  });
  const review = [
    ['Name', brief.name],
    ['Email', brief.email],
    ['Services', brief.services.join(', ')],
    ['Your idea', brief.project],
    ...(brief.phone ? [['Phone', brief.phone]] : []),
    ...(brief.company ? [['Business', brief.company]] : []),
    ...(brief.website ? [['Website', brief.website]] : []),
    ['Budget · AUD', brief.budget],
    ['Timing', brief.timing],
  ];

  return (
    <BriefContext.Provider value={openInquiry}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="mini-inquiry"
          showCloseButton={false}
          initialFocus={heading}
          finalFocus={() =>
            returnFocus.current?.isConnected
              ? returnFocus.current
              : document.querySelector<HTMLElement>('.mini-header-cta')
          }
        >
          <div className="mini-inquiry-top">
            <span>GH CREATIVE / LET’S TALK</span>
            <DialogClose aria-label="Close inquiry">
              <X size={20} aria-hidden="true" />
            </DialogClose>
          </div>
          <div className="mini-inquiry-scroll" ref={scroller}>
            <p className="mini-inquiry-step">
              {phase === 'sent'
                ? 'INQUIRY SENT'
                : phase === 'review'
                  ? '02 / REVIEW & SEND'
                  : '01 / YOUR IDEA'}
            </p>
            <DialogTitle
              className="mini-inquiry-title"
              ref={heading}
              tabIndex={-1}
            >
              {phase === 'sent'
                ? 'WE’RE IN TOUCH.'
                : phase === 'review'
                  ? 'LOOKING GOOD?'
                  : 'WHAT’S ON YOUR MIND?'}
            </DialogTitle>
            <DialogDescription className="mini-inquiry-description">
              {phase === 'sent'
                ? `Thanks, ${brief.name.trim()}. Your inquiry has been sent to Gene. He’ll reply to ${brief.email.trim()}.`
                : phase === 'review'
                  ? 'Check your details before sending them to Gene.'
                  : 'A few details and a little about your idea. We can work out the rest together.'}
            </DialogDescription>
            {phase === 'sent' ? (
              <div className="mini-inquiry-success">
                <Check size={40} aria-hidden="true" />
                <p>You’re all set. Thanks for sharing your idea.</p>
                <DialogClose className="mini-button mini-button-primary">
                  BACK TO EXPLORING <ArrowRight size={18} aria-hidden="true" />
                </DialogClose>
                <button
                  type="button"
                  className="mini-text-button"
                  onClick={() => {
                    setBrief(newInquiry());
                    setPhase('draft');
                    setError(null);
                    setInvalidStep(null);
                    setContactFax('');
                    submission.current = null;
                  }}
                >
                  START ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form
                id="mini-inquiry-form"
                aria-busy={sending}
                onSubmit={(event) => {
                  event.preventDefault();
                  if (inFlight.current) return;
                  if (phase === 'review') void send();
                  else if (validate()) setPhase('review');
                }}
              >
                <div className="mini-honeypot" aria-hidden="true">
                  <label htmlFor="inquiry-fax">Leave this field empty</label>
                  <input
                    id="inquiry-fax"
                    name="contactFax"
                    tabIndex={-1}
                    autoComplete="off"
                    value={contactFax}
                    onChange={(event) => setContactFax(event.target.value)}
                  />
                </div>
                {phase === 'draft' ? (
                  <div className="mini-fields">
                    <label htmlFor="inquiry-name">
                      Your name
                      <input
                        id="inquiry-name"
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={120}
                        value={brief.name}
                        onChange={(event) => update('name', event.target.value)}
                        {...fieldError(0)}
                      />
                    </label>
                    <label htmlFor="inquiry-email">
                      Email address
                      <input
                        id="inquiry-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        required
                        maxLength={254}
                        value={brief.email}
                        onChange={(event) =>
                          update('email', event.target.value)
                        }
                        {...fieldError(1)}
                      />
                    </label>
                    <fieldset
                      className="mini-service-options"
                      aria-describedby={
                        invalidStep === 3 ? 'inquiry-error' : undefined
                      }
                    >
                      <legend>What can I help with?</legend>
                      <div>
                        {serviceOptions.map((service) => (
                          <label key={service}>
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
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <label htmlFor="inquiry-project">
                      Tell me about your idea
                      <textarea
                        id="inquiry-project"
                        name="project"
                        rows={4}
                        placeholder="What are you looking to create?"
                        required
                        minLength={20}
                        maxLength={5000}
                        value={brief.project}
                        onChange={(event) =>
                          update('project', event.target.value)
                        }
                        {...fieldError(4)}
                      />
                      <small>
                        A couple of sentences is plenty (20 characters minimum).
                      </small>
                    </label>
                    <details className="mini-optional-details">
                      <summary>
                        Add budget, timing or business details{' '}
                        <span>optional +</span>
                      </summary>
                      <div className="mini-fields">
                        <label htmlFor="inquiry-budget">
                          Budget · AUD
                          <select
                            id="inquiry-budget"
                            name="budget"
                            value={brief.budget}
                            onChange={(event) =>
                              update('budget', event.target.value)
                            }
                          >
                            {budgetOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </label>
                        <label htmlFor="inquiry-timing">
                          Timing
                          <select
                            id="inquiry-timing"
                            name="timing"
                            value={brief.timing}
                            onChange={(event) =>
                              update('timing', event.target.value)
                            }
                          >
                            {timingOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </label>
                        <label htmlFor="inquiry-phone">
                          Phone
                          <input
                            id="inquiry-phone"
                            type="tel"
                            name="phone"
                            autoComplete="tel"
                            maxLength={40}
                            value={brief.phone}
                            onChange={(event) =>
                              update('phone', event.target.value)
                            }
                          />
                        </label>
                        <label htmlFor="inquiry-company">
                          Business or project name
                          <input
                            id="inquiry-company"
                            name="company"
                            autoComplete="organization"
                            maxLength={160}
                            value={brief.company}
                            onChange={(event) =>
                              update('company', event.target.value)
                            }
                          />
                        </label>
                        <label htmlFor="inquiry-website">
                          Current website
                          <input
                            id="inquiry-website"
                            name="website"
                            inputMode="url"
                            autoComplete="url"
                            maxLength={500}
                            value={brief.website}
                            onChange={(event) =>
                              update('website', event.target.value)
                            }
                          />
                        </label>
                      </div>
                    </details>
                  </div>
                ) : (
                  <>
                    <dl className="mini-review">
                      {review.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mini-inquiry-note">
                      Your details will be emailed to Gene at GH Creative so he
                      can respond to your inquiry.
                    </p>
                  </>
                )}
              </form>
            )}
          </div>
          {phase !== 'sent' && (
            <div className="mini-inquiry-bottom">
              {error && (
                <p
                  id="inquiry-error"
                  className="mini-inquiry-error"
                  role="alert"
                >
                  {error}{' '}
                  {invalidStep === null && (
                    <a href="mailto:gene@alias.com.ai">
                      Email Gene directly{' '}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  )}
                </p>
              )}
              <div className="mini-inquiry-actions">
                {phase === 'review' && (
                  <button
                    type="button"
                    className="mini-inquiry-back"
                    disabled={sending}
                    onClick={() => {
                      setPhase('draft');
                      setError(null);
                    }}
                  >
                    <ArrowLeft size={16} aria-hidden="true" /> EDIT
                  </button>
                )}
                <button
                  type="submit"
                  form="mini-inquiry-form"
                  className="mini-button mini-button-primary"
                  disabled={sending}
                >
                  {sending
                    ? 'SENDING…'
                    : phase === 'review'
                      ? 'SEND INQUIRY'
                      : 'REVIEW YOUR INQUIRY'}
                  {phase === 'review' ? (
                    <Send size={18} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="mini-inquiry-note" aria-live="polite">
                {sending
                  ? 'Sending your inquiry. Please wait for confirmation.'
                  : 'Your answers stay here while you browse this visit.'}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </BriefContext.Provider>
  );
}
