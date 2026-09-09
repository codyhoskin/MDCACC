import test from "node:test";
import assert from "node:assert/strict";
import { setupScrollReveals } from "../src/components/ScrollMotion/reveal.ts";

function harness(t, { reduced = false, width = 1200, supported = true } = {}) {
  const events = () => ({ listeners: new Map(), addEventListener(k, v) { this.listeners.set(k, v); }, removeEventListener(k) { this.listeners.delete(k); } });
  class FakeNode {}
  class FakeElement extends FakeNode {
    constructor(top, data = {}) { super(); this.top = top; this.dataset = data; this.calls = []; }
    getBoundingClientRect() { return { top: this.top }; }
    contains(node) { return node === this; }
    animate(frames, options) { const animation = { cancelled: false, cancel() { this.cancelled = true; } }; this.calls.push({ frames, options, animation }); return animation; }
  }
  const observers = [];
  class FakeObserver {
    constructor(callback) { this.callback = callback; this.observed = new Set(); observers.push(this); }
    observe(element) { this.observed.add(element); }
    unobserve(element) { this.observed.delete(element); }
    disconnect() { this.observed.clear(); }
    enter(element) { if (this.observed.has(element)) this.callback([{ target: element, isIntersecting: true }]); }
  }
  const preference = { ...events(), matches: reduced };
  const win = { ...events(), innerWidth: width, innerHeight: 800, matchMedia: () => preference, IntersectionObserver: supported ? FakeObserver : undefined };
  for (const [key, value] of Object.entries({ window: win, document: { activeElement: null }, Element: FakeElement, Node: FakeNode, IntersectionObserver: FakeObserver })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
    t.after(() => { if (original) Object.defineProperty(globalThis, key, original); else delete globalThis[key]; });
  }
  const elements = [];
  const root = { ...events(), querySelectorAll: () => elements };
  return { root, preference, win, observers, add(top, data) { const element = new FakeElement(top, data); elements.push(element); return element; } };
}

test("reveals below-fold content once, without replaying visible content", (t) => {
  const h = harness(t);
  const visible = h.add(100);
  const below = h.add(1000, { revealDelay: "225" });
  const cleanup = setupScrollReveals(h.root);
  const observer = h.observers[0];
  assert.equal(observer.observed.has(visible), false);
  observer.enter(below);
  observer.enter(below);
  assert.equal(below.calls.length, 1);
  assert.equal(below.calls[0].options.delay, 225);
  assert.equal(below.calls[0].frames[0].translate, "0 28px");
  assert.equal(below.calls[0].options.fill, "backwards");
  cleanup();
  assert.equal(below.calls[0].animation.cancelled, true);
  assert.equal(h.root.listeners.size + h.win.listeners.size + h.preference.listeners.size, 0);
});

test("mobile movement and stagger are shorter; portrait zoom is bounded", (t) => {
  const h = harness(t, { width: 390 });
  const photo = h.add(1000, { reveal: "photo", revealDelay: "900" });
  const cleanup = setupScrollReveals(h.root);
  h.observers[0].enter(photo);
  assert.equal(photo.calls[0].options.delay, 100);
  assert.equal(photo.calls[0].options.duration, 500);
  assert.deepEqual(photo.calls[0].frames, [{ opacity: 0, translate: "0 14px", scale: .97 }, { opacity: 1, translate: "0 0", scale: 1 }]);
  cleanup();
});

test("keyboard focus cancels the entrance and bypasses pending reveals", (t) => {
  const h = harness(t);
  const active = h.add(1000);
  const pending = h.add(2000);
  const cleanup = setupScrollReveals(h.root);
  h.observers[0].enter(active);
  h.root.listeners.get("focusin")({ target: active });
  h.root.listeners.get("focusin")({ target: pending });
  assert.equal(active.calls[0].animation.cancelled, true);
  assert.equal(h.observers[0].observed.has(pending), false);
  cleanup();
});

test("a live reduced-motion change cancels motion and reveals everything", (t) => {
  const h = harness(t);
  const active = h.add(1000);
  h.add(2000);
  const cleanup = setupScrollReveals(h.root);
  h.observers[0].enter(active);
  h.preference.matches = true;
  h.preference.listeners.get("change")();
  assert.equal(active.calls[0].animation.cancelled, true);
  assert.equal(h.observers[0].observed.size, 0);
  cleanup();
});

for (const options of [{ reduced: true }, { supported: false }]) {
  test(`content is unchanged when motion is unavailable: ${JSON.stringify(options)}`, (t) => {
    const h = harness(t, options);
    const element = h.add(1000);
    setupScrollReveals(h.root)();
    assert.equal(h.observers.length, 0);
    assert.equal(element.calls.length, 0);
  });
}

test("printing clears active and pending animation", (t) => {
  const h = harness(t);
  const element = h.add(1000);
  const cleanup = setupScrollReveals(h.root);
  h.observers[0].enter(element);
  h.win.listeners.get("beforeprint")();
  assert.equal(element.calls[0].animation.cancelled, true);
  cleanup();
});
