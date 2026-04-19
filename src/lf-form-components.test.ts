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

  it('fires lf-change when the input value changes', async () => {
    const el = new LfFormField()
    el.label = 'Name'
    el.name = 'name'
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'Jane'
    input.dispatchEvent(new Event('input', { bubbles: true }))

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

  it('fires lf-change when the textarea value changes', async () => {
    const el = new LfFormField()
    el.label = 'Message'
    el.multiline = true
    document.body.append(el)
    await el.updateComplete

    const handler = vi.fn()
    el.addEventListener('lf-change', handler)

    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = 'Hello world'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))

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
