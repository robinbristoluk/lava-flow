import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-textarea'
import '../components/lf-label'
import '../components/lf-form-hint'
import '../components/lf-form-error'

const meta: Meta = {
  title: 'Form/LfTextarea',
  tags: ['autodocs'],
  argTypes: {
    resize: {
      control: 'select',
      options: ['none', 'horizontal', 'vertical', 'both'],
    },
    name: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    autocomplete: { control: 'text' },
    rows: { control: 'number' },
    minLength: { control: 'number' },
    maxLength: { control: 'number' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<{
  resize: 'none' | 'horizontal' | 'vertical' | 'both'
  name: string
  placeholder: string
  value: string
  error: string
  autocomplete: string
  rows: number
  minLength: number
  maxLength: number
  required: boolean
  disabled: boolean
  readonly: boolean
}>

export const Default: Story = {
  args: {
    resize: 'vertical',
    placeholder: 'Enter text…',
    rows: 4,
    value: '',
    error: '',
    required: false,
    disabled: false,
    readonly: false,
  },
  render: (args) => html`
    <lf-textarea
      name=${args.name ?? ''}
      placeholder=${args.placeholder}
      .value=${args.value}
      error=${args.error}
      autocomplete=${args.autocomplete ?? ''}
      rows=${args.rows ?? 4}
      min-length=${args.minLength ?? 0}
      max-length=${args.maxLength ?? 0}
      resize=${args.resize ?? 'vertical'}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-textarea>
  `,
}

export const CssParts: Story = {
  name: 'CSS parts',
  render: () => html`
    <style>
      lf-textarea::part(textarea) {
        outline: 2px dashed #7c3aed;
        outline-offset: 2px;
      }
    </style>
    <lf-textarea placeholder="Enter text…" style="width: min(22rem, 100%)"></lf-textarea>
    <p style="font-size:0.75rem; color:#6b7280; margin:0.5rem 0 0">
      <code style="color:#7c3aed">::part(textarea)</code> — the native <code>&lt;textarea&gt;</code> element
    </p>
  `,
}

export const WithError: Story = {
  args: {
    ...Default.args,
    placeholder: 'Describe the issue…',
    error: 'This field is required.',
  },
  render: (args) => html`
    <lf-textarea
      name=${args.name ?? ''}
      placeholder=${args.placeholder}
      .value=${args.value}
      error=${args.error}
      autocomplete=${args.autocomplete ?? ''}
      rows=${args.rows ?? 4}
      min-length=${args.minLength ?? 0}
      max-length=${args.maxLength ?? 0}
      resize=${args.resize ?? 'vertical'}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-textarea>
  `,
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    placeholder: 'Cannot edit',
    disabled: true,
  },
  render: (args) => html`
    <lf-textarea
      name=${args.name ?? ''}
      placeholder=${args.placeholder}
      .value=${args.value}
      error=${args.error}
      rows=${args.rows ?? 4}
      resize=${args.resize ?? 'vertical'}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-textarea>
  `,
}

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    value: 'This value cannot be changed.',
    readonly: true,
  },
  render: (args) => html`
    <lf-textarea
      name=${args.name ?? ''}
      .value=${args.value}
      rows=${args.rows ?? 4}
      resize="none"
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-textarea>
  `,
}

export const NoResize: Story = {
  name: 'Resize: none',
  args: {
    ...Default.args,
    resize: 'none',
    placeholder: 'Fixed size textarea…',
  },
  render: (args) => html`
    <lf-textarea
      placeholder=${args.placeholder}
      rows=${args.rows ?? 4}
      resize="none"
      style="width: min(22rem, 100%)"
    ></lf-textarea>
  `,
}

export const WithLabelAndHint: Story = {
  name: 'With label, hint & error',
  render: () => html`
    <div style="display:grid; gap:0.5rem; width:min(22rem, 100%)">
      <lf-label field-id="bio" label="Bio"></lf-label>
      <lf-textarea
        field-id="bio"
        name="bio"
        placeholder="Tell us about yourself…"
        rows="4"
        described-by="bio-hint bio-error"
        style="width: 100%"
      ></lf-textarea>
      <lf-form-hint id="bio-hint" hint="Keep it under 200 characters."></lf-form-hint>
      <lf-form-error id="bio-error" error="Bio is required."></lf-form-error>
    </div>
    <p style="font-size:0.75rem; color:#6b7280; margin:0.75rem 0 0">
      Use <code>field-id</code> to connect <code>&lt;lf-label&gt;</code> and
      <code>described-by</code> to wire <code>aria-describedby</code> to external
      <code>&lt;lf-form-hint&gt;</code> / <code>&lt;lf-form-error&gt;</code> elements.
    </p>
  `,
}

export const WithinAForm: Story = {
  name: 'Within a <form>',
  args: {
    ...Default.args,
    name: 'message',
    placeholder: 'Type your message here\u2026',
    rows: 5,
    required: true,
  },
  render: (args) => html`
    <form
      style="display:grid; gap:1rem; width:min(22rem, 100%)"
      @submit=${(e: Event) => {
        e.preventDefault()
        alert('Submitted: ' + JSON.stringify(Object.fromEntries(new FormData(e.target as HTMLFormElement))))
      }}
    >
      <lf-textarea
        name=${args.name ?? 'message'}
        placeholder=${args.placeholder}
        .value=${args.value}
        rows=${args.rows ?? 5}
        min-length=${args.minLength ?? 0}
        max-length=${args.maxLength ?? 0}
        resize=${args.resize ?? 'vertical'}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
      ></lf-textarea>
      <button type="submit" style="padding:0.625rem 1rem; cursor:pointer">Submit</button>
    </form>
  `,
}
