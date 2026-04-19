import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-label'

const meta: Meta = {
  title: 'Form/LfLabel',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    fieldId: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<{
  label: string
  fieldId: string
}>

export const Default: Story = {
  args: {
    label: 'Email address',
    fieldId: 'email',
  },
  render: (args) => html`
    <lf-label field-id=${args.fieldId} label=${args.label}></lf-label>
  `,
}

export const Required: Story = {
  name: 'Required (via slotted asterisk)',
  args: {
    label: 'Email address *',
    fieldId: 'email-required',
  },
  render: (args) => html`
    <lf-label field-id=${args.fieldId} label=${args.label}></lf-label>
  `,
}

export const CssParts: Story = {
  name: 'CSS parts',
  render: () => html`
    <style>
      lf-label::part(label) {
        outline: 2px dashed #059669;
        outline-offset: 2px;
      }
    </style>
    <lf-label label="Email address" field-id="demo-label-parts"></lf-label>
    <p style="font-size:0.75rem; color:#6b7280; margin:0.5rem 0 0">
      <code style="color:#059669">::part(label)</code> — the native <code>&lt;label&gt;</code> element
    </p>
  `,
}

export const LinkedToInput: Story = {
  name: 'Linked to an input',
  args: {
    label: 'Full name',
    fieldId: 'fullname',
  },
  render: (args) => html`
    <div style="display:grid; gap:0.375rem; width:min(22rem, 100%)">
      <lf-label field-id=${args.fieldId} label=${args.label}></lf-label>
      <input
        id=${args.fieldId}
        type="text"
        placeholder="John Smith"
        style="
          border: 1px solid #d1d5db;
          border-radius: 0.625rem;
          font: inherit;
          font-size: 1rem;
          min-height: 2.75rem;
          padding: 0.625rem 1rem;
          width: 100%;
        "
      />
    </div>
  `,
}
