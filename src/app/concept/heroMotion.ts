const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * (3 - 2 * value);

// Use the heart's own viewport passage on mobile, without pinning the page.
// A smaller range limits rotation to about 35 degrees and zoom to 5.4%.
export function getMobileHeartProgress(top: number, height: number, viewport: number, reduced = false) {
  if (reduced || ![top, height, viewport].every(Number.isFinite) || height <= 0 || viewport <= 0) return 0;
  return ease(clamp((viewport - top) / (viewport + height))) * 0.45;
}

// Separate exit/entrance phases prevent two large headlines overlapping.
export function getHeroMotion(progress: number, reduced = false) {
  const position = reduced ? 0 : clamp((progress - 0.3) / 0.32);
  const exit = ease(clamp(position * 2));
  const enter = ease(clamp(position * 2 - 1));
  return {
    chapter: position < 0.5 ? 0 : 1,
    panels: [
      { opacity: 1 - exit, y: -56 * exit },
      { opacity: enter, y: 56 * (1 - enter) },
    ],
  };
}
