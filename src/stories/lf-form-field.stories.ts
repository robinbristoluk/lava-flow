import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-label'
import '../components/lf-input'
import '../components/lf-form-hint'
import '../components/lf-form-error'
import '../components/lf-form-field'

// ─── lf-form-field (composite) ────────────────────────────────────────────────

const fieldMeta: Meta = {
  title: 'Form/LfFormField',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'url', 'password', 'search', 'number'],
    },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
}

export default fieldMeta

type FieldStory = StoryObj<{
  label: string
  name: string
  type: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search' | 'number'
  placeholder: string
  hint: string
  error: string
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
      hint=${args.hint}
      error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
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
      hint=${args.hint}
      error=${args.error}
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
      hint=${args.hint}
      error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

// ─── Individual building blocks ───────────────────────────────────────────────

export const BuildingBlocks: StoryObj = {
  name: 'Building blocks (standalone)',
  render: () => html`
    <div style="display:grid; gap:0.25rem; width:min(24rem, 100%)">
      <lf-label field-id="demo-name" label="Full name"></lf-label>
      <lf-input field-id="demo-name" name="fullname" placeholder="John Smith"></lf-input>
      <lf-form-hint hint="Enter your name as it appears on your ID."></lf-form-hint>
    </div>
  `,
}

export const BuildingBlocksWithError: StoryObj = {
  name: 'Building blocks — with error',
  render: () => html`
    <div style="display:grid; gap:0.25rem; width:min(24rem, 100%)">
      <lf-label field-id="demo-email" label="Email address"></lf-label>
      <lf-input
        field-id="demo-email"
        name="email"
        type="email"
        error="Enter a valid email address."
      ></lf-input>
      <lf-form-error error="Enter a valid email address."></lf-form-error>
    </div>
  `,
}
