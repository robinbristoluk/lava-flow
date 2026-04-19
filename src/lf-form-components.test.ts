import { describe, expect, it, vi } from 'vitest'

import { LfLabel } from './components/lf-label'
import { LfInput } from './components/lf-input'
import { LfTextarea } from './components/lf-textarea'
import { LfFormHint } from './components/lf-form-hint'
import { LfFormError } from './components/lf-form-error'
import { LfFormField } from './components/lf-form-field'

// ─── lf-label ─────────────────────────────────────────────────────────────────

describe('lf-label', () => {
  it('renders a <label> with the correct for attribute', async () => {
    const el = new LfLabel()
    el.fieldId = 'my-input'
    el.label = 'Full name'
    document.body.append(el)
    await el.updateComplete

    const label = el.shadowRoot?.querySelector('label')
    expect(label).not.toBeNull()
    expect(label?.getAttribute('for')).toBe('my-input')
    expect(label?.textContent?.trim()).toBe('Full name')

    el.remove()
  })
})

// ─── lf-form-hint ─────────────────────────────────────────────────────────────

describe('lf-form-hint', () => {
  it('renders a span with role="note"', async () => {
    const el = new LfFormHint()
    el.hint = 'Helper text'
    document.body.append(el)
    await el.updateComplete

    const span = el.shadowRoot?.querySelector('[part="hint"]')
    expect(span).not.toBeNull()
    expect(span?.getAttribute('role')).toBe('note')
    expect(span?.textContent?.trim()).toBe('Helper text')

    el.remove()
  })
})

// ─── lf-form-error ────────────────────────────────────────────────────────────

describe('lf-form-error', () => {
  it('renders a span with role="alert"', async () => {
    const el = new LfFormError()
    el.error = 'This field is required.'
    document.body.append(el)
    await el.updateComplete

    const span = el.shadowRoot?.querySelector('[part="error"]')
    expect(span).not.toBeNull()
    expect(span?.getAttribute('role')).toBe('alert')
    expect(span?.textContent?.trim()).toBe('This field is required.')

    el.remove()
  })
})

// ─── lf-input ─────────────────────────────────────────────────────────────────

describe('lf-input', () => {
  it('renders an <input> with correct attributes', async () => {
    const el = new LfInput()
    el.fieldId = 'name-input'
    el.name = 'fullname'
    el.placeholder = 'John Smith'
    el.type = 'text'
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input')
    expect(input).not.toBeNull()
    expect(input?.id).toBe('name-input')
    expect(input?.name).toBe('fullname')
    expect(input?.placeholder).toBe('John Smith')
    expect(input?.type).toBe('text')

    el.remove()
  })

  it('reflects required attribute', async () => {
    const el = new LfInput()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('required')).toBe(true)
    const input = el.shadowRoot?.querySelector('input')
    expect(input?.required).toBe(true)

    el.remove()
  })

  it('reflects disabled attribute', async () => {
    const el = new LfInput()
    el.disabled = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('disabled')).toBe(true)
    const input = el.shadowRoot?.querySelector('input')
    expect(input?.disabled).toBe(true)

    el.remove()
  })

  it('sets data-invalid attribute when error is non-empty', async () => {
    const el = new LfInput()
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('removes data-invalid when error is cleared', async () => {
    const el = new LfInput()
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    el.error = ''
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('does not set data-invalid for required+empty before interaction', async () => {
    const el = new LfInput()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets data-invalid for required+empty after blur', async () => {
    const el = new LfInput()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('sets data-invalid when minLength is violated after input', async () => {
    const el = new LfInput()
    el.minLength = 5
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'hi'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('clears data-invalid when minLength constraint is satisfied', async () => {
    const el = new LfInput()
    el.minLength = 3
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'hi'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete

    input.value = 'hello'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('fires lf-input on native input event', async () => {
    const el = new LfInput()
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-input', handler)

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'hello'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('hello')

    el.remove()
  })

  it('fires lf-change on native change event', async () => {
    const el = new LfInput()
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'world'
    input.dispatchEvent(new Event('change', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('world')

    el.remove()
  })

  it('sets aria-invalid on the native input when error is present', async () => {
    const el = new LfInput()
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input')
    expect(input?.getAttribute('aria-invalid')).toBe('true')

    el.remove()
  })

  it('does not set aria-invalid when there is no error and field is untouched', async () => {
    const el = new LfInput()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input')
    expect(input?.getAttribute('aria-invalid')).toBeNull()

    el.remove()
  })
})

// ─── lf-textarea ──────────────────────────────────────────────────────────────

describe('lf-textarea', () => {
  it('renders a <textarea> with correct attributes', async () => {
    const el = new LfTextarea()
    el.fieldId = 'bio-textarea'
    el.name = 'bio'
    el.placeholder = 'Tell us about yourself'
    el.rows = 6
    document.body.append(el)
    await el.updateComplete

    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(textarea).not.toBeNull()
    expect(textarea?.id).toBe('bio-textarea')
    expect(textarea?.name).toBe('bio')
    expect(textarea?.placeholder).toBe('Tell us about yourself')
    expect(Number(textarea?.rows)).toBe(6)

    el.remove()
  })

  it('reflects required attribute', async () => {
    const el = new LfTextarea()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('required')).toBe(true)
    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(textarea?.required).toBe(true)

    el.remove()
  })

  it('reflects disabled attribute', async () => {
    const el = new LfTextarea()
    el.disabled = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('disabled')).toBe(true)
    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(textarea?.disabled).toBe(true)

    el.remove()
  })

  it('sets data-invalid attribute when error is non-empty', async () => {
    const el = new LfTextarea()
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('removes data-invalid when error is cleared', async () => {
    const el = new LfTextarea()
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    el.error = ''
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('does not set data-invalid for required+empty before interaction', async () => {
    const el = new LfTextarea()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets data-invalid for required+empty after blur', async () => {
    const el = new LfTextarea()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement
    textarea.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('fires lf-input on native input event', async () => {
    const el = new LfTextarea()
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-input', handler)

    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = 'hello'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('hello')

    el.remove()
  })

  it('fires lf-change on native change event', async () => {
    const el = new LfTextarea()
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = 'world'
    textarea.dispatchEvent(new Event('change', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('world')

    el.remove()
  })

  it('sets --lf-textarea-resize CSS custom property when resize changes', async () => {
    const el = new LfTextarea()
    el.resize = 'none'
    document.body.append(el)
    await el.updateComplete

    expect(el.style.getPropertyValue('--lf-textarea-resize')).toBe('none')

    el.remove()
  })

  it('sets aria-invalid on the inner textarea when error is present', async () => {
    const el = new LfTextarea()
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(textarea?.getAttribute('aria-invalid')).toBe('true')

    el.remove()
  })

  it('does not set aria-invalid when there is no error and field is untouched', async () => {
    const el = new LfTextarea()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(textarea?.getAttribute('aria-invalid')).toBeNull()

    el.remove()
  })

  it('forwards described-by to aria-describedby on the inner textarea', async () => {
    const el = new LfTextarea()
    el.describedBy = 'hint-1 error-1'
    document.body.append(el)
    await el.updateComplete

    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(textarea?.getAttribute('aria-describedby')).toBe('hint-1 error-1')

    el.remove()
  })
})

// ─── lf-form-field ────────────────────────────────────────────────────────────

describe('lf-form-field', () => {
  it('renders label, input and connects them via for/id', async () => {
    const el = new LfFormField()
    el.label = 'Email'
    el.name = 'email'
    el.type = 'email'
    document.body.append(el)
    await el.updateComplete

    const label = el.shadowRoot?.querySelector('label')
    const input = el.shadowRoot?.querySelector('input')

    expect(label).not.toBeNull()
    expect(input).not.toBeNull()
    expect(label?.htmlFor).toBe(input?.id)

    el.remove()
  })

  it('does not render hint when hint is empty', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    document.body.append(el)
    await el.updateComplete

    expect(el.shadowRoot?.querySelector('[part="hint"]')).toBeNull()

    el.remove()
  })

  it('renders hint when hint is set', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    el.hint = 'Enter your full name.'
    document.body.append(el)
    await el.updateComplete

    const hint = el.shadowRoot?.querySelector('[part="hint"]')
    expect(hint).not.toBeNull()
    expect(hint?.textContent?.trim()).toBe('Enter your full name.')

    el.remove()
  })

  it('does not render error when error is empty', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    document.body.append(el)
    await el.updateComplete

    expect(el.shadowRoot?.querySelector('[part="error"]')).toBeNull()

    el.remove()
  })

  it('renders error when error is set', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    el.error = 'This field is required.'
    document.body.append(el)
    await el.updateComplete

    const error = el.shadowRoot?.querySelector('[part="error"]')
    expect(error).not.toBeNull()
    expect(error?.getAttribute('role')).toBe('alert')
    expect(error?.textContent?.trim()).toBe('This field is required.')

    el.remove()
  })

  it('sets data-invalid on host when error is set', async () => {
    const el = new LfFormField()
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('removes data-invalid when error is cleared', async () => {
    const el = new LfFormField()
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    el.error = ''
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('does not set data-invalid for required+empty before interaction', async () => {
    const el = new LfFormField()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets data-invalid for required+empty after blur', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('sets data-invalid when minLength is violated after input', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    el.minLength = 5
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'hi'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('sets aria-invalid on inner input when required+empty after blur', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete

    expect(input.getAttribute('aria-invalid')).toBe('true')

    el.remove()
  })

  it('fires lf-input on every keystroke', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    el.name = 'name'
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-input', handler)

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'Jane'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('Jane')

    el.remove()
  })

  it('fires lf-change on native change event (blur / Enter)', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    el.name = 'name'
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'Jane'
    input.dispatchEvent(new Event('change', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('Jane')

    el.remove()
  })

  it('sets aria-invalid on the inner input when error is present', async () => {
    const el = new LfFormField()
    el.label = 'Email'
    el.error = 'Invalid email'
    document.body.append(el)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('input')
    expect(input?.getAttribute('aria-invalid')).toBe('true')

    el.remove()
  })
})

// ─── lf-radio-group ───────────────────────────────────────────────────────────

import { LfRadioGroup } from './components/lf-radio-group'
import { LfCheckboxGroup } from './components/lf-checkbox-group'
import { LfCheckbox } from './components/lf-checkbox'

const RADIO_OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('lf-radio-group', () => {
  it('renders a radio input per option', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    el.name = 'choice'
    document.body.append(el)
    await el.updateComplete

    const radios = el.shadowRoot?.querySelectorAll('input[type="radio"]')
    expect(radios?.length).toBe(3)

    el.remove()
  })

  it('renders a fieldset with the group label as a legend', async () => {
    const el = new LfRadioGroup()
    el.label = 'Pick one'
    el.options = RADIO_OPTIONS
    document.body.append(el)
    await el.updateComplete

    const legend = el.shadowRoot?.querySelector('legend')
    expect(legend?.textContent?.trim()).toBe('Pick one')

    el.remove()
  })

  it('marks the correct radio as checked when value is set', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    el.value = 'b'
    document.body.append(el)
    await el.updateComplete

    const radios = el.shadowRoot?.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>
    expect(radios[0]?.checked).toBe(false)
    expect(radios[1]?.checked).toBe(true)
    expect(radios[2]?.checked).toBe(false)

    el.remove()
  })

  it('reflects disabled attribute and disables all radios', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    el.disabled = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('disabled')).toBe(true)
    const radios = el.shadowRoot?.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>
    radios.forEach((r) => expect(r.disabled).toBe(true))

    el.remove()
  })

  it('disables individual options when option.disabled is true', async () => {
    const el = new LfRadioGroup()
    el.options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ]
    document.body.append(el)
    await el.updateComplete

    const radios = el.shadowRoot?.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>
    expect(radios[0]?.disabled).toBe(false)
    expect(radios[1]?.disabled).toBe(true)

    el.remove()
  })

  it('sets data-invalid when error is non-empty', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    el.error = 'Please select an option.'
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('does not set data-invalid for required+empty before interaction', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    el.required = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets data-invalid for required+empty after blur', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const radio = el.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement
    radio.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('fires lf-change when a radio is selected', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const radios = el.shadowRoot?.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>
    radios[1]!.checked = true
    radios[1]!.dispatchEvent(new Event('change', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('b')

    el.remove()
  })

  it('renders hint with role="note" when hint is set', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    el.hint = 'Choose carefully.'
    document.body.append(el)
    await el.updateComplete

    const hint = el.shadowRoot?.querySelector('[part="hint"]')
    expect(hint?.getAttribute('role')).toBe('note')
    expect(hint?.textContent?.trim()).toBe('Choose carefully.')

    el.remove()
  })

  it('renders error with role="alert" when error is set', async () => {
    const el = new LfRadioGroup()
    el.options = RADIO_OPTIONS
    el.error = 'Selection required.'
    document.body.append(el)
    await el.updateComplete

    const error = el.shadowRoot?.querySelector('[part="error"]')
    expect(error?.getAttribute('role')).toBe('alert')
    expect(error?.textContent?.trim()).toBe('Selection required.')

    el.remove()
  })
})

// ─── lf-checkbox-group ────────────────────────────────────────────────────────

const CHECKBOX_OPTIONS = [
  { value: 'x', label: 'Option X' },
  { value: 'y', label: 'Option Y' },
  { value: 'z', label: 'Option Z' },
]

describe('lf-checkbox-group', () => {
  it('renders a checkbox per option', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    document.body.append(el)
    await el.updateComplete

    const checkboxes = el.shadowRoot?.querySelectorAll('input[type="checkbox"]')
    expect(checkboxes?.length).toBe(3)

    el.remove()
  })

  it('marks the correct checkboxes as checked when value is set', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    el.value = ['x', 'z']
    document.body.append(el)
    await el.updateComplete

    const checkboxes = el.shadowRoot?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
    expect(checkboxes[0]?.checked).toBe(true)
    expect(checkboxes[1]?.checked).toBe(false)
    expect(checkboxes[2]?.checked).toBe(true)

    el.remove()
  })

  it('reflects disabled attribute and disables all checkboxes', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    el.disabled = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('disabled')).toBe(true)
    const checkboxes = el.shadowRoot?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
    checkboxes.forEach((cb) => expect(cb.disabled).toBe(true))

    el.remove()
  })

  it('sets data-invalid when error is non-empty', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    el.error = 'Please select at least one option.'
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('does not set data-invalid for required+empty before interaction', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    el.required = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets data-invalid for required+none-checked after blur', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const cb = el.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement
    cb.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('fires lf-change with updated values when a checkbox is toggled', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    el.value = []
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const checkboxes = el.shadowRoot?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
    checkboxes[0]!.checked = true
    checkboxes[0]!.dispatchEvent(new Event('change', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string[] }>).detail.value).toEqual(['x'])

    el.remove()
  })

  it('removes a value from the array when a checkbox is unchecked', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    el.value = ['x', 'y']
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const checkboxes = el.shadowRoot?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
    checkboxes[0]!.checked = false
    checkboxes[0]!.dispatchEvent(new Event('change', { bubbles: true }))

    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string[] }>).detail.value).toEqual(['y'])

    el.remove()
  })

  it('value array contains all selected values after multiple checkboxes are checked', async () => {
    const el = new LfCheckboxGroup()
    el.options = CHECKBOX_OPTIONS
    el.value = []
    document.body.append(el)
    await el.updateComplete

    const checkboxes = el.shadowRoot?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>

    checkboxes[0]!.checked = true
    checkboxes[0]!.dispatchEvent(new Event('change', { bubbles: true }))
    checkboxes[2]!.checked = true
    checkboxes[2]!.dispatchEvent(new Event('change', { bubbles: true }))

    expect(el.value).toEqual(['x', 'z'])

    el.remove()
  })
})

// ─── lf-checkbox ──────────────────────────────────────────────────────────────

describe('lf-checkbox', () => {
  it('renders a single checkbox', async () => {
    const el = new LfCheckbox()
    el.label = 'Accept terms'
    el.name = 'agree'
    document.body.append(el)
    await el.updateComplete

    const checkbox = el.shadowRoot?.querySelector('input[type="checkbox"]')
    expect(checkbox).not.toBeNull()

    el.remove()
  })

  it('reflects checked attribute', async () => {
    const el = new LfCheckbox()
    el.checked = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('checked')).toBe(true)
    const checkbox = el.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(checkbox?.checked).toBe(true)

    el.remove()
  })

  it('reflects disabled attribute', async () => {
    const el = new LfCheckbox()
    el.disabled = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('disabled')).toBe(true)
    const checkbox = el.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(checkbox?.disabled).toBe(true)

    el.remove()
  })

  it('sets data-invalid when error is non-empty', async () => {
    const el = new LfCheckbox()
    el.error = 'You must accept.'
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('does not set data-invalid for required+unchecked before interaction', async () => {
    const el = new LfCheckbox()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(false)

    el.remove()
  })

  it('sets data-invalid for required+unchecked after blur', async () => {
    const el = new LfCheckbox()
    el.required = true
    document.body.append(el)
    await el.updateComplete

    const checkbox = el.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement
    checkbox.dispatchEvent(new Event('blur', { bubbles: true }))
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('fires lf-change with checked state when toggled', async () => {
    const el = new LfCheckbox()
    el.value = 'agree'
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const checkbox = el.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement
    checkbox.checked = true
    checkbox.dispatchEvent(new Event('change', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    const detail = (handler.mock.calls[0]?.[0] as CustomEvent<{ checked: boolean; value: string | null }>).detail
    expect(detail.checked).toBe(true)
    expect(detail.value).toBe('agree')

    el.remove()
  })

  it('fires lf-change with null value when unchecked', async () => {
    const el = new LfCheckbox()
    el.value = 'agree'
    el.checked = true
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const checkbox = el.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement
    checkbox.checked = false
    checkbox.dispatchEvent(new Event('change', { bubbles: true }))

    const detail = (handler.mock.calls[0]?.[0] as CustomEvent<{ checked: boolean; value: string | null }>).detail
    expect(detail.checked).toBe(false)
    expect(detail.value).toBeNull()

    el.remove()
  })

  it('uses custom value in form data when checked', async () => {
    const el = new LfCheckbox()
    el.name = 'agree'
    el.value = 'agreed'
    document.body.append(el)
    await el.updateComplete

    const spy = vi.spyOn((el as unknown as { internals: ElementInternals }).internals, 'setFormValue')

    el.checked = true
    await el.updateComplete

    expect(spy).toHaveBeenCalledWith('agreed')

    el.remove()
  })

  it('submits null (field absent) when unchecked', async () => {
    const el = new LfCheckbox()
    el.name = 'agree'
    el.value = 'agreed'
    el.checked = true
    document.body.append(el)
    await el.updateComplete

    const spy = vi.spyOn((el as unknown as { internals: ElementInternals }).internals, 'setFormValue')

    el.checked = false
    await el.updateComplete

    expect(spy).toHaveBeenCalledWith(null)

    el.remove()
  })

  it('renders label text', async () => {
    const el = new LfCheckbox()
    el.label = 'Subscribe to newsletter'
    document.body.append(el)
    await el.updateComplete

    const labelSpan = el.shadowRoot?.querySelector('[part="label"]')
    expect(labelSpan?.textContent?.trim()).toBe('Subscribe to newsletter')

    el.remove()
  })

  it('uses field-id on the native input when provided', async () => {
    const el = new LfCheckbox()
    el.fieldId = 'my-checkbox'
    el.label = 'Accept'
    document.body.append(el)
    await el.updateComplete

    const checkbox = el.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(checkbox?.id).toBe('my-checkbox')

    el.remove()
  })
})

// ─── lf-form-field (multiline) ────────────────────────────────────────────────

describe('lf-form-field multiline', () => {
  it('renders a <textarea> instead of <input> when multiline is set', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    document.body.append(el)
    await el.updateComplete

    expect(el.shadowRoot?.querySelector('textarea')).not.toBeNull()
    expect(el.shadowRoot?.querySelector('input')).toBeNull()

    el.remove()
  })

  it('connects label to the textarea via for/id', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    document.body.append(el)
    await el.updateComplete

    const label = el.shadowRoot?.querySelector('label')
    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(label?.htmlFor).toBe(textarea?.id)

    el.remove()
  })

  it('reflects rows attribute on the textarea', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    el.rows = 8
    document.body.append(el)
    await el.updateComplete

    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(Number(textarea?.rows)).toBe(8)

    el.remove()
  })

  it('fires lf-input on every keystroke (multiline)', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-input', handler)

    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = 'Hello world'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('Hello world')

    el.remove()
  })

  it('fires lf-change on native change event (multiline)', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = 'Hello world'
    textarea.dispatchEvent(new Event('change', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('Hello world')

    el.remove()
  })

  it('sets data-invalid on host when error is set (multiline)', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    el.error = 'Required'
    document.body.append(el)
    await el.updateComplete

    expect(el.hasAttribute('data-invalid')).toBe(true)

    el.remove()
  })

  it('sets aria-invalid on the inner textarea when error is present', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    el.error = 'This field is required.'
    document.body.append(el)
    await el.updateComplete

    const textarea = el.shadowRoot?.querySelector('textarea')
    expect(textarea?.getAttribute('aria-invalid')).toBe('true')

    el.remove()
  })

  it('sets --lf-textarea-resize CSS custom property when resize changes', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    el.resize = 'none'
    document.body.append(el)
    await el.updateComplete

    expect(el.style.getPropertyValue('--lf-textarea-resize')).toBe('none')

    el.remove()
  })
})
