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
  render: (args) => {
    const el = document.createElement('lf-checkbox-group')
    el.label = args.label
    el.name = args.name
    el.hint = args.hint ?? ''
    el.error = args.error ?? ''
    el.required = args.required ?? false
    el.disabled = args.disabled ?? false
    el.options = OPTIONS
    el.value = []
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
}

export const WithSelectedValues: CheckboxGroupStory = {
  name: 'Pre-selected values',
  render: () => {
    const el = document.createElement('lf-checkbox-group')
    el.label = 'Favourite technologies'
    el.name = 'tech'
    el.value = ['html', 'css']
    el.options = OPTIONS
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
}

export const WithError: CheckboxGroupStory = {
  name: 'With error',
  render: () => {
    const el = document.createElement('lf-checkbox-group')
    el.label = 'Favourite technologies'
    el.name = 'tech'
    el.error = 'Please select at least one option.'
    el.required = true
    el.options = OPTIONS
    el.value = []
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
}

export const Disabled: CheckboxGroupStory = {
  name: 'Disabled',
  render: () => {
    const el = document.createElement('lf-checkbox-group')
    el.label = 'Favourite technologies'
    el.name = 'tech'
    el.disabled = true
    el.value = ['css']
    el.options = OPTIONS
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
}

export const PartiallyDisabled: CheckboxGroupStory = {
  name: 'Partially disabled options',
  render: () => {
    const el = document.createElement('lf-checkbox-group')
    el.label = 'Favourite technologies'
    el.name = 'tech'
    el.options = [
      { value: 'html', label: 'HTML' },
      { value: 'css', label: 'CSS (unavailable)', disabled: true },
      { value: 'js', label: 'JavaScript' },
      { value: 'ts', label: 'TypeScript' },
    ]
    el.value = []
    el.style.cssText = 'width: min(24rem, 100%)'
    return el
  },
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
