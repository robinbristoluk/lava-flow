import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-checkbox'
import '../components/lf-form-error'

const meta: Meta = {
  title: 'Form/LfCheckbox',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },
    checked: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
}

export default meta

type CheckboxStory = StoryObj<{
  label: string
  name: string
  value: string
  checked: boolean
  required: boolean
  disabled: boolean
  error: string
}>

export const Default: CheckboxStory = {
  args: {
    label: 'I agree to the terms and conditions',
    name: 'agree',
    value: 'on',
    checked: false,
    required: false,
    disabled: false,
    error: '',
  },
  render: (args) => html`
    <lf-checkbox
      label=${args.label}
      name=${args.name}
      value=${args.value ?? 'on'}
      error=${args.error ?? ''}
      ?checked=${args.checked}
      ?required=${args.required}
      ?disabled=${args.disabled}
    ></lf-checkbox>
  `,
}

export const Checked: CheckboxStory = {
  name: 'Pre-checked',
  render: () => html`
    <lf-checkbox
      label="I agree to the terms and conditions"
      name="agree"
      checked
    ></lf-checkbox>
  `,
}

export const WithError: CheckboxStory = {
  name: 'With error',
  render: () => html`
    <div style="display:grid; gap:0.5rem">
      <lf-checkbox
        label="I agree to the terms and conditions"
        name="agree"
        required
        error="You must accept the terms to continue."
      ></lf-checkbox>
      <lf-form-error error="You must accept the terms to continue."></lf-form-error>
    </div>
  `,
}

export const Disabled: CheckboxStory = {
  name: 'Disabled',
  render: () => html`
    <lf-checkbox
      label="This option is unavailable"
      name="opt"
      disabled
    ></lf-checkbox>
  `,
}

export const CssParts: CheckboxStory = {
  name: 'CSS parts',
  render: () => html`
    <style>
      lf-checkbox::part(option) { outline: 2px dashed #2563eb; outline-offset: 4px; }
      lf-checkbox::part(mark)   { outline: 2px dashed #7c3aed; outline-offset: 2px; }
      lf-checkbox::part(label)  { outline: 2px dashed #059669; outline-offset: 2px; }
    </style>
    <lf-checkbox label="Subscribe to newsletter" name="subscribe" checked></lf-checkbox>
    <ul style="font-size:0.75rem; color:var(--lf-color-hint, #6b7280); margin:0.75rem 0 0; padding-left:1.25rem; display:grid; gap:0.25rem">
      <li><code style="color:#2563eb">::part(option)</code> — outer <code>&lt;label&gt;</code></li>
      <li><code style="color:#7c3aed">::part(mark)</code> — custom indicator</li>
      <li><code style="color:#059669">::part(label)</code> — label text</li>
    </ul>
  `,
}

export const WithinAForm: CheckboxStory = {
  name: 'Within a <form>',
  args: {
    label: 'I agree to the terms and conditions',
    name: 'agree',
    value: 'agreed',
    checked: false,
    required: true,
    disabled: false,
    error: '',
  },
  render: (args) => html`
    <form
      style="display:grid; gap:1rem; width:min(24rem, 100%)"
      @submit=${(e: Event) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        const result: Record<string, string | null> = {}
        for (const key of new Set(data.keys())) {
          result[key] = data.get(key) as string | null
        }
        alert('Submitted: ' + JSON.stringify(result))
      }}
    >
      <lf-checkbox
        label=${args.label}
        name=${args.name}
        value=${args.value ?? 'on'}
        error=${args.error ?? ''}
        ?checked=${args.checked}
        ?required=${args.required}
        ?disabled=${args.disabled}
      ></lf-checkbox>
      <button type="submit" style="padding:0.625rem 1rem; cursor:pointer">Submit</button>
    </form>
  `,
}
