import { beforeEach, describe, expect, it } from 'vitest'
import { createTypingEngine } from './engine'

type Engine = ReturnType<typeof createTypingEngine> & {
  $nextTick: (cb: () => void) => void
  $refs: { input: { focus: () => void } }
}

const makeEngine = (): Engine => {
  const engine = createTypingEngine() as Engine
  engine.$nextTick = (cb) => cb()
  engine.$refs = { input: { focus: () => {} } }
  engine.init()
  return engine
}

const typeAll = (engine: Engine, text: string) => {
  engine.ensureStarted()
  for (const ch of text) engine.typeChar(ch)
}

beforeEach(() => {
  localStorage.clear()
})

describe('typing engine', () => {
  it('starts idle with a loaded passage and the cursor on the first character', () => {
    const engine = makeEngine()
    expect(engine.phase).toBe('idle')
    expect(engine.difficulty).toBe('hard')
    expect(engine.chars.length).toBeGreaterThan(0)
    expect(engine.states[0]).toBe('current')
    expect(engine.states[1]).toBe('pending')
  })

  it('marks correct and incorrect characters and advances the cursor', () => {
    const engine = makeEngine()
    const expected = engine.chars[0]
    const wrong = expected === 'x' ? 'y' : 'x'

    engine.ensureStarted()
    engine.typeChar(expected)
    engine.typeChar(wrong)

    expect(engine.states[0]).toBe('correct')
    expect(engine.states[1]).toBe('incorrect')
    expect(engine.states[2]).toBe('current')
    expect(engine.correctTyped).toBe(1)
    expect(engine.incorrectTyped).toBe(1)
    expect(engine.accuracy).toBe(50)
  })

  it('keeps original mistakes counted against accuracy after a backspace fix', () => {
    const engine = makeEngine()
    const wrong = engine.chars[0] === 'x' ? 'y' : 'x'

    engine.ensureStarted()
    engine.typeChar(wrong) // mistake
    engine.backspace() // correct it
    engine.typeChar(engine.chars[0]) // retype correctly

    expect(engine.pos).toBe(1)
    expect(engine.incorrectTyped).toBe(1) // the original error still stands
    expect(engine.correctTyped).toBe(1)
    expect(engine.totalTyped).toBe(2)
    expect(engine.accuracy).toBe(50)
  })

  it('finishes with a baseline result on the first full passage and stores the personal best', () => {
    const engine = makeEngine()
    const text = engine.chars.join('')

    typeAll(engine, text)

    expect(engine.phase).toBe('finished')
    expect(engine.result).toBe('baseline')
    expect(engine.resultAccuracy).toBe(100)
    expect(engine.personalBest).toBe(engine.resultWpm)
    expect(localStorage.getItem('tst:personal-best')).toBe(String(engine.resultWpm))
  })

  it('loads a fresh passage and returns to idle on restart', () => {
    const engine = makeEngine()
    engine.ensureStarted()
    engine.typeChar(engine.chars[0])
    engine.restart()

    expect(engine.phase).toBe('idle')
    expect(engine.pos).toBe(0)
    expect(engine.correctTyped).toBe(0)
    expect(engine.states[0]).toBe('current')
  })
})
