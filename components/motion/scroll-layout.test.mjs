import assert from 'node:assert/strict';
import test from 'node:test';
import { viewportNeedsRefresh } from './scroll-layout.ts';

test('mobile toolbar collapse and return do not refresh scroll pins', () => {
  const original = { width: 390, height: 740 };
  for (const height of [760, 800, 844, 810, 760, 740]) {
    assert.equal(viewportNeedsRefresh(original, { width: 390, height }, true), false);
  }
});

test('orientation and split-screen width changes remeasure the layout', () => {
  const original = { width: 390, height: 844 };
  assert.equal(viewportNeedsRefresh(original, { width: 844, height: 390 }, true), true);
  assert.equal(viewportNeedsRefresh(original, { width: 320, height: 844 }, true), true);
});

test('large mobile height changes and desktop window resizes still refresh', () => {
  const original = { width: 390, height: 844 };
  assert.equal(viewportNeedsRefresh(original, { width: 390, height: 500 }, true), true);
  assert.equal(viewportNeedsRefresh(original, { width: 390, height: 800 }, false), true);
  assert.equal(viewportNeedsRefresh(original, original, false), false);
});
