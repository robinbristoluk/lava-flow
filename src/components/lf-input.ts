import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../styles/lf-input.scss?inline'
import type { LfAllFormProps, LfInputMode, LfInputType } from '../types/form-field'

type LfInputPickedProps = Pick<
  LfAllFormProps,
  | 'fieldId'
  | 'name'
  | 'value'
  | 'type'
  | 'placeholder'
  | 'required'
  | 'disabled'
  | 'readonly'
  | 'autocomplete'
  | 'minLength'
  | 'maxLength'
  | 'inputMode'
  | 'error'
>

/**
 * Accessible, form-associated text input web component.
 *
 * Set `field-id` to match a `<lf-label field-id="...">` in the same DOM scope.
 * Set `error` to a non-empty string to show the field in its invalid visual state.
 *
 * @fires lf-input - Fired on every keystroke; `detail.value` holds the current value.
 * @fires lf-change - Fired when the value is committed (blur / Enter); `detail.value` holds the value.
 * @csspart input - The native `<input>` element.
 * @cssprop [--lf-color-input-bg=#ffffff] - Input background.
 * @cssprop [--lf-color-input-text=#111827] - Input text colour.
 * @cssprop [--lf-color-input-border=#d1d5db] - Default border colour.
 * @cssprop [--lf-color-input-border-focus=#5b21b6] - Border colour on focus.
 * @cssprop [--lf-color-input-placeholder=#9ca3af] - Placeholder text colour.
 * @cssprop [--lf-color-input-disabled-bg=#f3f4f6] - Background when disabled.
 * @cssprop [--lf-color-input-disabled-text=#9ca3af] - Text colour when disabled.
 * @cssprop [--lf-color-error=#dc2626] - Border colour when in the error state.
 * @cssprop [--lf-color-focus-ring=#7c3aed] - Focus ring colour.
 * @cssprop [--lf-radius-md=0.625rem] - Input corner radius.
 * @cssprop [--lf-font-family-base=system-ui] - Input font family.
 * @cssprop [--lf-font-size-base=1rem] - Input font size.
 * @cssprop [--lf-space-3=0.625rem] - Input block padding.
 * @cssprop [--lf-space-4=1rem] - Input inline padding.
 */
@customElement('lf-input')
export class LfInput extends LitElement implements LfInputPickedProps {
  static readonly formAssociated = true

  private readonly internals: ElementInternals

  constructor() {
    super()
    this.internals = this.attachInternals()
  }

  /** id forwarded to the inner `<input>` element */
  @property({ type: String, attribute: 'field-id' })
  fieldId = ''

  /** name submitted with form data */
  @property({ type: String })
  name = ''

  /** current field value */
  @property({ type: String })
  value = ''

  /** HTML input type */
  @property({ type: String })
  type: LfInputType = 'text'

  /** placeholder text */
  @property({ type: String })
  placeholder = ''

  /** marks the field as required */
  @property({ type: Boolean, reflect: true })
  required = false

  /** disables the field */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /** makes the field read-only */
  @property({ type: Boolean, reflect: true })
  readonly = false

  /** browser autocomplete hint */
  @property({ type: String })
  autocomplete = ''

  /** minimum number of characters */
  @property({ type: Number, attribute: 'min-length' })
  minLength = 0

  /** maximum number of characters */
  @property({ type: Number, attribute: 'max-length' })
  maxLength = 0

  /** virtual keyboard hint */
  @property({ type: String, attribute: 'inputmode' })
  override inputMode: LfInputMode = 'text'

  /** validation error message; non-empty string triggers the invalid visual state */
  @property({ type: String })
  error = ''

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('required')) {
      this.syncFormValue()
    }
    if (changed.has('error')) {
      this.toggleAttribute('data-invalid', this.error.length > 0)
    }
  }

  private syncFormValue(): void {
    this.internals.setFormValue(this.value)
    if (this.required && this.value.length === 0) {
      this.internals.setValidity({ valueMissing: true }, 'Please fill out this field.')
    } else {
      this.internals.setValidity({})
    }
  }

  private readonly onNativeInput = (e: Event): void => {
    const input = e.target as HTMLInputElement
    this.value = input.value
    this.dispatchEvent(
      new CustomEvent('lf-input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    )
  }

  private readonly onNativeChange = (e: Event): void => {
    const input = e.target as HTMLInputElement
    this.value = input.value
    this.dispatchEvent(
      new CustomEvent('lf-change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    )
  }

  override render() {
    return html`
      <input
        part="input"
        class="input"
        id=${this.fieldId || nothing}
        name=${this.name || nothing}
        type=${this.type}
        .value=${this.value}
        placeholder=${this.placeholder || nothing}
        ?required=${this.required}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        autocomplete=${this.autocomplete || nothing}
        minlength=${this.minLength > 0 ? this.minLength : nothing}
        maxlength=${this.maxLength > 0 ? this.maxLength : nothing}
        inputmode=${this.inputMode}
        @input=${this.onNativeInput}
        @change=${this.onNativeChange}
      />
    `
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-input': LfInput
  }
}
