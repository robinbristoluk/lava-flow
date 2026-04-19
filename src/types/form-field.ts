export type LfTextareaResize = 'none' | 'horizontal' | 'vertical' | 'both'

/** A single option in a radio-group or checkbox-group. */
export interface LfOption {
  /** The value submitted with the form. */
  value: string
  /** The visible label text for this option. */
  label: string
  /** When `true` this option cannot be interacted with. */
  disabled?: boolean
}

export type LfInputType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'password'
  | 'search'
  | 'number'

export type LfInputMode =
  | 'none'
  | 'text'
  | 'decimal'
  | 'numeric'
  | 'tel'
  | 'search'
  | 'email'
  | 'url'

/** A single option in a select control. */
export interface LfSelectOption {
  /** Display label shown to the user. */
  label: string
  /** Value submitted with form data. */
  value: string
  /** Prevents the option from being selected when true. */
  disabled?: boolean
}

/** A labelled group of options in a select control. */
export interface LfSelectOptionGroup {
  /** Heading text rendered above the group. */
  group: string
  /** Options belonging to this group. */
  options: LfSelectOption[]
}

/** Either a standalone option or a labelled group of options. */
export type LfSelectOptionItem = LfSelectOption | LfSelectOptionGroup

/**
 * Full set of properties shared across lava-flow form components.
 * Each component implements a `Pick<LfAllFormProps, ...>` of the
 * properties it actually uses, ensuring the minimal relevant API surface
 * is exposed on each element.
 */
export interface LfAllFormProps {
  /** id forwarded to the inner `<input>` element */
  fieldId: string
  /** name submitted with form data */
  name: string
  /** visible label text */
  label: string
  /** current field value */
  value: string
  /** HTML input type */
  type: LfInputType
  /** placeholder text shown when the field is empty */
  placeholder: string
  /** marks the field as required for form validation */
  required: boolean
  /** disables the field */
  disabled: boolean
  /** makes the field read-only */
  readonly: boolean
  /** browser autocomplete hint */
  autocomplete: string
  /** helper text shown below the input */
  hint: string
  /** validation error message; empty string means no error */
  error: string
  /** minimum number of characters */
  minLength: number
  /** maximum number of characters */
  maxLength: number
  /** virtual keyboard hint for mobile */
  inputMode: LfInputMode
  /** number of visible text rows (textarea only) */
  rows: number
  /** resize behaviour (textarea only) */
  resize: LfTextareaResize
  /** options rendered by a select control */
  options: LfSelectOptionItem[]
}
