export const PARALLAX_OVERSCAN = 32;

export function getParallaxOffset(top: number, height: number, viewport: number, mobile = false, reduced = false) {
  if (reduced || ![top, height, viewport].every(Number.isFinite) || height <= 0 || viewport <= 0) return 0;
  const progress = Math.max(0, Math.min(1, (viewport - top) / (viewport + height)));
  return (progress * 2 - 1) * (mobile ? 12 : 24);
}
