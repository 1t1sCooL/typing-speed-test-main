import { assets } from '@/shared/config/assets'
import './ResultsScreen.css'

export const createResultsScreen = (): string => `
  <section class="results" x-show="phase === 'finished'" x-cloak aria-live="polite" aria-label="Test results">
    <div class="results__decor" x-show="!isRecord" aria-hidden="true">
      <img class="results__star results__star--1" src="${assets.starRed}" alt="" width="32" height="32" />
      <img class="results__star results__star--2" src="${assets.starYellow}" alt="" width="74" height="74" />
    </div>

    <div class="results__inner">
      <div class="results__badge">
        <img class="results__icon" x-show="!isRecord" src="${assets.iconCompleted}" alt="" width="64" height="64" />
        <img class="results__icon results__icon--pb" x-show="isRecord" src="${assets.iconNewPb}" alt="" width="80" height="80" x-cloak />
      </div>

      <h2 class="results__title" x-text="resultTitle">Test Complete!</h2>
      <p class="results__message" x-text="resultMessage"></p>

      <div class="result-cards">
        <div class="result-card">
          <span class="result-card__label">WPM:</span>
          <span class="result-card__value" x-text="resultWpm">0</span>
        </div>
        <div class="result-card">
          <span class="result-card__label">Accuracy:</span>
          <span
            class="result-card__value"
            :class="{ 'result-card__value--good': resultAccuracy >= 100, 'result-card__value--error': resultAccuracy < 100 }"
            x-text="resultAccuracy + '%'"
          >0%</span>
        </div>
        <div class="result-card">
          <span class="result-card__label">Characters</span>
          <span class="result-card__value">
            <span class="chars chars--correct" x-text="resultCorrect">0</span><span class="chars chars--sep">/</span><span class="chars chars--incorrect" x-text="resultIncorrect">0</span>
          </span>
        </div>
      </div>

      <button type="button" class="btn btn--light" @click="goAgain()">
        <span x-text="resultButtonLabel">Go Again</span>
        <img src="${assets.iconRestart}" alt="" width="18" height="18" />
      </button>
    </div>

    <img class="results__confetti" x-show="isRecord" src="${assets.patternConfetti}" alt="" aria-hidden="true" x-cloak />
  </section>
`
