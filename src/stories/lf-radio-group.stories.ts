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
  render: (args) => {
    const el = document.createElement('lf-radio-group')
    el.setAttribute('label', args.label)
    el.setAttribute('name', args.name)
    el.value = args.value ?? ''
    el.hint = args.hint ?? ''
    el.error = args.error ?? ''
    el.required = args.required ?? false
    el.disabled = args.disabled ?? false
    el.options = OPTIONS
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
}

export const WithSelectedValue: RadioStory = {
  name: 'Pre-selected value',
  render: () => {
    const el = document.createElement('lf-radio-group')
    el.label = 'Shirt size'
    el.name = 'size'
    el.value = 'medium'
    el.options = OPTIONS
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
}

export const WithError: RadioStory = {
  name: 'With error',
  render: () => {
    const el = document.createElement('lf-radio-group')
    el.label = 'Shirt size'
    el.name = 'size'
    el.error = 'Please select a size.'
    el.required = true
    el.options = OPTIONS
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
}

export const Disabled: RadioStory = {
  name: 'Disabled',
  render: () => {
    const el = document.createElement('lf-radio-group')
    el.label = 'Shirt size'
    el.name = 'size'
    el.disabled = true
    el.value = 'small'
    el.options = OPTIONS
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
}

export const PartiallyDisabled: RadioStory = {
  name: 'Partially disabled options',
  render: () => {
    const el = document.createElement('lf-radio-group')
    el.label = 'Shirt size'
    el.name = 'size'
    el.options = [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium (sold out)', disabled: true },
      { value: 'large', label: 'Large' },
    ]
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
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
