import { beforeEach } from 'vitest'

// A reused browser page can leave focus in a previous test iframe. Start
// each story in its own document before it mounts; its autofocus and Tab
// order then work as they do when the story is opened on its own.
beforeEach(() => {
  window.focus()
  const body = document.body
  const previousTabIndex = body.getAttribute('tabindex')
  body.setAttribute('tabindex', '-1')
  body.focus({ preventScroll: true })
  if (previousTabIndex === null) body.removeAttribute('tabindex')
  else body.setAttribute('tabindex', previousTabIndex)
})
