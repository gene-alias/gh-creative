export const serviceOptions = ['Web design', 'Visual design', 'Branding', 'Audio design', 'Marketing', 'Help me decide'];
export const budgetOptions = ['Under $2,000', '$2,000 to $5,000', '$5,000 to $10,000', '$10,000+', 'Let’s work it out'];
export const timingOptions = ['As soon as possible', 'Within 1 to 2 months', 'Within 3 to 6 months', 'I’m flexible'];

export type ProjectBrief = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  services: string[];
  project: string;
  budget: string;
  timing: string;
};

export const emptyBrief = (): ProjectBrief => ({
  name: '', email: '', phone: '', company: '', website: '',
  services: [], project: '', budget: '', timing: '',
});

export function validateBriefStep(step: number, brief: ProjectBrief): string | null {
  if (step === 0 && !brief.name.trim()) return 'Please enter your name.';
  if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email.trim())) return 'Please enter a valid email address.';
  if (step === 3 && !brief.services.length) return 'Choose at least one service, or “Help me decide”.';
  if (step === 4 && brief.project.trim().length < 20) return 'Tell us a little more (at least 20 characters).';
  if (step === 5 && !brief.budget) return 'Choose a budget range, or “Let’s work it out”.';
  if (step === 6 && !brief.timing) return 'Choose a timeframe, or “I’m flexible”.';
  return null;
}

export function formatBrief(brief: ProjectBrief): string {
  return [
    'GH CREATIVE / PROJECT BRIEF', '',
    `Name: ${brief.name.trim()}`, `Email: ${brief.email.trim()}`,
    `Phone: ${brief.phone.trim() || 'Not provided'}`,
    `Company: ${brief.company.trim() || 'Not provided'}`,
    `Website: ${brief.website.trim() || 'Not provided'}`, '',
    `Services: ${brief.services.join(', ')}`, `Budget (AUD): ${brief.budget}`,
    `Timing: ${brief.timing}`, '', 'PROJECT BRIEF', brief.project.trim(), '',
  ].join('\n');
}
