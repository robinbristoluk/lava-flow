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
