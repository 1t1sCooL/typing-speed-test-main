import { createAppHeader } from '@/widgets/app-header/ui/AppHeader'
import { createTypingBoard } from '@/widgets/typing-board/ui/TypingBoard'
import { createResultsScreen } from '@/widgets/results-screen/ui/ResultsScreen'
import { createSiteFooter } from '@/widgets/site-footer/ui/SiteFooter'
import './TypingTestPage.css'

export const createTypingTestPage = (): string => `
  <div class="app" x-data="typingTest" x-cloak>
    ${createAppHeader()}
    <main class="app__inner">
      <input
        class="sr-input"
        x-ref="input"
        type="text"
        inputmode="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        aria-label="Type the passage here to run the test"
        tabindex="-1"
        @keydown="onKey($event)"
      />
      ${createTypingBoard()}
      ${createResultsScreen()}
    </main>
    ${createSiteFooter()}
  </div>
`
