import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from '../styles/lf-form-field.scss?inline'
import type {
  LfAllFormProps,
  LfInputMode,
  LfInputType,
  LfSelectOption,
  LfSelectOptionItem,
  LfTextareaResize,
} from '../types/form-field'

let idCounter = 0

/**
 * Composite form field component. Renders a label, control (input, textarea, or select),
 * and optional hint and error message all inside a single shadow root,
 * providing a fully accessible field with proper `<label for>` association.
 *
 * Set `multiline` to render a `<textarea>` instead of a single-line `<input>`.
 * Set `control="select"` and supply an `options` array to render a fully
 * stylable custom select control instead of a native `<input>`.
 *
 * If `hint` is not set (empty string) the hint element is not rendered.
 * If `error` is not set (empty string) the error element is not rendered.
 *
 * The component is form-associated: its `name` + `value` participate in
 * `<form>` submission and the native constraint-validation API.
 *
 * @fires lf-input - Fired on every keystroke (input/textarea modes); `detail.value` holds the current value.
 * @fires lf-change - Fired when the value is committed (blur / Enter, or whenever the select value changes); `detail.value` holds the value.
 * @csspart field - Outer wrapper `<div>`.
 * @csspart label - The `<label>` element.
 * @csspart input - The `<input>` or `<textarea>` element (input/multiline mode only).
 * @csspart trigger - The select trigger `<button>` (select mode only).
 * @csspart value - The selected-value `<span>` inside the trigger (select mode only).
 * @csspart icon - The chevron icon inside the trigger (select mode only).
 * @csspart listbox - The popup `<ul role="listbox">` (select mode only).
 * @csspart option - Each `<li role="option">` (select mode only).
 * @csspart option--selected - Added to the currently selected option.
 * @csspart option--focused - Added to the keyboard-focused option.
 * @csspart option--disabled - Added to disabled options.
 * @csspart group - A group container (select mode only).
 * @csspart group-label - The group heading (select mode only).
 * @csspart hint - The hint `<span>` (only present when `hint` is set).
 * @csspart error - The error `<span>` (only present when `error` is set).
 * @cssprop [--lf-color-label=#374151] - Label text colour.
 * @cssprop [--lf-color-hint=#6b7280] - Hint text colour.
 * @cssprop [--lf-color-error=#dc2626] - Error text and border colour.
 * @cssprop [--lf-color-input-bg=#ffffff] - Input/trigger background.
 * @cssprop [--lf-color-input-text=#111827] - Input/trigger text colour.
 * @cssprop [--lf-color-input-border=#d1d5db] - Default input/trigger border.
 * @cssprop [--lf-color-input-border-focus=#5b21b6] - Border on focus.
 * @cssprop [--lf-color-input-placeholder=#9ca3af] - Placeholder colour.
 * @cssprop [--lf-color-input-disabled-bg=#f3f4f6] - Background when disabled.
 * @cssprop [--lf-color-input-disabled-text=#9ca3af] - Text colour when disabled.
 * @cssprop [--lf-color-secondary-hover=#f5f3ff] - Option hover/focused background.
 * @cssprop [--lf-color-on-secondary=#4c1d95] - Option hover/focused text colour.
 * @cssprop [--lf-color-focus-ring=#7c3aed] - Focus ring colour.
 * @cssprop [--lf-radius-md=0.625rem] - Input/trigger corner radius.
 * @cssprop [--lf-font-family-base=system-ui] - Font family.
 * @cssprop [--lf-font-size-base=1rem] - Input/option font size.
 * @cssprop [--lf-font-size-sm=0.875rem] - Label / hint / error / group-label font size.
 * @cssprop [--lf-font-weight-semibold=600] - Label and selected-option weight.
 * @cssprop [--lf-space-2=0.5rem] - Gap between field rows; icon margin.
 * @cssprop [--lf-space-3=0.625rem] - Input/trigger block padding.
 * @cssprop [--lf-space-4=1rem] - Input/trigger inline padding.
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

  /** HTML input type (input mode only) */
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

  /** browser autocomplete hint (input/textarea mode only) */
  @property({ type: String })
  autocomplete = ''

  /** helper text — omit or leave empty to suppress the hint element */
  @property({ type: String })
  hint = ''

  /** validation error message — omit or leave empty to suppress the error element */
  @property({ type: String })
  error = ''

  /** minimum number of characters (input/textarea mode only) */
  @property({ type: Number, attribute: 'min-length' })
  minLength = 0

  /** maximum number of characters (input/textarea mode only) */
  @property({ type: Number, attribute: 'max-length' })
  maxLength = 0

  /** virtual keyboard hint (input mode only) */
  @property({ type: String, attribute: 'inputmode' })
  override inputMode: LfInputMode = 'text'

  /**
   * Not used directly on lf-form-field — the inner control is identified
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

  /**
   * Which control to render inside the field wrapper.
   * - `"input"` (default) renders a native `<input>` element (or `<textarea>` when `multiline` is set).
   * - `"select"` renders a fully stylable custom select control.
   */
  @property({ type: String })
  control: 'input' | 'select' = 'input'

  /**
   * Options for the select control. Each entry is either a flat
   * `LfSelectOption` `{ label, value, disabled? }` or a grouped
   * `LfSelectOptionGroup` `{ group, options[] }`.
   * Only used when `control="select"`.
   */
  @property({ attribute: false })
  options: LfSelectOptionItem[] = []

  // ─── Private select state ───────────────────────────────────────────────────

  @state() private _selectOpen = false
  @state() private _selectFocusedIndex = -1

  /** whether the user has interacted with the field (blur or input event) */
  @state() private _touched = false

  // ─── Computed select helpers ────────────────────────────────────────────────
  //
  // NOTE: The select interaction logic is intentionally inlined here rather than
  // composing the standalone <lf-select> element in the shadow DOM. Composing a
  // second form-associated custom element inside this shadow root would prevent
  // `aria-describedby` on the trigger button from referencing the hint/error
  // <span>s rendered in this shadow root (cross-shadow-root ARIA ID references
  // are not supported). Keeping everything in one shadow root preserves the full
  // accessible description chain for the trigger button.

  private get _selectFlatOptions(): LfSelectOption[] {
    return this.options.flatMap((item) => ('group' in item ? item.options : [item]))
  }

  private get _selectListboxId(): string {
    return `${this.inputId}-listbox`
  }

  private get _selectFocusedOptionId(): string | typeof nothing {
    if (!this._selectOpen || this._selectFocusedIndex < 0) return nothing
    return `${this._selectListboxId}-${this._selectFocusedIndex}`
  }

  private get _selectedOptionLabel(): string | undefined {
    return this._selectFlatOptions.find((o) => o.value === this.value)?.label
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  override updated(changed: Map<string, unknown>) {
    if (
      changed.has('value') ||
      changed.has('required') ||
      changed.has('minLength') ||
      changed.has('maxLength') ||
      changed.has('control')
    ) {
      this.syncFormValue()
    }
    if (changed.has('resize')) {
      this.style.setProperty('--lf-textarea-resize', this.resize)
    }
    this.updateInvalidState()

    if (changed.has('_selectOpen') && this._selectOpen) {
      this._scrollSelectFocusedIntoView()
    }
    if (changed.has('_selectFocusedIndex') && this._selectOpen) {
      this._scrollSelectFocusedIntoView()
    }
  }

  private syncFormValue(): void {
    this.internals.setFormValue(this.value)
    if (this.required && this.value.length === 0) {
      const msg =
        this.control === 'select' ? 'Please select an option.' : 'Please fill out this field.'
      this.internals.setValidity({ valueMissing: true }, msg)
    } else if (
      this.control === 'input' &&
      this.minLength > 0 &&
      this.value.length > 0 &&
      this.value.length < this.minLength
    ) {
      this.internals.setValidity(
        { tooShort: true },
        `Please lengthen this text to ${this.minLength} characters or more.`,
      )
    } else if (this.control === 'input' && this.maxLength > 0 && this.value.length > this.maxLength) {
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

  private _scrollSelectFocusedIntoView(): void {
    if (this._selectFocusedIndex < 0) return
    this.shadowRoot
      ?.getElementById(`${this._selectListboxId}-${this._selectFocusedIndex}`)
      ?.scrollIntoView({ block: 'nearest' })
  }

  // ─── Input/textarea mode handlers ──────────────────────────────────────────

  private readonly onNativeInput = (e: Event): void => {
    const input = e.target as HTMLInputElement | HTMLTextAreaElement
    this.value = input.value
    this._touched = true
    this.dispatchEvent(
      new CustomEvent('lf-input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
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
      }),
    )
  }

  private readonly onNativeBlur = (): void => {
    this._touched = true
  }

  // ─── Select mode helpers ────────────────────────────────────────────────────

  private _selectFindEnabled(start: number, direction: 1 | -1): number {
    const flat = this._selectFlatOptions
    let idx = start
    while (idx >= 0 && idx < flat.length) {
      if (!flat[idx]?.disabled) return idx
      idx += direction
    }
    return -1
  }

  private _selectMoveFocus(direction: 1 | -1): void {
    const next = this._selectFindEnabled(this._selectFocusedIndex + direction, direction)
    if (next >= 0) this._selectFocusedIndex = next
  }

  private _openSelectDropdown(preferredFocusAt?: 'first' | 'last'): void {
    if (this.disabled || this.readonly || this._selectOpen) return
    const flat = this._selectFlatOptions
    const currentIdx = flat.findIndex((o) => o.value === this.value)
    if (currentIdx >= 0 && !flat[currentIdx]?.disabled) {
      this._selectFocusedIndex = currentIdx
    } else if (preferredFocusAt === 'last') {
      this._selectFocusedIndex = this._selectFindEnabled(flat.length - 1, -1)
    } else {
      this._selectFocusedIndex = this._selectFindEnabled(0, 1)
    }
    this._selectOpen = true
  }

  private _closeSelectDropdown(): void {
    this._selectOpen = false
    this._selectFocusedIndex = -1
  }

  private _selectByIndex(idx: number): void {
    const opt = this._selectFlatOptions[idx]
    if (!opt || opt.disabled) return
    this.value = opt.value
    this._closeSelectDropdown()
    this._touched = true
    this.dispatchEvent(
      new CustomEvent('lf-change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    )
  }

  // ─── Select mode event handlers ─────────────────────────────────────────────

  private readonly _onSelectTriggerClick = (): void => {
    if (this.disabled || this.readonly) return
    if (this._selectOpen) {
      this._closeSelectDropdown()
    } else {
      this._openSelectDropdown()
    }
  }

  private readonly _onSelectTriggerBlur = (): void => {
    if (this._selectOpen) {
      this._closeSelectDropdown()
    }
    this._touched = true
  }

  private readonly _onSelectKeydown = (e: KeyboardEvent): void => {
    if (this.disabled || this.readonly) return
    const flat = this._selectFlatOptions

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!this._selectOpen) {
          this._openSelectDropdown('first')
        } else {
          this._selectMoveFocus(1)
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (!this._selectOpen) {
          this._openSelectDropdown('last')
        } else {
          this._selectMoveFocus(-1)
        }
        break

      case 'Home':
        e.preventDefault()
        if (this._selectOpen) {
          const first = this._selectFindEnabled(0, 1)
          if (first >= 0) this._selectFocusedIndex = first
        }
        break

      case 'End':
        e.preventDefault()
        if (this._selectOpen) {
          const last = this._selectFindEnabled(flat.length - 1, -1)
          if (last >= 0) this._selectFocusedIndex = last
        }
        break

      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!this._selectOpen) {
          this._openSelectDropdown()
        } else if (this._selectFocusedIndex >= 0) {
          this._selectByIndex(this._selectFocusedIndex)
        }
        break

      case 'Escape':
        if (this._selectOpen) {
          e.preventDefault()
          this._closeSelectDropdown()
        }
        break

      case 'Tab':
        if (this._selectOpen) {
          this._closeSelectDropdown()
        }
        break

      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          const ch = e.key.toLowerCase()
          const startFrom = this._selectFocusedIndex >= 0 ? this._selectFocusedIndex + 1 : 0
          let found = flat.findIndex(
            (o, i) => i >= startFrom && !o.disabled && o.label.toLowerCase().startsWith(ch),
          )
          if (found < 0) {
            found = flat.findIndex(
              (o, i) => i < startFrom && !o.disabled && o.label.toLowerCase().startsWith(ch),
            )
          }
          if (found >= 0) {
            if (!this._selectOpen) this._selectOpen = true
            this._selectFocusedIndex = found
          }
        }
    }
  }

  private readonly _onSelectOptionClick = (e: Event, idx: number): void => {
    e.stopPropagation()
    this._selectByIndex(idx)
  }

  private readonly _onSelectOptionMousedown = (e: Event): void => {
    e.preventDefault()
  }

  // ─── Select rendering helpers ───────────────────────────────────────────────

  private _renderSelectOption(opt: LfSelectOption, flatIdx: number) {
    const optId = `${this._selectListboxId}-${flatIdx}`
    const isSelected = opt.value === this.value
    const isFocused = flatIdx === this._selectFocusedIndex
    const partList = [
      'option',
      isSelected ? 'option--selected' : '',
      isFocused ? 'option--focused' : '',
      opt.disabled ? 'option--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ')
    const classList = [
      'select-option',
      isSelected ? 'select-option--selected' : '',
      isFocused ? 'select-option--focused' : '',
      opt.disabled ? 'select-option--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ')

    return html`
      <li
        part=${partList}
        class=${classList}
        id=${optId}
        role="option"
        aria-selected=${isSelected ? 'true' : 'false'}
        aria-disabled=${opt.disabled ? 'true' : nothing}
        @click=${(e: Event) => this._onSelectOptionClick(e, flatIdx)}
        @mousedown=${this._onSelectOptionMousedown}
      >
        ${opt.label}
      </li>
    `
  }

  private _renderSelectOptionItems() {
    let flatIdx = 0
    return this.options.map((item) => {
      if ('group' in item) {
        const groupLabelId = `${this._selectListboxId}-group-${flatIdx}`
        const groupOpts = item.options.map((opt) => this._renderSelectOption(opt, flatIdx++))
        return html`
          <li part="group" class="select-group" role="group" aria-labelledby=${groupLabelId}>
            <span
              id=${groupLabelId}
              part="group-label"
              class="select-group-label"
            >${item.group}</span>
            <ul class="select-group-options" role="presentation">
              ${groupOpts}
            </ul>
          </li>
        `
      }
      return this._renderSelectOption(item, flatIdx++)
    })
  }

  private _renderSelectControl(hintId: string, errorId: string) {
    const selectedLabel = this._selectedOptionLabel

    return html`
      <div class="select-wrapper">
        <button
          part="trigger"
          class="select-trigger"
          id=${this.inputId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this._selectOpen ? 'true' : 'false'}
          aria-controls=${this._selectListboxId}
          aria-activedescendant=${this._selectFocusedOptionId}
          aria-required=${this.required ? 'true' : nothing}
          aria-invalid=${this.error || (this._touched && !this.internals.validity.valid)
            ? 'true'
            : nothing}
          aria-describedby=${[this.hint ? hintId : '', this.error ? errorId : '']
            .filter(Boolean)
            .join(' ') || nothing}
          ?disabled=${this.disabled}
          @click=${this._onSelectTriggerClick}
          @blur=${this._onSelectTriggerBlur}
          @keydown=${this._onSelectKeydown}
        >
          <span part="value" class="select-value">
            ${selectedLabel !== undefined
              ? selectedLabel
              : html`<span class="select-placeholder">${this.placeholder}</span>`}
          </span>
          <svg
            part="icon"
            class="select-icon"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <ul
          part="listbox"
          class="select-listbox${this._selectOpen ? ' select-listbox--open' : ''}"
          id=${this._selectListboxId}
          role="listbox"
          aria-labelledby=${this.inputId}
        >
          ${this._renderSelectOptionItems()}
        </ul>
      </div>
    `
  }

  // ─── Render ────────────────────────────────────────────────────────────────

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

        ${this.control === 'select'
          ? this._renderSelectControl(hintId, errorId)
          : this.multiline
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
                @input=${this.onNativeInput}
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
                @input=${this.onNativeInput}
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
