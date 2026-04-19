import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from '../styles/lf-radio-group.scss?inline'
import type { LfOption } from '../types/form-field'

let idCounter = 0

/**
 * Accessible, form-associated radio-group web component for single-selection
 * from a list of options.
 *
 * Pass options via the `options` JavaScript property (or a JSON-encoded
 * `options` attribute). Each item must have `value` and `label` fields, and
 * may include an optional `disabled` flag.
 *
 * The selected value is submitted with the form under the element's `name`.
 *
 * @fires lf-change - Fired when the selected value changes; `detail.value` holds the new value.
 * @csspart group - The `<fieldset>` wrapper element.
 * @csspart legend - The `<legend>` element (group label).
 * @csspart options - Container `<div>` for the option rows.
 * @csspart option - Each individual option row `<label>`.
 * @csspart hint - The hint `<span>` (only present when `hint` is set).
 * @csspart error - The error `<span>` (only present when `error` is set).
 * @cssprop [--lf-radio-size=1.125rem] - Size (width/height) of the custom radio indicator.
 * @cssprop [--lf-color-primary=#5b21b6] - Colour of the selected radio indicator.
 * @cssprop [--lf-color-input-bg=#ffffff] - Radio background colour.
 * @cssprop [--lf-color-input-border=#d1d5db] - Radio border colour.
 * @cssprop [--lf-color-input-border-focus=#5b21b6] - Radio border colour on focus.
 * @cssprop [--lf-color-input-text=#111827] - Option label text colour.
 * @cssprop [--lf-color-label=#374151] - Group legend text colour.
 * @cssprop [--lf-color-hint=#6b7280] - Hint text colour.
 * @cssprop [--lf-color-error=#dc2626] - Error text and border colour.
 * @cssprop [--lf-color-focus-ring=#7c3aed] - Focus ring colour.
 * @cssprop [--lf-font-family-base=system-ui] - Font family.
 * @cssprop [--lf-font-size-base=1rem] - Option label font size.
 * @cssprop [--lf-font-size-sm=0.875rem] - Legend / hint / error font size.
 * @cssprop [--lf-font-weight-semibold=600] - Legend font weight.
 * @cssprop [--lf-space-2=0.5rem] - Gap between rows and between indicator and label.
 */
@customElement('lf-radio-group')
export class LfRadioGroup extends LitElement {
  static readonly formAssociated = true

  private readonly internals: ElementInternals
  private readonly groupId: string

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.groupId = `lf-radio-${++idCounter}`
  }

  /** name submitted with form data */
  @property({ type: String })
  name = ''

  /** currently selected value */
  @property({ type: String })
  value = ''

  /** visible legend text for the group */
  @property({ type: String })
  label = ''

  /** array of selectable options */
  @property({ type: Array })
  options: LfOption[] = []

  /** marks the group as required — at least one option must be selected */
  @property({ type: Boolean, reflect: true })
  required = false

  /** disables the entire group */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /** helper text — leave empty to suppress */
  @property({ type: String })
  hint = ''

  /** validation error message — non-empty triggers the invalid state */
  @property({ type: String })
  error = ''

  @state() private _touched = false

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('required')) {
      this.syncFormValue()
    }
    this.updateInvalidState()
  }

  private syncFormValue(): void {
    this.internals.setFormValue(this.value || null)
    if (this.required && !this.value) {
      this.internals.setValidity({ valueMissing: true }, 'Please select an option.')
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
    this.value = input.value
    this._touched = true
    this.dispatchEvent(
      new CustomEvent('lf-change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    )
  }

  private readonly onNativeBlur = (): void => {
    this._touched = true
  }

  override render() {
    const errorId = `${this.groupId}-error`
    const hintId = `${this.groupId}-hint`
    const ariaDescribedBy =
      [this.hint ? hintId : '', this.error ? errorId : ''].filter(Boolean).join(' ') || nothing

    return html`
      <fieldset
        class="group"
        part="group"
        aria-describedby=${ariaDescribedBy}
        aria-required=${this.required ? 'true' : nothing}
        ?disabled=${this.disabled}
      >
        ${this.label ? html`<legend class="legend" part="legend">${this.label}</legend>` : nothing}
        <div class="options" part="options" role="radiogroup">
          ${this.options.map(
            (opt) => html`
              <label
                class="option${opt.disabled ? ' option--disabled' : ''}"
                part="option"
              >
                <input
                  class="option__native"
                  type="radio"
                  name=${this.name || this.groupId}
                  value=${opt.value}
                  .checked=${this.value === opt.value}
                  ?disabled=${this.disabled || !!opt.disabled}
                  @change=${this.onNativeChange}
                  @blur=${this.onNativeBlur}
                />
                <span class="option__mark" aria-hidden="true"></span>
                <span class="option__label">${opt.label}</span>
              </label>
            `,
          )}
        </div>
        ${this.hint
          ? html`<span class="hint" part="hint" id=${hintId} role="note">${this.hint}</span>`
          : nothing}
        ${this.error
          ? html`<span class="error" part="error" id=${errorId} role="alert">${this.error}</span>`
          : nothing}
      </fieldset>
    `
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-radio-group': LfRadioGroup
  }
}
