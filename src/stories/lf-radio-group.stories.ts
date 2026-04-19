import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-radio-group'

const OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

const meta: Meta = {
  title: 'Form/LfRadioGroup',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta

type RadioStory = StoryObj<{
  label: string
  name: string
  value: string
  hint: string
  error: string
  required: boolean
  disabled: boolean
}>

export const Default: RadioStory = {
  args: {
    label: 'Shirt size',
    name: 'size',
    value: '',
    hint: 'Choose the size that fits you best.',
    error: '',
    required: false,
    disabled: false,
  },
  render: (args) => html`
    <lf-radio-group
      label=${args.label}
      name=${args.name}
      .value=${args.value ?? ''}
      hint=${args.hint ?? ''}
      error=${args.error ?? ''}
      ?required=${args.required}
      ?disabled=${args.disabled}
      .options=${OPTIONS}
      style="width: min(24rem, 100%)"
    ></lf-radio-group>
  `,
}

export const WithSelectedValue: RadioStory = {
  name: 'Pre-selected value',
  render: () => html`
    <lf-radio-group
      label="Shirt size"
      name="size"
      .value=${'medium'}
      .options=${OPTIONS}
      style="width: min(24rem, 100%)"
    ></lf-radio-group>
  `,
}

export const WithError: RadioStory = {
  name: 'With error',
  render: () => html`
    <lf-radio-group
      label="Shirt size"
      name="size"
      error="Please select a size."
      required
      .options=${OPTIONS}
      style="width: min(24rem, 100%)"
    ></lf-radio-group>
  `,
}

export const Disabled: RadioStory = {
  name: 'Disabled',
  render: () => html`
    <lf-radio-group
      label="Shirt size"
      name="size"
      disabled
      .value=${'small'}
      .options=${OPTIONS}
      style="width: min(24rem, 100%)"
    ></lf-radio-group>
  `,
}

export const PartiallyDisabled: RadioStory = {
  name: 'Partially disabled options',
  render: () => html`
    <lf-radio-group
      label="Shirt size"
      name="size"
      .options=${[
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium (sold out)', disabled: true },
        { value: 'large', label: 'Large' },
      ]}
      style="width: min(24rem, 100%)"
    ></lf-radio-group>
  `,
}

export const WithinAForm: RadioStory = {
  name: 'Within a <form>',
  render: () => html`
    <form
      style="display:grid; gap:1rem; width:min(24rem, 100%)"
      @submit=${(e: Event) => {
        e.preventDefault()
        alert('Submitted: ' + JSON.stringify(Object.fromEntries(new FormData(e.target as HTMLFormElement))))
      }}
    >
      <lf-radio-group
        label="Shirt size"
        name="size"
        hint="Choose the size that fits you best."
        required
        .options=${OPTIONS}
      ></lf-radio-group>
      <button type="submit" style="padding:0.625rem 1rem; cursor:pointer">Submit</button>
    </form>
  `,
}
