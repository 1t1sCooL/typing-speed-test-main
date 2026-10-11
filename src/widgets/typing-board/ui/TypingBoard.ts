import { assets } from '@/shared/config/assets'
import './TypingBoard.css'

const difficultyPill = (value: 'easy' | 'medium' | 'hard', label: string): string => `
  <button
    type="button"
    class="pill"
    :class="{ 'pill--active': difficulty === '${value}' }"
    @click="setDifficulty('${value}')"
  >${label}</button>
`

const modePill = (value: 'timed' | 'passage', label: string): string => `
  <button
    type="button"
    class="pill"
    :class="{ 'pill--active': mode === '${value}' }"
    @click="setMode('${value}')"
  >${label}</button>
`

const difficultyOption = (value: 'easy' | 'medium' | 'hard', label: string): string => `
  <li>
    <button type="button" class="dropdown__option" :class="{ 'dropdown__option--active': difficulty === '${value}' }" @click="setDifficulty('${value}')">
      <span class="dropdown__radio" aria-hidden="true"></span>
      <span>${label}</span>
    </button>
  </li>
`

const modeOption = (value: 'timed' | 'passage', label: string): string => `
  <li>
    <button type="button" class="dropdown__option" :class="{ 'dropdown__option--active': mode === '${value}' }" @click="setMode('${value}')">
      <span class="dropdown__radio" aria-hidden="true"></span>
      <span>${label}</span>
    </button>
  </li>
`

export const createTypingBoard = (): string => `
  <section class="board" aria-label="Typing test" x-show="phase !== 'finished'">
    <div class="statusbar">
      <dl class="stats">
        <div class="stat">
          <dt class="stat__label">WPM:</dt>
          <dd class="stat__value" x-text="wpm">0</dd>
        </div>
        <span class="stat__sep" aria-hidden="true"></span>
        <div class="stat">
          <dt class="stat__label">Accuracy:</dt>
          <dd class="stat__value" :class="{ 'stat__value--error': accuracy < 100 }" x-text="accuracy + '%'">100%</dd>
        </div>
        <span class="stat__sep" aria-hidden="true"></span>
        <div class="stat">
          <dt class="stat__label">Time:</dt>
          <dd class="stat__value" :class="{ 'stat__value--timing': phase === 'running' }" x-text="timeDisplay">0:60</dd>
        </div>
      </dl>

      <div class="controls">
        <div class="control">
          <span class="control__label">Difficulty:</span>
          <div class="pillset" role="group" aria-label="Difficulty">
            ${difficultyPill('easy', 'Easy')}
            ${difficultyPill('medium', 'Medium')}
            ${difficultyPill('hard', 'Hard')}
          </div>
          <div class="dropdown" @click.outside="openDropdown === 'difficulty' && (openDropdown = null)">
            <button type="button" class="dropdown__toggle" :aria-expanded="openDropdown === 'difficulty'" @click="toggleDropdown('difficulty')">
              <span x-text="difficultyLabel(difficulty)">Hard</span>
              <img src="${assets.iconDownArrow}" alt="" width="11" height="6" />
            </button>
            <ul class="dropdown__menu" x-show="openDropdown === 'difficulty'" x-transition.opacity x-cloak>
              ${difficultyOption('easy', 'Easy')}
              ${difficultyOption('medium', 'Medium')}
              ${difficultyOption('hard', 'Hard')}
            </ul>
          </div>
        </div>

        <span class="control__sep" aria-hidden="true"></span>

        <div class="control">
          <span class="control__label">Mode:</span>
          <div class="pillset" role="group" aria-label="Mode">
            ${modePill('timed', 'Timed (60s)')}
            ${modePill('passage', 'Passage')}
          </div>
          <div class="dropdown" @click.outside="openDropdown === 'mode' && (openDropdown = null)">
            <button type="button" class="dropdown__toggle" :aria-expanded="openDropdown === 'mode'" @click="toggleDropdown('mode')">
              <span x-text="modeLabel">Timed (60s)</span>
              <img src="${assets.iconDownArrow}" alt="" width="11" height="6" />
            </button>
            <ul class="dropdown__menu" x-show="openDropdown === 'mode'" x-transition.opacity x-cloak>
              ${modeOption('timed', 'Timed (60s)')}
              ${modeOption('passage', 'Passage')}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="passage-area">
      <p
        class="passage"
        :class="{ 'passage--idle': phase === 'idle' }"
        @click="onBoardClick()"
      ><template x-for="(ch, i) in chars" :key="i"><span :class="charClass(i)" x-text="ch"></span></template></p>

      <div class="start-overlay" x-show="phase === 'idle'">
        <button type="button" class="btn btn--primary" @click="start()">Start Typing Test</button>
        <p class="start-hint">Or click the text and start typing</p>
      </div>
    </div>

    <div class="board__footer" x-show="phase === 'running'" x-cloak>
      <hr class="divider" />
      <button type="button" class="btn btn--dark" @click="restart(); focusInput()">
        Restart Test
        <img src="${assets.iconRestart}" alt="" width="18" height="18" />
      </button>
    </div>
  </section>
`
