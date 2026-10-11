import raw from './passages.json'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Passage = {
  id: string
  text: string
}

export const passages = raw as Record<Difficulty, Passage[]>

/** Pick a random passage of the given difficulty, optionally avoiding a previous id. */
export const pickPassage = (difficulty: Difficulty, excludeId?: string): Passage => {
  const pool = passages[difficulty]
  if (pool.length === 1 || !excludeId) {
    return pool[Math.floor(Math.random() * pool.length)]
  }
  const candidates = pool.filter((p) => p.id !== excludeId)
  return candidates[Math.floor(Math.random() * candidates.length)]
}
