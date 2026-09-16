import assert from 'node:assert/strict';
import test from 'node:test';
import { getHeadingLineState } from './heading-scroll-timing.ts';

test('titles start one-third up from the bottom and finish at the upper third', () => {
  assert.deepEqual(getHeadingLineState(200, 800, 1000), { yPercent: 105, opacity: 0 });
  assert.deepEqual(getHeadingLineState(400, 900, 1000), { yPercent: 105, opacity: 0 });
  const entering = getHeadingLineState(550, 900, 1000);
  assert.ok(Math.abs(entering.opacity - 0.5) < 1e-9);
  assert.ok(Math.abs(entering.yPercent - 52.5) < 1e-9);
  assert.deepEqual(getHeadingLineState(700, 900, 1000), { yPercent: 0, opacity: 1 });
  assert.equal(getHeadingLineState(200, 800, 1100).opacity, 0);
});

test('a long showcase pin holds the complete title until content finishes', () => {
  const pin = { start: 1000, end: 2920 };
  for (const scroll of [1000, 1100, 1800, 2800, 2920, 2960]) {
    assert.deepEqual(getHeadingLineState(scroll, 800, 1120, pin), { yPercent: 0, opacity: 1 });
  }
  assert.deepEqual(getHeadingLineState(3000, 800, 1120, pin), { yPercent: -52.5, opacity: 0.5 });
  assert.deepEqual(getHeadingLineState(3040, 800, 1120, pin), { yPercent: -105, opacity: 0 });
});

test('pin creation and resizing do not change an already-visible heading during the hold', () => {
  for (const viewport of [568, 844, 1080]) {
    const pin = { start: 2000, end: 2000 + viewport * 0.45 };
    assert.deepEqual(getHeadingLineState(2000, viewport, 2120, pin), { yPercent: 0, opacity: 1 });
    assert.deepEqual(getHeadingLineState(pin.end, viewport, 2120, pin), { yPercent: 0, opacity: 1 });
  }
});

test('scrolling up reveals an unpinned title inside the top of the viewport', () => {
  assert.deepEqual(getHeadingLineState(1000, 800, 1000), { yPercent: -105, opacity: 0 });
  const enteringBack = getHeadingLineState(550, 900, 1000);
  assert.ok(Math.abs(enteringBack.opacity - 0.5) < 1e-9);
  assert.ok(Math.abs(enteringBack.yPercent - 52.5) < 1e-9);
  assert.deepEqual(getHeadingLineState(700, 900, 1000), { yPercent: 0, opacity: 1 });
});

test('titles stay fully readable through the upper viewport before exiting', () => {
  for (const viewport of [568, 844, 1080]) {
    for (const fraction of [0.28, 0.2, 0.12]) {
      assert.deepEqual(getHeadingLineState(1000 - viewport * fraction, viewport, 1000),
        { yPercent: 0, opacity: 1 });
    }
  }
});

test('reverse scrolling and direct jumps give the same state without tween history', () => {
  const pin = { start: 1000, end: 2920 };
  const positions = [0, 400, 900, 1500, 3130, 3300];
  const forward = positions.map((scroll) => getHeadingLineState(scroll, 800, 1120, pin));
  const backward = [...positions].reverse().map((scroll) => getHeadingLineState(scroll, 800, 1120, pin));
  assert.deepEqual(backward.reverse(), forward);
});
