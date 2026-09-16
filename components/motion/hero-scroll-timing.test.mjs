import assert from 'node:assert/strict';
import test from 'node:test';
import { getHeroLineScrollMotion } from './hero-scroll-timing.ts';

test('hero lines float up and drift slightly toward the centre', () => {
  const first = getHeroLineScrollMotion(0, 480);
  const second = getHeroLineScrollMotion(1, 480);
  assert.equal(first.y, -190);
  assert.equal(second.y, -145);
  assert.ok(first.x < 0 && second.x < 0);
  assert.ok(Math.abs(first.y) > Math.abs(first.x) * 4);
  assert.ok(Math.abs(second.y) > Math.abs(second.x) * 2);
  assert.ok(Math.abs(first.x) < 50);
  assert.ok(Math.abs(second.x) < 50);
});

test('the shorter second line drifts a little farther inward', () => {
  const first = getHeroLineScrollMotion(0, 430);
  const second = getHeroLineScrollMotion(1, 430);
  assert.ok(second.x < first.x);
});

test('inward travel scales with the hero column', () => {
  const narrow = getHeroLineScrollMotion(0, 320);
  const wide = getHeroLineScrollMotion(0, 480);
  assert.ok(wide.x < narrow.x);
  assert.equal(narrow.y, wide.y);
});
