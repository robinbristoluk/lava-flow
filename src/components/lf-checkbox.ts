import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from '../styles/lf-checkbox.scss?inline'

let idCounter = 0

/**
 * Accessible, form-associated single checkbox web component.
 *
 * Use this for boolean fields such as "I agree to the terms" or any
 * standalone opt-in/opt-out control. For selecting from a list of options,
 * use `lf-checkbox-group` instead.
 *
 * Set `field-id` to match a `<lf-label field-id="...">` in the same DOM scope,
 * or leave it unset to use the auto-generated id.
 *
 * @fires lf-change - Fired when the checked state changes; `detail.checked` and `detail.value`.
 * @csspart option - The `<label>` wrapper element.
 * @csspart input - The visually-hidden native `<input>` element.
 * @csspart mark - The custom checkbox indicator `<span>`.
 * @csspart label - The label text `<span>`.
 * @cssprop [--lf-checkbox-size=1.125rem] - Size (width/height) of the custom checkbox indicator.
 * @cssprop [--lf-color-primary=#5b21b6] - Checked checkbox fill colour.
 * @cssprop [--lf-color-on-primary=#ffffff] - Checkmark icon colour.
 * @cssprop [--lf-color-input-bg=#ffffff] - Checkbox background colour.
 * @cssprop [--lf-color-input-border=#d1d5db] - Checkbox border colour.
 * @cssprop [--lf-color-input-border-focus=#5b21b6] - Checkbox border colour on focus.
 * @cssprop [--lf-color-input-text=#111827] - Label text colour.
 * @cssprop [--lf-color-error=#dc2626] - Border colour when in the error state.
 * @cssprop [--lf-color-focus-ring=#7c3aed] - Focus ring colour.
 * @cssprop [--lf-radius-sm=0.25rem] - Checkbox corner radius.
 * @cssprop [--lf-font-family-base=system-ui] - Font family.
 * @cssprop [--lf-font-size-base=1rem] - Label font size.
 * @cssprop [--lf-space-2=0.5rem] - Gap between indicator and label.
 */
@customElement('lf-checkbox')
export class LfCheckbox extends LitElement {
  static readonly formAssociated = true

  private readonly internals: ElementInternals
  private readonly inputId: string

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.inputId = `lf-checkbox-${++idCounter}`
  }

  /** id forwarded to the inner `<input>` element */
  @property({ type: String, attribute: 'field-id' })
  fieldId = ''

  /** name submitted with form data */
  @property({ type: String })
  name = ''

  /** value submitted when the checkbox is checked (defaults to `"on"`) */
  @property({ type: String })
  value = 'on'

  /** whether the checkbox is checked */
  @property({ type: Boolean, reflect: true })
  checked = false

  /** visible label text rendered next to the checkbox */
  @property({ type: String })
  label = ''

  /** marks the checkbox as required */
  @property({ type: Boolean, reflect: true })
  required = false

  /** disables the checkbox */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /** validation error message — non-empty triggers the invalid state */
  @property({ type: String })
  error = ''

  @state() private _touched = false

  override updated(changed: Map<string, unknown>) {
    if (changed.has('checked') || changed.has('value') || changed.has('required')) {
      this.syncFormValue()
    }
    this.updateInvalidState()
  }

  private syncFormValue(): void {
    this.internals.setFormValue(this.checked ? this.value : null)
    if (this.required && !this.checked) {
      this.internals.setValidity({ valueMissing: true }, 'Please check this box.')
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
    const input = e.target as HTMLInputElement
    this.checked = input.checked
    this._touched = true
    this.dispatchEvent(
      new CustomEvent('lf-change', {
        bubbles: true,
        composed: true,
        detail: { checked: this.checked, value: this.checked ? this.value : null },
      }),
    )
  }

  private readonly onNativeBlur = (): void => {
    this._touched = true
  }

  override render() {
    const id = this.fieldId || this.inputId

    return html`
      <label class="option" part="option">
        <input
          class="option__native"
          part="input"
          type="checkbox"
          id=${id}
          name=${this.name || nothing}
          value=${this.value}
          .checked=${this.checked}
          ?required=${this.required}
          ?disabled=${this.disabled}
          @change=${this.onNativeChange}
          @blur=${this.onNativeBlur}
        />
        <span class="option__mark" part="mark" aria-hidden="true"></span>
        ${this.label
          ? html`<span class="option__label" part="label">${this.label}</span>`
          : nothing}
      </label>
    `
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-checkbox': LfCheckbox
  }
}
