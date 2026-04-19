import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-checkbox-group'

const OPTIONS = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
]

const meta: Meta = {
  title: 'Form/LfCheckboxGroup',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta

type CheckboxGroupStory = StoryObj<{
  label: string
  name: string
  hint: string
  error: string
  required: boolean
  disabled: boolean
}>

export const Default: CheckboxGroupStory = {
  args: {
    label: 'Favourite technologies',
    name: 'tech',
    hint: 'Select all that apply.',
    error: '',
    required: false,
    disabled: false,
  },
  render: (args) => html`
    <lf-checkbox-group
      label=${args.label}
      name=${args.name}
      hint=${args.hint ?? ''}
      error=${args.error ?? ''}
      ?required=${args.required}
      ?disabled=${args.disabled}
      .options=${OPTIONS}
      .value=${[]}
      style="width: min(24rem, 100%)"
    ></lf-checkbox-group>
  `,
}

export const WithSelectedValues: CheckboxGroupStory = {
  name: 'Pre-selected values',
  render: () => html`
    <lf-checkbox-group
      label="Favourite technologies"
      name="tech"
      .value=${['html', 'css']}
      .options=${OPTIONS}
      style="width: min(24rem, 100%)"
    ></lf-checkbox-group>
  `,
}

export const WithError: CheckboxGroupStory = {
  name: 'With error',
  render: () => html`
    <lf-checkbox-group
      label="Favourite technologies"
      name="tech"
      error="Please select at least one option."
      required
      .options=${OPTIONS}
      .value=${[]}
      style="width: min(24rem, 100%)"
    ></lf-checkbox-group>
  `,
}

export const Disabled: CheckboxGroupStory = {
  name: 'Disabled',
  render: () => html`
    <lf-checkbox-group
      label="Favourite technologies"
      name="tech"
      disabled
      .value=${['css']}
      .options=${OPTIONS}
      style="width: min(24rem, 100%)"
    ></lf-checkbox-group>
  `,
}

export const PartiallyDisabled: CheckboxGroupStory = {
  name: 'Partially disabled options',
  render: () => html`
    <lf-checkbox-group
      label="Favourite technologies"
      name="tech"
      .options=${[
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS (unavailable)', disabled: true },
        { value: 'js', label: 'JavaScript' },
        { value: 'ts', label: 'TypeScript' },
      ]}
      .value=${[]}
      style="width: min(24rem, 100%)"
    ></lf-checkbox-group>
  `,
}

export const WithinAForm: CheckboxGroupStory = {
  name: 'Within a <form>',
  render: () => html`
    <form
      style="display:grid; gap:1rem; width:min(24rem, 100%)"
      @submit=${(e: Event) => {
        e.preventDefault()
        const data = new FormData(e.target as HTMLFormElement)
        alert('Submitted: ' + JSON.stringify(Object.fromEntries(data)))
      }}
    >
      <lf-checkbox-group
        label="Favourite technologies"
        name="tech"
        hint="Select all that apply."
        required
        .options=${OPTIONS}
        .value=${[]}
      ></lf-checkbox-group>
      <button type="submit" style="padding:0.625rem 1rem; cursor:pointer">Submit</button>
    </form>
  `,
}
