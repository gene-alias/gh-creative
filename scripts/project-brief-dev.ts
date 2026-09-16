import type { Plugin } from 'vite';
import { deliverProjectBrief, MAX_BRIEF_BYTES, type BriefDeliveryConfig } from '../lib/server/project-brief.ts';

/** Expose the same server handler in Vinext's local development server. */
export function projectBriefDev(config: BriefDeliveryConfig): Plugin {
  return {
    name: 'project-brief-api',
    configureServer(server) {
      server.middlewares.use((incoming, outgoing, next) => {
        const url = new URL(incoming.url ?? '/', `http://${incoming.headers.host ?? 'localhost'}`);
        if (url.pathname !== '/api/project-brief') { next(); return; }
        void (async () => {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of incoming) {
            const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            size += buffer.length;
            if (size > MAX_BRIEF_BYTES) {
              outgoing.writeHead(413, { 'Content-Type': 'application/json' });
              outgoing.end(JSON.stringify({ error: 'Your brief is too long.' }));
              return;
            }
            chunks.push(buffer);
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(incoming.headers)) {
            if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
          }
          const method = incoming.method ?? 'GET';
          const request = new Request(url, {
            method, headers,
            body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks).toString('utf8'),
          });
          const response = await deliverProjectBrief(request, config);
          outgoing.writeHead(response.status, Object.fromEntries(response.headers.entries()));
          outgoing.end(await response.text());
        })().catch(() => {
          if (!outgoing.headersSent) outgoing.writeHead(500, { 'Content-Type': 'application/json' });
          outgoing.end(JSON.stringify({ error: 'Unable to send your brief. Please try again.' }));
        });
      });
    },
  };
}
