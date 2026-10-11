import { assets } from '@/shared/config/assets'
import './AppHeader.css'

export const createAppHeader = (): string => `
  <header class="masthead">
    <div class="masthead__brand">
      <span class="masthead__mark">
        <img src="${assets.logoSmall}" alt="" width="24" height="24" />
      </span>
      <span class="masthead__titles">
        <span class="masthead__title">Typing Speed Test</span>
        <span class="masthead__subtitle">Type as fast as you can in 60 seconds</span>
      </span>
    </div>
    <p class="masthead__pb">
      <img src="${assets.iconPersonalBest}" alt="" width="21" height="18" />
      <span class="masthead__pb-label masthead__pb-label--full">Personal best:</span>
      <span class="masthead__pb-label masthead__pb-label--short">Best:</span>
      <span class="masthead__pb-value"><strong x-text="personalBestDisplay">--</strong> WPM</span>
    </p>
  </header>
`
