import type { ResultKind } from './types'

/**
 * Net words-per-minute: correctly typed characters / 5 over elapsed minutes.
 * Returns 0 until some time has actually passed so the readout starts at 0.
 */
export const computeWpm = (correctChars: number, elapsedSeconds: number): number => {
  if (elapsedSeconds <= 0) return 0
  return Math.round(correctChars / 5 / (elapsedSeconds / 60))
}

/**
 * Accuracy over every keystroke made. Characters later fixed with backspace
 * still leave their original error in the denominator, so mistakes always count.
 */
export const computeAccuracy = (correctTyped: number, totalTyped: number): number => {
  if (totalTyped <= 0) return 100
  return Math.round((correctTyped / totalTyped) * 100)
}

/** Decide which celebration/result copy to show and whether a new PB was set. */
export const classifyResult = (
  wpm: number,
  previousBest: number | null,
): { kind: ResultKind; personalBest: number } => {
  if (previousBest === null) return { kind: 'baseline', personalBest: wpm }
  if (wpm > previousBest) return { kind: 'record', personalBest: wpm }
  return { kind: 'complete', personalBest: previousBest }
}
