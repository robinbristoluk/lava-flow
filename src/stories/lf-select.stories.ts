import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-select'
import type { LfSelectOptionItem } from '../types/form-field'

const COUNTRIES: LfSelectOptionItem[] = [
  { label: 'United Kingdom', value: 'gb' },
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
]

const GROUPED_OPTIONS: LfSelectOptionItem[] = [
  {
    group: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
    ],
  },
  {
    group: 'Vegetables',
    options: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Broccoli', value: 'broccoli' },
      { label: 'Spinach', value: 'spinach', disabled: true },
    ],
  },
]

const meta: Meta = {
  title: 'Form/LfSelect',
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<{
  name: string
  value: string
  placeholder: string
  error: string
  required: boolean
  disabled: boolean
  readonly: boolean
}>

export const Default: Story = {
  args: {
    placeholder: 'Select a country…',
    value: '',
    error: '',
    required: false,
    disabled: false,
    readonly: false,
  },
  render: (args) => html`
    <label for="select-demo" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
      Country
    </label>
    <lf-select
      id="select-demo"
      field-id="select-demo"
      name=${args.name ?? 'country'}
      .value=${args.value ?? ''}
      placeholder=${args.placeholder}
      error=${args.error}
      .options=${COUNTRIES}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-select>
  `,
}

export const WithSelectedValue: Story = {
  args: {
    ...Default.args,
    value: 'gb',
  },
  render: (args) => html`
    <label for="select-prefilled" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
      Country
    </label>
    <lf-select
      field-id="select-prefilled"
      name="country"
      .value=${args.value ?? ''}
      placeholder=${args.placeholder ?? ''}
      .options=${COUNTRIES}
      style="width: min(22rem, 100%)"
    ></lf-select>
  `,
}

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
  },
  render: (args) => html`
    <label for="select-required" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
      Country <span aria-hidden="true" style="color:var(--lf-color-error, #dc2626)">*</span>
    </label>
    <lf-select
      field-id="select-required"
      name="country"
      .value=${args.value ?? ''}
      placeholder="Select a country…"
      .options=${COUNTRIES}
      ?required=${args.required}
      style="width: min(22rem, 100%)"
    ></lf-select>
    <p style="font-size:0.75rem; color:var(--lf-color-hint, #6b7280); margin:0.375rem 0 0">
      Tab away without selecting to see validation state.
    </p>
  `,
}

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Please select a country.',
  },
  render: (args) => html`
    <label for="select-error" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
      Country
    </label>
    <lf-select
      field-id="select-error"
      name="country"
      .value=${args.value ?? ''}
      placeholder="Select a country…"
      error=${args.error}
      .options=${COUNTRIES}
      style="width: min(22rem, 100%)"
    ></lf-select>
    <span role="alert" style="display:block; font-size:0.875rem; color:var(--lf-color-error, #dc2626); margin-top:0.25rem">
      ${args.error}
    </span>
  `,
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    value: 'us',
    disabled: true,
  },
  render: (args) => html`
    <label for="select-disabled" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
      Country
    </label>
    <lf-select
      field-id="select-disabled"
      name="country"
      .value=${args.value ?? ''}
      placeholder="Select a country…"
      .options=${COUNTRIES}
      ?disabled=${args.disabled}
      style="width: min(22rem, 100%)"
    ></lf-select>
  `,
}

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    value: 'au',
    readonly: true,
  },
  render: (args) => html`
    <label for="select-readonly" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
      Country
    </label>
    <lf-select
      field-id="select-readonly"
      name="country"
      .value=${args.value ?? ''}
      .options=${COUNTRIES}
      ?readonly=${args.readonly}
      style="width: min(22rem, 100%)"
    ></lf-select>
  `,
}

export const GroupedOptions: Story = {
  args: {
    ...Default.args,
    placeholder: 'Pick a food…',
  },
  render: (args) => html`
    <label for="select-grouped" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
      Favourite food
    </label>
    <lf-select
      field-id="select-grouped"
      name="food"
      .value=${args.value ?? ''}
      placeholder="Pick a food…"
      .options=${GROUPED_OPTIONS}
      style="width: min(22rem, 100%)"
    ></lf-select>
    <p style="font-size:0.75rem; color:var(--lf-color-hint, #6b7280); margin:0.375rem 0 0">
      'Spinach' is a disabled option inside the Vegetables group.
    </p>
  `,
}

export const WithinAForm: Story = {
  args: {
    ...Default.args,
  },
  name: 'Within a <form>',
  render: () => html`
    <form
      style="display:grid; gap:1rem; width:min(24rem, 100%)"
      @submit=${(e: Event) => {
        e.preventDefault()
        alert(
          'Submitted: ' +
            JSON.stringify(Object.fromEntries(new FormData(e.target as HTMLFormElement))),
        )
      }}
    >
      <div>
        <label for="form-country" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
          Country <span aria-hidden="true" style="color:var(--lf-color-error, #dc2626)">*</span>
        </label>
        <lf-select
          field-id="form-country"
          name="country"
          placeholder="Select a country…"
          .options=${COUNTRIES}
          required
        ></lf-select>
      </div>
      <button type="submit" style="padding:0.625rem 1rem; cursor:pointer">Submit</button>
    </form>
  `,
}

export const CssParts: Story = {
  name: 'CSS parts',
  render: () => html`
    <style>
      #select-parts::part(trigger) {
        outline: 2px dashed #7c3aed;
        outline-offset: 2px;
      }
      #select-parts::part(value) {
        outline: 2px dashed #059669;
        outline-offset: 1px;
      }
      #select-parts::part(icon) {
        outline: 2px dashed #d97706;
        outline-offset: 1px;
      }
      #select-parts::part(listbox) {
        outline: 2px dashed #2563eb;
        outline-offset: 2px;
      }
      #select-parts::part(option) {
        outline: 1px dashed #6b7280;
        outline-offset: -1px;
      }
    </style>
    <label for="select-parts-trigger" style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.375rem; color:var(--lf-color-label, #374151)">
      Country (click to open)
    </label>
    <lf-select
      id="select-parts"
      field-id="select-parts-trigger"
      name="country"
      placeholder="Select a country…"
      .options=${COUNTRIES}
      style="width: min(22rem, 100%)"
    ></lf-select>
    <ul style="font-size:0.75rem; color:var(--lf-color-hint, #6b7280); margin:0.75rem 0 0; padding-left:1.25rem; display:grid; gap:0.25rem">
      <li><code style="color:#7c3aed">::part(trigger)</code> — the trigger button</li>
      <li><code style="color:#059669">::part(value)</code> — the displayed value / placeholder text</li>
      <li><code style="color:#d97706">::part(icon)</code> — the chevron icon</li>
      <li><code style="color:#2563eb">::part(listbox)</code> — the popup listbox (open to see)</li>
      <li><code style="color:var(--lf-color-hint, #6b7280)">::part(option)</code> — each option row (open to see)</li>
    </ul>
  `,
}
