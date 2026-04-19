import { describe, expect, it, vi } from 'vitest'
import { LfSelect } from './components/lf-select'

const OPTS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]

async function makeSelect(setup?: (el: LfSelect) => void) {
  const el = new LfSelect()
  el.options = OPTS
  setup?.(el)
  document.body.append(el)
  await el.updateComplete
  return el
}

// ─── Rendering ─────────────────────────────────────────────────────────────────

describe('lf-select rendering', () => {
  it('renders a trigger button and a listbox', async () => {
    const el = await makeSelect()

    const trigger = el.shadowRoot?.querySelector('[role="combobox"]')
    const listbox = el.shadowRoot?.querySelector('[role="listbox"]')

    expect(trigger).not.toBeNull()
    expect(listbox).not.toBeNull()

    el.remove()
  })

  it('listbox is hidden initially (aria-expanded=false)', async () => {
    const el = await makeSelect()

    const trigger = el.shadowRoot?.querySelector('[role="combobox"]')
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')

    el.remove()
  })

  it('renders options inside the listbox', async () => {
    const el = await makeSelect()

    const options = el.shadowRoot?.querySelectorAll('[role="option"]')
    expect(options?.length).toBe(3)

    el.remove()
  })

  it('forwards field-id to the trigger button', async () => {
    const el = await makeSelect((e) => (e.fieldId = 'my-select'))

    const trigger = el.shadowRoot?.querySelector('[role="combobox"]')
    expect(trigger?.id).toBe('my-select')

    el.remove()
  })

  it('shows placeholder when no value is selected', async () => {
    const el = await makeSelect((e) => (e.placeholder = 'Pick one…'))

    const placeholder = el.shadowRoot?.querySelector('.placeholder')
    expect(placeholder?.textContent?.trim()).toBe('Pick one…')

    el.remove()
  })

  it('shows the selected option label when a value is set', async () => {
    const el = await makeSelect((e) => (e.value = 'banana'))

    const valueSpan = el.shadowRoot?.querySelector('[part="value"]')
    expect(valueSpan?.textContent?.trim()).toBe('Banana')

    el.remove()
  })

  it('marks disabled options with aria-disabled', async () => {
    const el = await makeSelect()

    const options = el.shadowRoot?.querySelectorAll('[role="option"]')
    // Cherry (index 2) is disabled
    expect(options?.[2]?.getAttribute('aria-disabled')).toBe('true')

    el.remove()
  })
})

// ─── Open / close behaviour ────────────────────────────────────────────────────

describe('lf-select open/close', () => {
  it('opens when the trigger is clicked', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.click()
    await el.updateComplete

    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    el.remove()
  })

  it('closes when the trigger is clicked again', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.click()
    await el.updateComplete
    trigger.click()
    await el.updateComplete

    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    el.remove()
  })

  it('closes when Escape is pressed', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.click()
    await el.updateComplete

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await el.updateComplete

    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    el.remove()
  })

  it('does not open when disabled', async () => {
    const el = await makeSelect((e) => (e.disabled = true))
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.click()
    await el.updateComplete

    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    el.remove()
  })

  it('does not open when readonly', async () => {
    const el = await makeSelect((e) => (e.readonly = true))
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.click()
    await el.updateComplete

    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    el.remove()
  })
})

// ─── Keyboard navigation ───────────────────────────────────────────────────────

describe('lf-select keyboard navigation', () => {
  it('opens with Enter key', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await el.updateComplete

    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    el.remove()
  })

  it('opens with Space key', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await el.updateComplete

    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    el.remove()
  })

  it('opens with ArrowDown and focuses first option', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const activeId = trigger.getAttribute('aria-activedescendant')
    expect(activeId).not.toBeNull()

    // The focused option should have the option--focused CSS class
    const focusedOpt = el.shadowRoot?.querySelector('.option--focused')
    expect(focusedOpt).not.toBeNull()
    expect(focusedOpt?.id).toBe(activeId)

    el.remove()
  })

  it('moves focus down with ArrowDown when open', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    // Open
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    const firstFocusedId = trigger.getAttribute('aria-activedescendant')

    // Move down
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    const secondFocusedId = trigger.getAttribute('aria-activedescendant')

    expect(firstFocusedId).not.toBe(secondFocusedId)

    el.remove()
  })

  it('selects the focused option with Enter', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    // Open and move to banana
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    // Confirm
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await el.updateComplete

    expect(el.value).toBe('banana')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    el.remove()
  })

  it('skips disabled options during keyboard navigation', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    // Open (focuses Apple at index 0)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    // Arrow down to Banana (index 1)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    // Arrow down again — Cherry (index 2) is disabled, so focus should not move
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    const focusedOpt = el.shadowRoot?.querySelector('.option--focused')
    expect(focusedOpt?.textContent?.trim()).toBe('Banana')

    el.remove()
  })

  it('jumps to the first non-disabled option with Home', async () => {
    const el = await makeSelect((e) => (e.value = 'banana'))
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    await el.updateComplete

    const focusedOpt = el.shadowRoot?.querySelector('.option--focused')
    expect(focusedOpt?.textContent?.trim()).toBe('Apple')

    el.remove()
  })

  it('jumps to the last non-disabled option with End', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await el.updateComplete

    // Cherry is disabled so last enabled is Banana
    const focusedOpt = el.shadowRoot?.querySelector('.option--focused')
    expect(focusedOpt?.textContent?.trim()).toBe('Banana')

    el.remove()
  })

  it('typeahead jumps to option matching the typed character', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }))
    await el.updateComplete

    const focusedOpt = el.shadowRoot?.querySelector('.option--focused')
    expect(focusedOpt?.textContent?.trim()).toBe('Banana')

    el.remove()
  })
})

// ─── Selection ─────────────────────────────────────────────────────────────────

describe('lf-select selection', () => {
  it('updates value when an option is clicked', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.click()
    await el.updateComplete

    const options = el.shadowRoot?.querySelectorAll('[role="option"]')
    ;(options?.[0] as HTMLElement).click()
    await el.updateComplete

    expect(el.value).toBe('apple')

    el.remove()
  })

  it('marks selected option with aria-selected=true', async () => {
    const el = await makeSelect((e) => (e.value = 'apple'))

    const options = el.shadowRoot?.querySelectorAll('[role="option"]')
    expect(options?.[0]?.getAttribute('aria-selected')).toBe('true')
    expect(options?.[1]?.getAttribute('aria-selected')).toBe('false')

    el.remove()
  })

  it('does not select a disabled option on click', async () => {
    const el = await makeSelect()
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.click()
    await el.updateComplete

    const options = el.shadowRoot?.querySelectorAll('[role="option"]')
    ;(options?.[2] as HTMLElement).click()
    await el.updateComplete

    expect(el.value).toBe('')

    el.remove()
  })

  it('fires lf-change when an option is selected', async () => {
    const el = await makeSelect()
    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement
    trigger.click()
    await el.updateComplete

    const options = el.shadowRoot?.querySelectorAll('[role="option"]')
    ;(options?.[1] as HTMLElement).click()
    await el.updateComplete

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe(
      'banana',
    )

    el.remove()
  })

  it('fires lf-change via keyboard selection', async () => {
    const el = await makeSelect()
    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await el.updateComplete

    expect(handler).toHaveBeenCalledTimes(1)

    el.remove()
  })
})

// ─── Validity and form state ───────────────────────────────────────────────────

describe('lf-select validity', () => {
  it('does not set data-invalid for required+empty before interaction', async () => {
    const el = await makeSelect((e) => (e.required = true))

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets data-invalid after blur with required+empty', async () => {
    const el = await makeSelect((e) => (e.required = true))
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    trigger.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('clears data-invalid once a required field is filled', async () => {
    const el = await makeSelect((e) => {
      e.required = true
    })
    const trigger = el.shadowRoot?.querySelector('[role="combobox"]') as HTMLButtonElement

    // Trigger touched state
    trigger.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete
    expect(el.hasAttribute('data-invalid')).toBe(true)

    // Select a value
    trigger.click()
    await el.updateComplete
    const options = el.shadowRoot?.querySelectorAll('[role="option"]')
    ;(options?.[0] as HTMLElement).click()
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets data-invalid immediately when error prop is set', async () => {
    const el = await makeSelect((e) => (e.error = 'Required'))

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('removes data-invalid when error is cleared', async () => {
    const el = await makeSelect((e) => (e.error = 'Required'))

    el.error = ''
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets aria-invalid on trigger when error is present', async () => {
    const el = await makeSelect((e) => (e.error = 'Required'))

    const trigger = el.shadowRoot?.querySelector('[role="combobox"]')
    expect(trigger?.getAttribute('aria-invalid')).toBe('true')

    el.remove()
  })
})

// ─── Grouped options ───────────────────────────────────────────────────────────

describe('lf-select grouped options', () => {
  it('renders group labels and options', async () => {
    const el = new LfSelect()
    el.options = [
      {
        group: 'Fruits',
        options: [
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
        ],
      },
    ]
    document.body.append(el)
    await el.updateComplete

    const groupLabel = el.shadowRoot?.querySelector('.group-label')
    expect(groupLabel?.textContent?.trim()).toBe('Fruits')

    const options = el.shadowRoot?.querySelectorAll('[role="option"]')
    expect(options?.length).toBe(2)

    el.remove()
  })
})
