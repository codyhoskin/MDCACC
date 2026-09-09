/** Progressive enhancement: content stays visible if animation APIs are unavailable. */
export function setupScrollReveals(root: HTMLElement) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches || !window.IntersectionObserver || !Element.prototype.animate) return () => {};
  const animations = new Map<HTMLElement, Animation>();
  const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target as HTMLElement;
      observer.unobserve(element);
      if (preference.matches || element.contains(document.activeElement)) continue;
      const mobile = window.innerWidth <= 760;
      const requestedDelay = Number(element.dataset.revealDelay ?? 0);
      const delay = Number.isFinite(requestedDelay) ? Math.max(0, Math.min(mobile ? 100 : 240, requestedDelay)) : 0;
      const from: Keyframe = { opacity: 0, translate: `0 ${mobile ? 14 : 28}px` };
      const to: Keyframe = { opacity: 1, translate: "0 0" };
      if (element.dataset.reveal === "photo") { from.scale = .97; to.scale = 1; }
      const animation = element.animate([from, to], { duration: mobile ? 500 : 760, delay, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" });
      animations.set(element, animation);
      animation.onfinish = () => { if (animations.get(element) === animation) animations.delete(element); };
    }
  }, { threshold: 0 });
  // Don't replay entrances on already-visible content or restored scroll positions.
  for (const element of elements) {
    if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
  }
  const revealAll = () => {
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  };
  const onPreference = () => { if (preference.matches) revealAll(); };
  const onFocus = (event: FocusEvent) => {
    for (const element of elements) {
      if (event.target instanceof Node && element.contains(event.target)) {
        observer.unobserve(element);
        animations.get(element)?.cancel();
        animations.delete(element);
      }
    }
  };
  preference.addEventListener("change", onPreference);
  root.addEventListener("focusin", onFocus);
  window.addEventListener("beforeprint", revealAll);
  return () => {
    revealAll();
    preference.removeEventListener("change", onPreference);
    root.removeEventListener("focusin", onFocus);
    window.removeEventListener("beforeprint", revealAll);
  };
}
