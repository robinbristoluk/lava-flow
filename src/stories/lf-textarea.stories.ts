import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-textarea'

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
      resize=${args.resize ?? 'none'}
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
