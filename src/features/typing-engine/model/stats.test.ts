import { describe, expect, it } from 'vitest'
import { classifyResult, computeAccuracy, computeWpm } from './stats'

describe('computeWpm', () => {
  it('is 0 before any time has elapsed', () => {
    expect(computeWpm(50, 0)).toBe(0)
  })

  it('counts 5 correct chars as one word over the elapsed minutes', () => {
    // 300 correct chars = 60 words in 60s => 60 wpm
    expect(computeWpm(300, 60)).toBe(60)
    // 200 correct chars = 40 words in 30s => 80 wpm
    expect(computeWpm(200, 30)).toBe(80)
  })
})

describe('computeAccuracy', () => {
  it('is 100% before typing starts', () => {
    expect(computeAccuracy(0, 0)).toBe(100)
  })

  it('is based on total keystrokes, so fixed mistakes still count', () => {
    expect(computeAccuracy(120, 125)).toBe(96)
    expect(computeAccuracy(9, 10)).toBe(90)
  })
})

describe('classifyResult', () => {
  it('treats the first run as a baseline and stores it', () => {
    expect(classifyResult(85, null)).toEqual({ kind: 'baseline', personalBest: 85 })
  })

  it('celebrates and stores a new personal best', () => {
    expect(classifyResult(95, 92)).toEqual({ kind: 'record', personalBest: 95 })
  })

  it('keeps the old best on a normal run', () => {
    expect(classifyResult(85, 92)).toEqual({ kind: 'complete', personalBest: 92 })
  })
})
