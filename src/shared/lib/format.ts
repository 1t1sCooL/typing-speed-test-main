/**
 * Timed mode shows the raw countdown as `0:SS` (so the start reads `0:60`,
 * matching the design rather than rolling over to `1:00`). Passage mode counts
 * up with a conventional `M:SS` clock.
 */
export const formatCountdown = (secondsLeft: number): string => {
  const s = Math.max(0, Math.ceil(secondsLeft))
  return `0:${String(s).padStart(2, '0')}`
}

export const formatElapsed = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
