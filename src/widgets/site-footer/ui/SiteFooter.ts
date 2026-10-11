import './SiteFooter.css'

export const createSiteFooter = (): string => `
  <footer class="site-footer">
    <p class="site-footer__credit">
      Challenge by
      <a href="https://www.frontendmentor.io?ref=challenge" target="_blank" rel="noopener noreferrer">Frontend Mentor</a>.
      Coded by <a href="https://mmalabugin.ru/" target="_blank" rel="noopener noreferrer">1t1sCooL</a>.
    </p>
    <nav class="site-footer__links" aria-label="Author links">
      <a href="https://mmalabugin.ru/" target="_blank" rel="noopener noreferrer">Website</a>
      <a href="https://www.frontendmentor.io/profile/1t1sCooL" target="_blank" rel="noopener noreferrer">Frontend Mentor</a>
      <a href="https://www.twitter.com/vi_el_mar" target="_blank" rel="noopener noreferrer">Twitter</a>
      <a href="https://t.me/ItIsCooL" target="_blank" rel="noopener noreferrer">Telegram</a>
    </nav>
  </footer>
`
