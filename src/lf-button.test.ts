import { describe, expect, it, vi } from 'vitest'

import { LfButton } from './components/lf-button'

describe('lf-button', () => {
  it('renders a button with accessible attributes', async () => {
    const element = new LfButton()
    element.label = 'Save changes'
    document.body.append(element)
    await element.updateComplete

    const button = element.shadowRoot?.querySelector('button')

    expect(button).not.toBeNull()
    expect(button?.getAttribute('aria-label')).toBe('Save changes')
    expect(button?.getAttribute('aria-busy')).toBe('false')
    expect(button?.disabled).toBe(false)

    element.remove()
  })

  it('emits lf-press when activated', async () => {
    const element = new LfButton()
    document.body.append(element)
    await element.updateComplete

    const onPress = vi.fn()
    element.addEventListener('lf-press', onPress)

    const button = element.shadowRoot?.querySelector('button')
    button?.click()

    expect(onPress).toHaveBeenCalledTimes(1)

    element.remove()
  })

  it('does not emit lf-press when disabled', async () => {
    const element = new LfButton()
    element.disabled = true
    document.body.append(element)
    await element.updateComplete

    const onPress = vi.fn()
    element.addEventListener('lf-press', onPress)

    const button = element.shadowRoot?.querySelector('button')
    button?.click()

    expect(onPress).not.toHaveBeenCalled()

    element.remove()
  })
})
