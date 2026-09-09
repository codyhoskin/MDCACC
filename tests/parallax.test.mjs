import assert from "node:assert/strict";
import { test } from "node:test";
import { getParallaxOffset, PARALLAX_OVERSCAN } from "../src/components/ParallaxBackground/parallax.ts";

test("parallax centers in the viewport and moves gently with scroll", () => {
  assert.equal(getParallaxOffset(800, 600, 800), -24);
  assert.equal(getParallaxOffset(100, 600, 800), 0);
  assert.equal(getParallaxOffset(-600, 600, 800), 24);
  assert.equal(getParallaxOffset(800, 600, 800, true), -12);
  assert.equal(getParallaxOffset(-600, 600, 800, true), 12);
});

test("motion stays inside the image overscan at every scroll position", () => {
  for (const height of [200, 600, 1600]) {
    for (const viewport of [320, 800, 1200]) {
      let previous = -Infinity;
      for (let top = 3000; top >= -3000; top -= 10) {
        const offset = getParallaxOffset(top, height, viewport);
        assert.ok(Math.abs(offset) < PARALLAX_OVERSCAN);
        assert.ok(offset >= previous);
        previous = offset;
      }
    }
  }
});

test("reduced motion and invalid dimensions remain static", () => {
  assert.equal(getParallaxOffset(-400, 600, 800, false, true), 0);
  assert.equal(getParallaxOffset(0, 0, 800), 0);
  assert.equal(getParallaxOffset(0, 600, 0), 0);
  assert.equal(getParallaxOffset(NaN, 600, 800), 0);
  assert.equal(getParallaxOffset(Infinity, 600, 800), 0);
});
