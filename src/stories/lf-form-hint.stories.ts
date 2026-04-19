import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-form-hint'

const meta: Meta = {
  title: 'Form/LfFormHint',
  tags: ['autodocs'],
  argTypes: {
    hint: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<{
  hint: string
}>

export const Default: Story = {
  args: {
    hint: "We'll never share your email with anyone else.",
  },
  render: (args) => html`<lf-form-hint hint=${args.hint}></lf-form-hint>`,
}

export const CssParts: Story = {
  name: 'CSS parts',
  render: () => html`
    <style>
      lf-form-hint::part(hint) {
        outline: 2px dashed #d97706;
        outline-offset: 2px;
      }
    </style>
    <lf-form-hint hint="We'll never share your email."></lf-form-hint>
    <p style="font-size:0.75rem; color:#6b7280; margin:0.5rem 0 0">
      <code style="color:#d97706">::part(hint)</code> — the hint text container
    </p>
  `,
}

export const LongHint: Story = {
  name: 'Long hint text',
  args: {
    hint: 'Your password must be at least 12 characters and contain a mix of uppercase letters, lowercase letters, numbers, and symbols.',
  },
  render: (args) => html`
    <lf-form-hint hint=${args.hint} style="max-width: min(26rem, 100%)"></lf-form-hint>
  `,
}
