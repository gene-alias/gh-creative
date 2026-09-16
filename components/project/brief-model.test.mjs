import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyBrief, formatBrief, validateBriefStep } from './brief-model.ts';

const finished = () => ({
  ...emptyBrief(), name: ' Alex Example ', email: 'alex@example.com',
  services: ['Web design', 'Marketing'], project: 'A new website for our studio.\nReference: example.com',
  budget: 'Let’s work it out', timing: 'I’m flexible',
});

test('required questions reject empty or whitespace-only answers', () => {
  const brief = { ...emptyBrief(), name: '   ', project: ' '.repeat(30) };
  for (const step of [0, 1, 3, 4, 5, 6]) assert.ok(validateBriefStep(step, brief));
});

test('contact step rejects malformed addresses', () => {
  for (const email of ['alex', 'alex@', 'alex@example', 'alex @example.com']) {
    assert.ok(validateBriefStep(1, { ...finished(), email }));
  }
});

test('a complete brief can progress without optional contact or business fields', () => {
  for (let step = 0; step < 8; step++) assert.equal(validateBriefStep(step, finished()), null);
});

test('download includes every supplied detail and preserves the multiline brief', () => {
  const brief = { ...finished(), phone: '+61 400 000 000', company: 'Example Studio', website: 'example.com' };
  const output = formatBrief(brief);
  for (const value of Object.values(brief).flat()) assert.ok(output.includes(value.trim()));
  assert.ok(output.includes('Budget (AUD):'));
  assert.ok(!output.includes('has not been sent'));
});

test('optional fields are marked as omitted without losing the required details', () => {
  const output = formatBrief(finished());
  assert.ok(output.includes('Phone: Not provided'));
  assert.ok(output.includes('Company: Not provided'));
  assert.ok(output.includes('Website: Not provided'));
});
