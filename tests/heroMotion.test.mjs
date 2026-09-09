import assert from "node:assert/strict";
import { test } from "node:test";
import { getHeroMotion, getMobileHeartProgress } from "../src/app/concept/heroMotion.ts";

test("mobile heart rotates gently through its own viewport passage", () => {
  assert.equal(getMobileHeartProgress(800, 400, 800), 0);
  assert.equal(getMobileHeartProgress(200, 400, 800), 0.225);
  assert.equal(getMobileHeartProgress(-400, 400, 800), 0.45);
  for (const viewport of [568, 844, 1024]) {
    let previous = 0;
    for (let top = 1500; top >= -1500; top -= 10) {
      const progress = getMobileHeartProgress(top, 400, viewport);
      assert.ok(progress >= previous && progress <= 0.45);
      previous = progress;
    }
  }
});

test("mobile heart remains still for reduced motion or invalid measurements", () => {
  assert.equal(getMobileHeartProgress(0, 400, 800, true), 0);
  for (const dimensions of [[NaN, 400, 800], [0, 0, 800], [0, 400, 0], [0, Infinity, 800]]) {
    assert.equal(getMobileHeartProgress(...dimensions), 0);
  }
});

test("static mobile text stays visible while desktop chapters retain their transition", () => {
  assert.deepEqual(getHeroMotion(0).panels[0], { opacity: 1, y: -0 });
  assert.equal(getHeroMotion(0).chapter, 0);
  assert.equal(getHeroMotion(1).chapter, 1);
  assert.equal(getHeroMotion(1).panels[1].opacity, 1);
  assert.equal(getHeroMotion(1, true).chapter, 0);
});
