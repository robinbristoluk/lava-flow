import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-theme'
import '../components/lf-button'

const meta: Meta = {
  title: 'Foundation/LfTheme',
  tags: ['autodocs'],
  argTypes: {
    primaryBg: { control: 'color' },
    focusRing: { control: 'color' },
  },
}

export default meta

type Story = StoryObj<{
  primaryBg: string
  focusRing: string
}>

export const Playground: Story = {
  args: {
    primaryBg: '#5b21b6',
    focusRing: '#7c3aed',
  },
  render: (args) => html`
    <lf-theme primary-bg=${args.primaryBg} focus-ring=${args.focusRing}>
      <div style="display:grid; gap:0.75rem; width:min(22rem, 100%);">
        <lf-button label="Primary action"></lf-button>
        <lf-button variant="secondary" label="Secondary action"></lf-button>
      </div>
    </lf-theme>
  `,
}
