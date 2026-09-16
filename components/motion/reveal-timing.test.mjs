import assert from 'node:assert/strict';
import test from 'node:test';
import { revealObserverOptions, REVEAL_START, REVEAL_END } from './reveal-timing.ts';

test('titles and cards begin one-third up from the bottom on all viewport sizes', () => {
  assert.ok(Math.abs(parseFloat(REVEAL_START.slice(4)) - 200 / 3) < 1e-9);
  assert.ok(Math.abs(parseFloat(REVEAL_END.slice(4)) - 100 / 3) < 1e-9);
  for (const height of [390, 568, 844, 1080]) {
    const options = revealObserverOptions(height);
    const bottomMargin = parseFloat(options.rootMargin.split(' ')[2]);
    assert.equal(options.threshold, 0);
    assert.ok(Math.abs(bottomMargin + height / 3) < 1e-9);
  }
});
