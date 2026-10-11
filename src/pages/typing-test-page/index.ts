import { createTypingTestPage } from './ui/TypingTestPage'

export const mountTypingTestPage = (root: HTMLElement): void => {
  root.innerHTML = createTypingTestPage()
}
