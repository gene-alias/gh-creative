import { deliverProjectBrief } from '../lib/server/project-brief.ts';

// Vercel serves this function alongside the exported static site.
const handler = {
  fetch(request: Request) {
    return deliverProjectBrief(request, {
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.PROJECT_BRIEF_FROM,
    });
  },
};

export default handler;
