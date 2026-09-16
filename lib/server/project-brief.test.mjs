import assert from 'node:assert/strict';
import test from 'node:test';
import { deliverProjectBrief, BRIEF_RECIPIENT, MAX_BRIEF_BYTES } from './project-brief.ts';

const config = { apiKey: 'test-key-never-sent', from: 'GH Creative <projects@example.com>' };
const valid = () => ({
  submissionId: '00000000-0000-4000-8000-000000000001', contactFax: '',
  brief: {
    name: 'Alex Example', email: 'alex@example.com', phone: '+61 400 000 000',
    company: 'Example Studio', website: 'example.com', services: ['Web design', 'Marketing'],
    project: 'A new website for our studio.\nLaunch the new portfolio.',
    budget: 'Let’s work it out', timing: 'I’m flexible',
  },
});
function request(payload = valid(), headers = {}) {
  return new Request('https://gh.example/api/project-brief', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://gh.example', ...headers },
    body: JSON.stringify(payload),
  });
}
const neverSend = async () => { assert.fail('Invalid requests must not send email'); };

test('sends all brief details only to Gene, with visitor reply-to and a retry key', async () => {
  let captured;
  const response = await deliverProjectBrief(request({ ...valid(), to: 'untrusted@example.com' }), config, async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    captured = options;
    return Response.json({ id: 'email-123' });
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { sent: true });
  const message = JSON.parse(captured.body);
  assert.deepEqual(message.to, [BRIEF_RECIPIENT]);
  assert.equal(BRIEF_RECIPIENT, 'gene@alias.com.ai');
  assert.equal(message.reply_to, valid().brief.email);
  assert.equal(message.from, config.from);
  for (const value of Object.values(valid().brief).flat()) assert.ok(message.text.includes(value));
  assert.equal(captured.headers['Idempotency-Key'], `project-brief/${valid().submissionId}`);
  assert.equal(captured.headers.Authorization, `Bearer ${config.apiKey}`);
  assert.ok(!message.text.includes('has not been sent'));
});

test('missing credentials fail honestly rather than showing a sent confirmation', async () => {
  const response = await deliverProjectBrief(request(), {}, neverSend);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).sent, undefined);
});

test('provider failure, timeout and malformed success never report sent', async () => {
  for (const send of [
    async () => Response.json({ message: 'private provider details' }, { status: 403 }),
    async () => { throw new Error('private network details'); },
    async () => Response.json({}),
  ]) {
    const response = await deliverProjectBrief(request(), config, send);
    assert.equal(response.status, 502);
    const body = await response.text();
    assert.ok(!body.includes('private'));
    assert.ok(!body.includes('"sent":true'));
  }
});

test('rejects invalid fields, unsupported choices and simple bot submissions', async () => {
  for (const payload of [
    { ...valid(), brief: { ...valid().brief, email: 'bad\r\nBcc: spam@example.com' } },
    { ...valid(), brief: { ...valid().brief, services: ['Injected service'] } },
    { ...valid(), brief: { ...valid().brief, project: 'short' } },
    { ...valid(), brief: { ...valid().brief, name: 'a'.repeat(121) } },
    { ...valid(), brief: null },
    { ...valid(), contactFax: 'bot-fill' },
    { ...valid(), submissionId: '../invalid' },
  ]) {
    assert.equal((await deliverProjectBrief(request(payload), config, neverSend)).status, 422);
  }
});

test('rejects cross-origin, malformed and oversized requests before delivery', async () => {
  assert.equal((await deliverProjectBrief(request(valid(), { Origin: 'https://elsewhere.example' }), config, neverSend)).status, 403);
  assert.equal((await deliverProjectBrief(request(valid(), { 'Content-Type': 'text/plain' }), config, neverSend)).status, 415);
  assert.equal((await deliverProjectBrief(new Request('https://gh.example/api/project-brief', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  }), config, neverSend)).status, 400);
  assert.equal((await deliverProjectBrief(request({ extra: 'x'.repeat(MAX_BRIEF_BYTES) }), config, neverSend)).status, 413);
});

test('unchanged retries reuse the same provider idempotency key', async () => {
  const keys = [];
  const send = async (_, options) => { keys.push(options.headers['Idempotency-Key']); return Response.json({ id: 'same-email' }); };
  await deliverProjectBrief(request(), config, send);
  await deliverProjectBrief(request(), config, send);
  assert.equal(keys[0], keys[1]);
});

test('GET requests cannot trigger delivery', async () => {
  const response = await deliverProjectBrief(new Request('https://gh.example/api/project-brief'), config, neverSend);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
});
