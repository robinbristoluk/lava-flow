import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from '../styles/lf-textarea.scss?inline'
import type { LfAllFormProps, LfTextareaResize } from '../types/form-field'

type LfTextareaPickedProps = Pick<
  LfAllFormProps,
  | 'fieldId'
  | 'name'
  | 'value'
  | 'placeholder'
  | 'required'
  | 'disabled'
  | 'readonly'
  | 'autocomplete'
  | 'minLength'
  | 'maxLength'
  | 'error'
  | 'rows'
  | 'resize'
>

/**
 * Accessible, form-associated multi-line text area web component.
 *
 * Set `field-id` to match a `<lf-label field-id="...">` in the same DOM scope.
 * Set `error` to a non-empty string to show the field in its invalid visual state.
 * The field also enters the invalid state automatically when native constraint
 * validation fails (e.g. `required` + empty value, `min-length` too short) once
 * the user has interacted with the field.
 *
 * @fires lf-input - Fired on every keystroke; `detail.value` holds the current value.
 * @fires lf-change - Fired when the value is committed (blur / Enter); `detail.value` holds the value.
 * @csspart textarea - The native `<textarea>` element.
 * @cssprop [--lf-color-input-bg=#ffffff] - Textarea background.
 * @cssprop [--lf-color-input-text=#111827] - Textarea text colour.
 * @cssprop [--lf-color-input-border=#d1d5db] - Default border colour.
 * @cssprop [--lf-color-input-border-focus=#5b21b6] - Border colour on focus.
 * @cssprop [--lf-color-input-placeholder=#9ca3af] - Placeholder text colour.
 * @cssprop [--lf-color-input-disabled-bg=#f3f4f6] - Background when disabled.
 * @cssprop [--lf-color-input-disabled-text=#9ca3af] - Text colour when disabled.
 * @cssprop [--lf-color-error=#dc2626] - Border colour when in the error state.
 * @cssprop [--lf-color-focus-ring=#7c3aed] - Focus ring colour.
 * @cssprop [--lf-radius-md=0.625rem] - Textarea corner radius.
 * @cssprop [--lf-font-family-base=system-ui] - Textarea font family.
 * @cssprop [--lf-font-size-base=1rem] - Textarea font size.
 * @cssprop [--lf-space-3=0.625rem] - Textarea block padding.
 * @cssprop [--lf-space-4=1rem] - Textarea inline padding.
 * @cssprop [--lf-textarea-resize=vertical] - Resize behaviour (none | horizontal | vertical | both).
 */
@customElement('lf-textarea')
export class LfTextarea extends LitElement implements LfTextareaPickedProps {
  static readonly formAssociated = true

  private readonly internals: ElementInternals

  constructor() {
    super()
    this.internals = this.attachInternals()
  }

  /** id forwarded to the inner `<textarea>` element */
  @property({ type: String, attribute: 'field-id' })
  fieldId = ''

  /** name submitted with form data */
  @property({ type: String })
  name = ''

  /** current field value */
  @property({ type: String })
  value = ''

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

  /** validation error message; non-empty string triggers the invalid visual state */
  @property({ type: String })
  error = ''

  /** number of visible text rows */
  @property({ type: Number })
  rows = 4

  /** resize behaviour */
  @property({ type: String, reflect: true })
  resize: LfTextareaResize = 'vertical'

  /** whether the user has interacted with the field (blur or input event) */
  @state() private _touched = false

  override updated(changed: Map<string, unknown>) {
    if (
      changed.has('value') ||
      changed.has('required') ||
      changed.has('minLength') ||
      changed.has('maxLength')
    ) {
      this.syncFormValue()
    }
    if (changed.has('resize')) {
      this.style.setProperty('--lf-textarea-resize', this.resize)
    }
    this.updateInvalidState()
  }

  private syncFormValue(): void {
    this.internals.setFormValue(this.value)
    if (this.required && this.value.length === 0) {
      this.internals.setValidity({ valueMissing: true }, 'Please fill out this field.')
    } else if (this.minLength > 0 && this.value.length > 0 && this.value.length < this.minLength) {
      this.internals.setValidity(
        { tooShort: true },
        `Please lengthen this text to ${this.minLength} characters or more.`,
      )
    } else if (this.maxLength > 0 && this.value.length > this.maxLength) {
      this.internals.setValidity(
        { tooLong: true },
        `Please shorten this text to ${this.maxLength} characters or fewer.`,
      )
    } else {
      this.internals.setValidity({})
    }
  }

  private updateInvalidState(): void {
    this.toggleAttribute(
      'data-invalid',
      this.error.length > 0 || (this._touched && !this.internals.validity.valid),
    )
  }

  private readonly onNativeInput = (e: Event): void => {
    const textarea = e.target as HTMLTextAreaElement
    this.value = textarea.value
    this._touched = true
    this.dispatchEvent(
      new CustomEvent('lf-input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    )
  }

  private readonly onNativeChange = (e: Event): void => {
    const textarea = e.target as HTMLTextAreaElement
    this.value = textarea.value
    this._touched = true
    this.dispatchEvent(
      new CustomEvent('lf-change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    )
  }

  private readonly onNativeBlur = (): void => {
    this._touched = true
  }

  override render() {
    return html`
      <textarea
        part="textarea"
        class="textarea"
        id=${this.fieldId || nothing}
        name=${this.name || nothing}
        .value=${this.value}
        placeholder=${this.placeholder || nothing}
        ?required=${this.required}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        autocomplete=${this.autocomplete || nothing}
        minlength=${this.minLength > 0 ? this.minLength : nothing}
        maxlength=${this.maxLength > 0 ? this.maxLength : nothing}
        rows=${this.rows}
        @input=${this.onNativeInput}
        @change=${this.onNativeChange}
        @blur=${this.onNativeBlur}
      ></textarea>
    `
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-textarea': LfTextarea
  }
}
