import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceGlobeScroll, getGlobeScrollState } from './globe-controls.ts';

test('scroll starts assembled, expands monotonically, and exits fully transparent', () => {
  const start = getGlobeScrollState(0);
  assert.equal(start.explosion, 0);
  assert.equal(start.scale, 1);
  assert.equal(start.opacity, 1);
  assert.ok(getGlobeScrollState(0.001).explosion > 0);
  assert.ok(getGlobeScrollState(0.001).scale > 1);
  let previous = start;
  for (let step = 1; step <= 100; step++) {
    const state = getGlobeScrollState(step / 100);
    assert.ok(state.explosion >= previous.explosion);
    assert.ok(state.scale >= previous.scale);
    assert.ok(state.opacity <= previous.opacity);
    assert.ok(Number.isFinite(state.rotation));
    previous = state;
  }
  assert.equal(previous.opacity, 0);
  assert.equal(previous.explosion, 1);
});

test('reverse scrolling and direct jumps reassemble exactly without history', () => {
  const forward = Array.from({ length: 101 }, (_, step) => getGlobeScrollState(step / 100));
  for (let step = 100; step >= 0; step--) assert.deepEqual(getGlobeScrollState(step / 100), forward[step]);
  assert.deepEqual(getGlobeScrollState(-1), forward[0]);
  assert.deepEqual(getGlobeScrollState(2), forward[100]);
});

test('scroll interpolation has the same timing at 30, 60, and 120 fps', () => {
  const advance = (fps) => {
    let progress = 0;
    for (let frame = 0; frame < fps / 2; frame++) progress = advanceGlobeScroll(progress, 1, 1 / fps);
    return progress;
  };
  for (const fps of [30, 120]) assert.ok(Math.abs(advance(fps) - advance(60)) < 1e-10);
});

test('scroll interpolation responds immediately, reverses without overshoot, and settles', () => {
  let progress = advanceGlobeScroll(0, 0.1, 1 / 60);
  assert.ok(progress > 0 && progress < 0.1);
  const reverse = advanceGlobeScroll(progress, 0, 1 / 60);
  assert.ok(reverse >= 0 && reverse < progress);
  for (let frame = 0; frame < 120; frame++) progress = advanceGlobeScroll(progress, 1, 1 / 60);
  assert.equal(progress, 1);
  assert.equal(advanceGlobeScroll(0.5, 1, 0), 0.5);
});
