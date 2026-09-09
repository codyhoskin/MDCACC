const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * (3 - 2 * value);

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
