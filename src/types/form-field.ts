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
}
