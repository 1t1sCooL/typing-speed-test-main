export type Mode = 'timed' | 'passage'

export type Phase = 'idle' | 'running' | 'finished'

/** `baseline` = first ever test, `record` = beat the stored PB, `complete` = normal run. */
export type ResultKind = 'baseline' | 'record' | 'complete'

export type CharState = 'pending' | 'current' | 'correct' | 'incorrect'

export const TIMED_SECONDS = 60
