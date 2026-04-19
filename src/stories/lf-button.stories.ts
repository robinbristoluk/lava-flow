import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-button'

const meta: Meta = {
  title: 'Components/LfButton',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
}

export default meta

type Story = StoryObj<{
  variant: 'primary' | 'secondary'
  disabled: boolean
  loading: boolean
  fullWidth: boolean
  label: string
}>

export const Primary: Story = {
  args: {
    variant: 'primary',
    disabled: false,
    loading: false,
    fullWidth: false,
    label: 'Continue',
  },
  render: (args) => html`
    <lf-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args.fullWidth}
      label=${args.label}
    ></lf-button>
  `,
}

export const SecondaryWithIcon: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
    label: 'Download',
  },
  render: (args) => html`
    <lf-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args.fullWidth}
      label=${args.label}
    >
      <span slot="icon">⬇️</span>
    </lf-button>
  `,
}
