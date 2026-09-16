import assert from 'node:assert/strict';
import test from 'node:test';
import { getOffersScrollDistances } from './offers-scroll-timing.ts';

test('pixel reveal completes before the section reaches the top without consuming pinned scroll', () => {
  for (const height of [568, 844, 1080]) {
    const timing = getOffersScrollDistances(height, 2000);
    assert.equal(timing.pin, 0);
    assert.ok(timing.reveal > 0);
    assert.ok(Math.abs(timing.approach - timing.reveal - height * 0.2) < 1e-9);
  }
});
