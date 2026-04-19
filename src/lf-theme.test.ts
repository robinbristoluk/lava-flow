import { describe, expect, it } from 'vitest'

import { LfTheme } from './components/lf-theme'

describe('lf-theme', () => {
  it('renders the theme container part', async () => {
    const element = new LfTheme()
    document.body.append(element)
    await element.updateComplete

    const container = element.shadowRoot?.querySelector('[part="container"]')

    expect(container).not.toBeNull()

    element.remove()
  })

  it('maps component properties to CSS custom properties', async () => {
    const element = new LfTheme()
    element.primaryBg = '#123456'
    document.body.append(element)
    await element.updateComplete

    const container = element.shadowRoot?.querySelector('[part="container"]')
    const style = container?.getAttribute('style') ?? ''

    expect(style).toContain('--lf-primary-bg:#123456')

    element.remove()
  })
})
