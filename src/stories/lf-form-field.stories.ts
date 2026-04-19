import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-form-field'

const meta: Meta = {
  title: 'Form/LfFormField',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'url', 'password', 'search', 'number'],
    },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
}

export default meta

type FieldStory = StoryObj<{
  label: string
  name: string
  type: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search' | 'number'
  placeholder: string
  hint: string
  error: string
  required: boolean
  disabled: boolean
  readonly: boolean
}>

export const Default: FieldStory = {
  args: {
    label: 'Email address',
    name: 'email',
    type: 'email',
    placeholder: 'you@example.com',
    hint: "We'll never share your email.",
    error: '',
    required: false,
    disabled: false,
    readonly: false,
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      type=${args.type}
      placeholder=${args.placeholder}
      hint=${args.hint}
      error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

export const WithError: FieldStory = {
  args: {
    ...Default.args,
    label: 'Email address',
    placeholder: '',
    hint: '',
    error: 'Enter a valid email address.',
    required: true,
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      type=${args.type}
      placeholder=${args.placeholder}
      hint=${args.hint}
      error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

export const Disabled: FieldStory = {
  args: {
    ...Default.args,
    label: 'Full name',
    name: 'fullname',
    type: 'text',
    placeholder: 'John Smith',
    hint: '',
    disabled: true,
  },
  render: (args) => html`
    <lf-form-field
      label=${args.label}
      name=${args.name}
      type=${args.type}
      placeholder=${args.placeholder}
      hint=${args.hint}
      error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      style="width: min(24rem, 100%)"
    ></lf-form-field>
  `,
}

export const WithinAForm: FieldStory = {
  name: 'Within a <form>',
  args: {
    ...Default.args,
    label: 'Your message',
    name: 'message',
    type: 'text',
    placeholder: 'Type here\u2026',
    hint: 'Max 280 characters.',
  },
  render: (args) => html`
    <form
      style="display:grid; gap:1rem; width:min(24rem, 100%)"
      @submit=${(e: Event) => {
        e.preventDefault()
        alert('Submitted: ' + JSON.stringify(Object.fromEntries(new FormData(e.target as HTMLFormElement))))
      }}
    >
      <lf-form-field
        label=${args.label}
        name=${args.name}
        type=${args.type}
        placeholder=${args.placeholder}
        hint=${args.hint}
        error=${args.error}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
      ></lf-form-field>
      <button type="submit" style="padding:0.625rem 1rem; cursor:pointer">Submit</button>
    </form>
  `,
}
