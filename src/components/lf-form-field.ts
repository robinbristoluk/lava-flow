import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from '../styles/lf-form-field.scss?inline'
import type { LfAllFormProps, LfInputMode, LfInputType, LfTextareaResize } from '../types/form-field'

let idCounter = 0

/**
 * Composite form field component. Renders a label, input (or textarea), and optional hint and error
 * message all inside a single shadow root, providing a fully accessible field with
 * proper `<label for>` association.
 *
 * Set `multiline` to render a `<textarea>` instead of a single-line `<input>`.
 *
 * If `hint` is not set (empty string) the hint element is not rendered.
 * If `error` is not set (empty string) the error element is not rendered.
 *
 * The component is form-associated: its `name` + `value` participate in
 * `<form>` submission and the native constraint-validation API.
 *
 * @fires lf-change - Fired when the value changes; `detail.value` holds the value.
 * @csspart field - Outer wrapper `<div>`.
 * @csspart label - The `<label>` element.
 * @csspart input - The `<input>` or `<textarea>` element.
 * @csspart hint - The hint `<span>` (only present when `hint` is set).
 * @csspart error - The error `<span>` (only present when `error` is set).
 * @cssprop [--lf-color-label=#374151] - Label text colour.
 * @cssprop [--lf-color-hint=#6b7280] - Hint text colour.
 * @cssprop [--lf-color-error=#dc2626] - Error text and border colour.
 * @cssprop [--lf-color-input-bg=#ffffff] - Input background.
 * @cssprop [--lf-color-input-text=#111827] - Input text colour.
 * @cssprop [--lf-color-input-border=#d1d5db] - Default input border.
 * @cssprop [--lf-color-input-border-focus=#5b21b6] - Input border on focus.
 * @cssprop [--lf-color-input-placeholder=#9ca3af] - Placeholder colour.
 * @cssprop [--lf-color-input-disabled-bg=#f3f4f6] - Background when disabled.
 * @cssprop [--lf-color-input-disabled-text=#9ca3af] - Text colour when disabled.
 * @cssprop [--lf-color-focus-ring=#7c3aed] - Focus ring colour.
 * @cssprop [--lf-radius-md=0.625rem] - Input corner radius.
 * @cssprop [--lf-font-family-base=system-ui] - Font family.
 * @cssprop [--lf-font-size-base=1rem] - Input font size.
 * @cssprop [--lf-font-size-sm=0.875rem] - Label / hint / error font size.
 * @cssprop [--lf-font-weight-semibold=600] - Label font weight.
 * @cssprop [--lf-space-2=0.5rem] - Gap between field rows.
 * @cssprop [--lf-space-3=0.625rem] - Input block padding.
 * @cssprop [--lf-space-4=1rem] - Input inline padding.
 * @cssprop [--lf-textarea-resize=vertical] - Resize behaviour when `multiline` is set (none | horizontal | vertical | both).
 */
@customElement('lf-form-field')
export class LfFormField extends LitElement implements LfAllFormProps {
  static readonly formAssociated = true

  private readonly internals: ElementInternals
  private readonly inputId: string

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.inputId = `lf-field-${++idCounter}`
  }

  /** name submitted with form data */
  @property({ type: String })
  name = ''

  /** visible label text */
  @property({ type: String })
  label = ''

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

  /** helper text — omit or leave empty to suppress the hint element */
  @property({ type: String })
  hint = ''

  /** validation error message — omit or leave empty to suppress the error element */
  @property({ type: String })
  error = ''

  /** minimum number of characters */
  @property({ type: Number, attribute: 'min-length' })
  minLength = 0

  /** maximum number of characters */
  @property({ type: Number, attribute: 'max-length' })
  maxLength = 0

  /** virtual keyboard hint */
  @property({ type: String, attribute: 'inputmode' })
  override inputMode: LfInputMode = 'text'

  /**
   * Not used directly on lf-form-field — the inner `<input>` is identified
   * automatically. Satisfies the `LfAllFormProps` interface.
   */
  @property({ type: String, attribute: 'field-id' })
  fieldId = ''

  /** render a `<textarea>` instead of a single-line `<input>` */
  @property({ type: Boolean, reflect: true })
  multiline = false

  /** number of visible text rows (only used when `multiline` is set) */
  @property({ type: Number })
  rows = 4

  /** resize behaviour (only used when `multiline` is set) */
  @property({ type: String })
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

  private readonly onNativeChange = (e: Event): void => {
    const input = e.target as HTMLInputElement | HTMLTextAreaElement
    this.value = input.value
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
    const errorId = `${this.inputId}-error`
    const hintId = `${this.inputId}-hint`
    const ariaDescribedBy =
      [this.hint ? hintId : '', this.error ? errorId : ''].filter(Boolean).join(' ') || nothing
    const ariaInvalid =
      this.error || (this._touched && !this.internals.validity.valid) ? 'true' : nothing

    return html`
      <div class="field" part="field">
        <label class="label" part="label" for=${this.inputId}>${this.label}</label>
        ${this.multiline
          ? html`<textarea
              class="input"
              part="input"
              id=${this.inputId}
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
              aria-describedby=${ariaDescribedBy}
              aria-invalid=${ariaInvalid}
              @input=${this.onNativeChange}
              @change=${this.onNativeChange}
              @blur=${this.onNativeBlur}
            ></textarea>`
          : html`<input
              class="input"
              part="input"
              id=${this.inputId}
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
              aria-describedby=${ariaDescribedBy}
              aria-invalid=${ariaInvalid}
              @input=${this.onNativeChange}
              @change=${this.onNativeChange}
              @blur=${this.onNativeBlur}
            />`}
        ${this.hint
          ? html`<span class="hint" part="hint" id=${hintId} role="note">${this.hint}</span>`
          : nothing}
        ${this.error
          ? html`<span class="error" part="error" id=${errorId} role="alert">${this.error}</span>`
          : nothing}
      </div>
    `
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-form-field': LfFormField
  }
}
