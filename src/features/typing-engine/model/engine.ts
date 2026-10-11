import { pickPassage, type Difficulty } from '@/shared/data/passages'
import { formatCountdown, formatElapsed } from '@/shared/lib/format'
import { classifyResult, computeAccuracy, computeWpm } from './stats'
import { TIMED_SECONDS, type CharState, type Mode, type Phase, type ResultKind } from './types'

const PB_STORAGE_KEY = 'tst:personal-best'

const loadPersonalBest = (): number | null => {
  try {
    const raw = localStorage.getItem(PB_STORAGE_KEY)
    if (raw === null) return null
    const value = Number.parseInt(raw, 10)
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

const savePersonalBest = (value: number): void => {
  try {
    localStorage.setItem(PB_STORAGE_KEY, String(value))
  } catch {
    /* storage unavailable (private mode) — keep the session value only */
  }
}

/** Alpine magics this component reaches for; kept local so the data object stays typed. */
type AlpineBindings = {
  $refs: { input?: HTMLInputElement }
  $nextTick: (cb: () => void) => void
}

const refs = (ctx: unknown) => ctx as AlpineBindings

export const createTypingEngine = () => ({
  // --- configuration ---
  difficulty: 'hard' as Difficulty,
  mode: 'timed' as Mode,

  // --- run state ---
  phase: 'idle' as Phase,
  passageId: '',
  chars: [] as string[],
  states: [] as CharState[],
  pos: 0,
  totalTyped: 0,
  correctTyped: 0,
  incorrectTyped: 0,
  elapsed: 0,
  startedAt: 0,

  // --- progress / results ---
  personalBest: null as number | null,
  result: null as ResultKind | null,
  resultWpm: 0,
  resultAccuracy: 0,
  resultCorrect: 0,
  resultIncorrect: 0,

  // --- mobile dropdowns ---
  openDropdown: null as 'difficulty' | 'mode' | null,

  _timer: 0,

  init() {
    this.personalBest = loadPersonalBest()
    this.loadPassage()
    refs(this).$nextTick(() => this.focusInput())
  },

  // ---------- reactive getters ----------
  get secondsLeft(): number {
    return TIMED_SECONDS - this.elapsed
  },
  get timeDisplay(): string {
    return this.mode === 'timed' ? formatCountdown(this.secondsLeft) : formatElapsed(this.elapsed)
  },
  get wpm(): number {
    return computeWpm(this.correctTyped, this.elapsed)
  },
  get accuracy(): number {
    return computeAccuracy(this.correctTyped, this.totalTyped)
  },
  get personalBestDisplay(): string {
    return this.personalBest === null ? '--' : String(this.personalBest)
  },
  get resultTitle(): string {
    if (this.result === 'baseline') return 'Baseline Established!'
    if (this.result === 'record') return 'High Score Smashed!'
    return 'Test Complete!'
  },
  get resultMessage(): string {
    if (this.result === 'baseline') return 'You’ve set the bar. Now the real challenge begins—time to beat it.'
    if (this.result === 'record') return 'You’re getting faster. That was incredible typing.'
    return 'Solid run. Keep pushing to beat your high score.'
  },
  get resultButtonLabel(): string {
    return this.result === 'complete' ? 'Go Again' : 'Beat This Score'
  },
  get isRecord(): boolean {
    return this.result === 'record'
  },

  // ---------- passage lifecycle ----------
  loadPassage() {
    const passage = pickPassage(this.difficulty, this.passageId)
    this.passageId = passage.id
    this.chars = [...passage.text]
    this.resetProgress()
  },
  resetProgress() {
    this.states = this.chars.map((_, i) => (i === 0 ? 'current' : 'pending'))
    this.pos = 0
    this.totalTyped = 0
    this.correctTyped = 0
    this.incorrectTyped = 0
    this.elapsed = 0
    this.stopTimer()
  },
  restart() {
    this.phase = 'idle'
    this.result = null
    this.loadPassage()
  },
  goAgain() {
    this.restart()
    refs(this).$nextTick(() => this.focusInput())
  },

  // ---------- controls ----------
  setDifficulty(value: Difficulty) {
    this.difficulty = value
    this.openDropdown = null
    this.restart()
  },
  setMode(value: Mode) {
    this.mode = value
    this.openDropdown = null
    this.restart()
  },
  toggleDropdown(which: 'difficulty' | 'mode') {
    this.openDropdown = this.openDropdown === which ? null : which
  },
  difficultyLabel(value: Difficulty): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
  get modeLabel(): string {
    return this.mode === 'timed' ? 'Timed (60s)' : 'Passage'
  },

  // ---------- typing ----------
  onBoardClick() {
    if (this.phase === 'finished') return
    if (this.phase === 'idle') {
      this.start()
    } else {
      this.focusInput()
    }
  },
  start() {
    this.ensureStarted()
    this.focusInput()
  },
  ensureStarted() {
    if (this.phase !== 'idle') return
    this.phase = 'running'
    this.elapsed = 0
    this.startedAt = performance.now()
    this.startTimer()
  },
  focusInput() {
    refs(this).$refs.input?.focus()
  },
  onKey(event: KeyboardEvent) {
    if (this.phase === 'finished') return
    if (event.metaKey || event.ctrlKey || event.altKey) return

    const { key } = event
    if (key === 'Backspace') {
      event.preventDefault()
      this.backspace()
      return
    }
    if (key.length !== 1) return

    event.preventDefault()
    this.ensureStarted()
    this.typeChar(key)
  },
  typeChar(char: string) {
    if (this.pos >= this.chars.length) return
    const expected = this.chars[this.pos]
    this.totalTyped += 1
    if (char === expected) {
      this.states[this.pos] = 'correct'
      this.correctTyped += 1
    } else {
      this.states[this.pos] = 'incorrect'
      this.incorrectTyped += 1
    }
    this.pos += 1
    if (this.pos < this.chars.length) {
      this.states[this.pos] = 'current'
    } else {
      this.finish()
    }
  },
  backspace() {
    if (this.pos === 0) return
    if (this.pos < this.chars.length) this.states[this.pos] = 'pending'
    this.pos -= 1
    this.states[this.pos] = 'current'
    // Errors are intentionally NOT un-counted: originals still weigh on accuracy.
  },

  charClass(index: number): string {
    return `char char--${this.states[index]}`
  },

  // ---------- timer ----------
  startTimer() {
    this.stopTimer()
    this._timer = window.setInterval(() => this.tick(), 200)
  },
  stopTimer() {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = 0
    }
  },
  tick() {
    this.elapsed = Math.floor((performance.now() - this.startedAt) / 1000)
    if (this.mode === 'timed' && this.secondsLeft <= 0) {
      this.elapsed = TIMED_SECONDS
      this.finish()
    }
  },

  // ---------- completion ----------
  finish() {
    if (this.phase !== 'running') return
    this.stopTimer()
    const rawElapsed = (performance.now() - this.startedAt) / 1000
    const elapsedSeconds = this.mode === 'timed' ? Math.min(TIMED_SECONDS, rawElapsed) : rawElapsed

    const wpm = computeWpm(this.correctTyped, elapsedSeconds)
    const { kind, personalBest } = classifyResult(wpm, this.personalBest)

    this.resultWpm = wpm
    this.resultAccuracy = this.accuracy
    this.resultCorrect = this.correctTyped
    this.resultIncorrect = this.incorrectTyped
    this.result = kind

    if (kind !== 'complete') {
      this.personalBest = personalBest
      savePersonalBest(personalBest)
    }

    this.phase = 'finished'
  },

  destroy() {
    this.stopTimer()
  },
})

export type TypingEngine = ReturnType<typeof createTypingEngine>
