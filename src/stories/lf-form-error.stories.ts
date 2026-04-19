import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-form-error'

const meta: Meta = {
  title: 'Form/LfFormError',
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<{
  error: string
}>

export const Default: Story = {
  args: {
    error: 'This field is required.',
  },
  render: (args) => html`<lf-form-error error=${args.error}></lf-form-error>`,
}

export const CssParts: Story = {
  name: 'CSS parts',
  render: () => html`
    <style>
      lf-form-error::part(error) {
        outline: 2px dashed #dc2626;
        outline-offset: 2px;
      }
    </style>
    <lf-form-error error="This field is required."></lf-form-error>
    <p style="font-size:0.75rem; color:#6b7280; margin:0.5rem 0 0">
      <code style="color:#dc2626">::part(error)</code> — the error text container
    </p>
  `,
}

export const ValidationError: Story = {
  name: 'Validation error',
  args: {
    error: 'Enter a valid email address.',
  },
  render: (args) => html`<lf-form-error error=${args.error}></lf-form-error>`,
}

export const LongError: Story = {
  name: 'Long error message',
  args: {
    error: 'Password must be at least 12 characters and include uppercase, lowercase, a number, and a special character.',
  },
  render: (args) => html`
    <lf-form-error error=${args.error} style="max-width: min(26rem, 100%)"></lf-form-error>
  `,
}
