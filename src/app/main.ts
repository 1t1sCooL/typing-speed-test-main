import Alpine from 'alpinejs'
import { createTypingEngine } from '@/features/typing-engine'
import { mountTypingTestPage } from '@/pages/typing-test-page'
import './styles/global.css'

const root = document.querySelector<HTMLElement>('#app')

if (!root) {
  throw new Error('#app root is missing')
}

mountTypingTestPage(root)

Alpine.data('typingTest', createTypingEngine)
Alpine.start()
