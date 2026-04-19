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

export const CustomTokens: Story = {
  name: 'Custom tokens',
  render: () => html`
    <style>
      .token-demo {
        --lf-color-primary: #0ea5e9;
        --lf-color-primary-hover: #0284c7;
        --lf-color-focus-ring: #0284c7;
        --lf-radius-md: 9999px;
      }
    </style>
    <div class="token-demo" style="display:grid; gap:0.75rem; width:min(22rem, 100%);">
      <lf-button label="Custom primary"></lf-button>
      <lf-button variant="secondary" label="Custom secondary"></lf-button>
    </div>
  `,
}
