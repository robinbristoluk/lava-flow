import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-input'

const meta: Meta = {
  title: 'Form/LfInput',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'url', 'password', 'search', 'number'],
    },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    autocomplete: { control: 'text' },
    minLength: { control: 'number' },
    maxLength: { control: 'number' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<{
  type: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search' | 'number'
  placeholder: string
  value: string
  error: string
  autocomplete: string
  minLength: number
  maxLength: number
  required: boolean
  disabled: boolean
  readonly: boolean
}>

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text…',
    value: '',
    error: '',
    required: false,
    disabled: false,
    readonly: false,
  },
  render: (args) => html`
    <lf-input
      type=${args.type}
      placeholder=${args.placeholder}
      .value=${args.value}
      error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-input>
  `,
}

export const WithError: Story = {
  args: {
    ...Default.args,
    type: 'email',
    placeholder: 'you@example.com',
    error: 'Enter a valid email address.',
  },
  render: (args) => html`
    <lf-input
      type=${args.type}
      placeholder=${args.placeholder}
      .value=${args.value}
      error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-input>
  `,
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    placeholder: 'Cannot edit',
    disabled: true,
  },
  render: (args) => html`
    <lf-input
      type=${args.type}
      placeholder=${args.placeholder}
      .value=${args.value}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-input>
  `,
}

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    value: 'Read-only value',
    readonly: true,
  },
  render: (args) => html`
    <lf-input
      type=${args.type}
      .value=${args.value}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-input>
  `,
}

export const Password: Story = {
  args: {
    ...Default.args,
    type: 'password',
    placeholder: 'Min. 12 characters',
    autocomplete: 'new-password',
    minLength: 12,
  },
  render: (args) => html`
    <lf-input
      type=${args.type}
      placeholder=${args.placeholder}
      autocomplete=${args.autocomplete ?? ''}
      min-length=${args.minLength ?? 0}
      ?required=${args.required}
      ?disabled=${args.disabled}
      style="width: min(22rem, 100%)"
    ></lf-input>
  `,
}
