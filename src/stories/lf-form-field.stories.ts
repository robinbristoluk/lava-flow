import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-form-field'
import type { LfSelectOptionItem } from '../types/form-field'

const COUNTRIES: LfSelectOptionItem[] = [
  { label: 'United Kingdom', value: 'gb' },
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
]

const meta: Meta = {
  title: 'Form/LfFormField',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'url', 'password', 'search', 'number'],
    },
    inputMode: {
      control: 'select',
      options: ['none', 'text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url'],
    },
    resize: {
      control: 'select',
      options: ['none', 'horizontal', 'vertical', 'both'],
    },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    autocomplete: { control: 'text' },
    rows: { control: 'number' },
    minLength: { control: 'number' },
    maxLength: { control: 'number' },
    multiline: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
}

export default meta

type FieldStory = StoryObj<{
  label: string
  name: string
  type: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search' | 'number'
  inputMode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  resize: 'none' | 'horizontal' | 'vertical' | 'both'
  placeholder: string
  value: string
  hint: string
  error: string
  autocomplete: string
  rows: number
  minLength: number
  maxLength: number
  multiline: boolean
  required: boolean
  disabled: boolean
  readonly: boolean
}>

export const Default: FieldStory = {
  args: {
    label: 'Email address',
    name: 'email',
    type: 'email',
    placeholder: 'you@example.com',
    hint: "We'll never share your email.",
    error: '',
    required: false,
    disabled: false,
    readonly: false,
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      type=${args.type}
      placeholder=${args.placeholder}
      .value=${args.value ?? ''}
      hint=${args.hint}
      error=${args.error}
      autocomplete=${args.autocomplete ?? ''}
      min-length=${args.minLength ?? 0}
      max-length=${args.maxLength ?? 0}
      inputmode=${args.inputMode ?? 'text'}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

export const CssParts: FieldStory = {
  name: 'CSS parts',
  render: () => html`
    <style>
      lf-form-field::part(field) {
        outline: 2px dashed #2563eb;
        outline-offset: 4px;
      }
      lf-form-field::part(label) {
        outline: 2px dashed #059669;
        outline-offset: 2px;
      }
      lf-form-field::part(input) {
        outline: 2px dashed #7c3aed;
        outline-offset: 2px;
      }
      lf-form-field::part(hint) {
        outline: 2px dashed #d97706;
        outline-offset: 2px;
      }
      lf-form-field::part(error) {
        outline: 2px dashed #dc2626;
        outline-offset: 2px;
      }
    </style>
    <lf-form-field
      label="Email address"
      name="email"
      type="email"
      placeholder="you@example.com"
      hint="We'll never share your email."
      error="Enter a valid email address."
      style="width: min(24rem, 100%)"
    ></lf-form-field>
    <ul style="font-size:0.75rem; color:var(--lf-color-hint, #6b7280); margin:0.75rem 0 0; padding-left:1.25rem; display:grid; gap:0.25rem">
      <li><code style="color:#2563eb">::part(field)</code> — outer wrapper <code>&lt;div&gt;</code></li>
      <li><code style="color:#059669">::part(label)</code> — the <code>&lt;label&gt;</code> element</li>
      <li><code style="color:#7c3aed">::part(input)</code> — the native <code>&lt;input&gt;</code></li>
      <li><code style="color:#d97706">::part(hint)</code> — hint text (present when <code>hint</code> is set)</li>
      <li><code style="color:#dc2626">::part(error)</code> — error text (present when <code>error</code> is set)</li>
    </ul>
  `,
}

export const WithError: FieldStory = {
  args: {
    ...Default.args,
    label: 'Email address',
    placeholder: '',
    hint: '',
    error: 'Enter a valid email address.',
    required: true,
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      type=${args.type}
      placeholder=${args.placeholder}
      .value=${args.value ?? ''}
      hint=${args.hint}
      error=${args.error}
      autocomplete=${args.autocomplete ?? ''}
      min-length=${args.minLength ?? 0}
      max-length=${args.maxLength ?? 0}
      inputmode=${args.inputMode ?? 'text'}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

export const Disabled: FieldStory = {
  args: {
    ...Default.args,
    label: 'Full name',
    name: 'fullname',
    type: 'text',
    placeholder: 'John Smith',
    hint: '',
    disabled: true,
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      type=${args.type}
      placeholder=${args.placeholder}
      .value=${args.value ?? ''}
      hint=${args.hint}
      error=${args.error}
      autocomplete=${args.autocomplete ?? ''}
      min-length=${args.minLength ?? 0}
      max-length=${args.maxLength ?? 0}
      inputmode=${args.inputMode ?? 'text'}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

export const WithinAForm: FieldStory = {
  name: 'Within a <form>',
  args: {
    ...Default.args,
    label: 'Your message',
    name: 'message',
    type: 'text',
    placeholder: 'Type here\u2026',
    hint: 'Max 280 characters.',
  },
  render: (args) => html`
    <form
      style="display:grid; gap:1rem; width:min(24rem, 100%)"
      @submit=${(e: Event) => {
        e.preventDefault()
        alert('Submitted: ' + JSON.stringify(Object.fromEntries(new FormData(e.target as HTMLFormElement))))
      }}
    >
      <lf-form-field
        label=${args.label}
        name=${args.name}
        type=${args.type}
        placeholder=${args.placeholder}
        .value=${args.value ?? ''}
        hint=${args.hint}
        error=${args.error}
        autocomplete=${args.autocomplete ?? ''}
        min-length=${args.minLength ?? 0}
        max-length=${args.maxLength ?? 0}
        inputmode=${args.inputMode ?? 'text'}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
      ></lf-form-field>
      <button type="submit" style="padding:0.625rem 1rem; cursor:pointer">Submit</button>
    </form>
  `,
}

export const Multiline: FieldStory = {
  name: 'Multiline (textarea)',
  args: {
    ...Default.args,
    label: 'Your message',
    name: 'message',
    type: 'text',
    placeholder: 'Tell us what you think\u2026',
    hint: 'Max 500 characters.',
    rows: 5,
    resize: 'vertical',
    multiline: true,
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      placeholder=${args.placeholder}
      .value=${args.value ?? ''}
      hint=${args.hint}
      error=${args.error ?? ''}
      autocomplete=${args.autocomplete ?? ''}
      min-length=${args.minLength ?? 0}
      max-length=${args.maxLength ?? 0}
      rows=${args.rows ?? 5}
      resize=${args.resize ?? 'vertical'}
      ?multiline=${args.multiline}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

// ─── Select mode stories ───────────────────────────────────────────────────────

export const SelectDefault: FieldStory = {
  name: 'Select — Default',
  args: {
    label: 'Country',
    name: 'country',
    placeholder: 'Select a country…',
    hint: 'Choose your country of residence.',
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      control="select"
      .value=${args.value ?? ''}
      placeholder=${args.placeholder ?? ''}
      hint=${args.hint ?? ''}
      error=${args.error ?? ''}
      .options=${COUNTRIES}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

export const SelectWithError: FieldStory = {
  name: 'Select — With Error',
  args: {
    label: 'Country',
    name: 'country',
    placeholder: 'Select a country…',
    error: 'Please select a country.',
    required: true,
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      control="select"
      .value=${args.value ?? ''}
      placeholder=${args.placeholder ?? ''}
      hint=${args.hint ?? ''}
      error=${args.error ?? ''}
      .options=${COUNTRIES}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

export const SelectWithinAForm: FieldStory = {
  name: 'Select — Within a <form>',
  args: {
    label: 'Country',
    name: 'country',
    placeholder: 'Select a country…',
    required: true,
  },
  render: (args) => html`
    <form
      style="display:grid; gap:1rem; width:min(24rem, 100%)"
      @submit=${(e: Event) => {
        e.preventDefault()
        alert('Submitted: ' + JSON.stringify(Object.fromEntries(new FormData(e.target as HTMLFormElement))))
      }}
    >
      <lf-form-field
        label=${args.label}
        name=${args.name}
        control="select"
        .value=${args.value ?? ''}
        placeholder=${args.placeholder ?? ''}
        hint=${args.hint ?? ''}
        .options=${COUNTRIES}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
      ></lf-form-field>
      <button type="submit" style="padding:0.625rem 1rem; cursor:pointer">Submit</button>
    </form>
  `,
}
