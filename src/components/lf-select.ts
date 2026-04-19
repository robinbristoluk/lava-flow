import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from '../styles/lf-select.scss?inline'
import type { LfAllFormProps, LfSelectOption, LfSelectOptionItem } from '../types/form-field'

let idCounter = 0

type LfSelectPickedProps = Pick<
  LfAllFormProps,
  | 'fieldId'
  | 'name'
  | 'value'
  | 'placeholder'
  | 'required'
  | 'disabled'
  | 'readonly'
  | 'error'
  | 'options'
>

/**
 * Accessible, fully stylable, form-associated custom select web component.
 *
 * Renders a trigger button + popup listbox pattern instead of a native
 * `<select>` element, giving full control over appearance while preserving
 * native form participation and keyboard/screen-reader accessibility.
 *
 * Set `field-id` to match a `<label for="...">` or `<lf-label field-id="...">`
 * in the same DOM scope. The component uses `delegatesFocus` so that clicking
 * an associated label focuses the trigger button automatically.
 *
 * @fires lf-change - Fired when the selected value changes; `detail.value` holds the new value.
 * @csspart trigger - The trigger `<button>` element.
 * @csspart value - The selected-value `<span>` inside the trigger.
 * @csspart icon - The chevron icon `<svg>` inside the trigger.
 * @csspart listbox - The popup `<ul role="listbox">` element.
 * @csspart option - Each `<li role="option">` element.
 * @csspart option--selected - Added to the currently selected option.
 * @csspart option--focused - Added to the keyboard-focused option.
 * @csspart option--disabled - Added to disabled options.
 * @csspart group - A group container `<li role="group">`.
 * @csspart group-label - The group heading `<span>`.
 * @cssprop [--lf-color-input-bg=#ffffff] - Trigger and listbox background.
 * @cssprop [--lf-color-input-text=#111827] - Trigger and option text colour.
 * @cssprop [--lf-color-input-border=#d1d5db] - Default border colour.
 * @cssprop [--lf-color-input-border-focus=#5b21b6] - Border colour on focus.
 * @cssprop [--lf-color-input-placeholder=#9ca3af] - Placeholder text colour.
 * @cssprop [--lf-color-input-disabled-bg=#f3f4f6] - Background when disabled or readonly.
 * @cssprop [--lf-color-input-disabled-text=#9ca3af] - Text colour when disabled.
 * @cssprop [--lf-color-error=#dc2626] - Border colour when invalid.
 * @cssprop [--lf-color-focus-ring=#7c3aed] - Focus ring colour.
 * @cssprop [--lf-color-secondary-hover=#f5f3ff] - Option hover/focused background.
 * @cssprop [--lf-color-on-secondary=#4c1d95] - Option hover/focused text colour.
 * @cssprop [--lf-color-hint=#6b7280] - Group label colour.
 * @cssprop [--lf-radius-md=0.625rem] - Corner radius.
 * @cssprop [--lf-font-family-base=system-ui] - Font family.
 * @cssprop [--lf-font-size-base=1rem] - Option font size.
 * @cssprop [--lf-font-size-sm=0.875rem] - Group label font size.
 * @cssprop [--lf-font-weight-semibold=600] - Selected option and group label weight.
 * @cssprop [--lf-space-2=0.5rem] - Icon margin.
 * @cssprop [--lf-space-3=0.625rem] - Trigger and option block padding.
 * @cssprop [--lf-space-4=1rem] - Trigger and option inline padding.
 */
@customElement('lf-select')
export class LfSelect extends LitElement implements LfSelectPickedProps {
  static readonly formAssociated = true

  protected override createRenderRoot() {
    return this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  private readonly internals: ElementInternals
  private readonly _triggerId: string
  private readonly _listboxId: string

  constructor() {
    super()
    this.internals = this.attachInternals()
    const id = ++idCounter
    this._triggerId = `lf-select-trigger-${id}`
    this._listboxId = `lf-select-listbox-${id}`
  }

  /** id forwarded to the trigger `<button>` for `<label for>` association */
  @property({ type: String, attribute: 'field-id' })
  fieldId = ''

  /** name submitted with form data */
  @property({ type: String })
  name = ''

  /** currently selected value */
  @property({ type: String })
  value = ''

  /** text shown when no option is selected */
  @property({ type: String })
  placeholder = ''

  /** marks the field as required */
  @property({ type: Boolean, reflect: true })
  required = false

  /** disables the control */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /** prevents the user from changing the selection */
  @property({ type: Boolean, reflect: true })
  readonly = false

  /** validation error message; non-empty string triggers the invalid visual state */
  @property({ type: String })
  error = ''

  /**
   * Array of options to display. Each item is either an `LfSelectOption`
   * `{ label, value, disabled? }` or an `LfSelectOptionGroup`
   * `{ group, options[] }`.
   */
  @property({ attribute: false })
  options: LfSelectOptionItem[] = []

  @state() private _open = false
  @state() private _focusedIndex = -1
  @state() private _touched = false

  // ─── Computed helpers ──────────────────────────────────────────────────────

  private get _flatOptions(): LfSelectOption[] {
    return this.options.flatMap((item) => ('group' in item ? item.options : [item]))
  }

  private get _selectedLabel(): string | undefined {
    return this._flatOptions.find((o) => o.value === this.value)?.label
  }

  private get _focusedOptionId(): string | typeof nothing {
    if (!this._open || this._focusedIndex < 0) return nothing
    return `${this._listboxId}-${this._focusedIndex}`
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('required')) {
      this._syncFormValue()
    }
    this._updateInvalidState()

    if (changed.has('_open') && this._open) {
      this._scrollFocusedIntoView()
    }
    if (changed.has('_focusedIndex') && this._open) {
      this._scrollFocusedIntoView()
    }
  }

  private _syncFormValue(): void {
    this.internals.setFormValue(this.value)
    if (this.required && this.value.length === 0) {
      this.internals.setValidity({ valueMissing: true }, 'Please select an option.')
    } else {
      this.internals.setValidity({})
    }
  }

  private _updateInvalidState(): void {
    this.toggleAttribute(
      'data-invalid',
      this.error.length > 0 || (this._touched && !this.internals.validity.valid),
    )
    this.toggleAttribute('data-readonly', this.readonly)
  }

  private _scrollFocusedIntoView(): void {
    if (this._focusedIndex < 0) return
    this.shadowRoot
      ?.getElementById(`${this._listboxId}-${this._focusedIndex}`)
      ?.scrollIntoView({ block: 'nearest' })
  }

  // ─── Interaction ───────────────────────────────────────────────────────────

  private _openSelect(preferredFocusAt?: 'first' | 'last'): void {
    if (this.disabled || this.readonly || this._open) return
    const flat = this._flatOptions
    const currentIdx = flat.findIndex((o) => o.value === this.value)
    if (currentIdx >= 0 && !flat[currentIdx]?.disabled) {
      this._focusedIndex = currentIdx
    } else if (preferredFocusAt === 'last') {
      const last = this._findEnabled(flat.length - 1, -1)
      this._focusedIndex = last
    } else {
      this._focusedIndex = this._findEnabled(0, 1)
    }
    this._open = true
  }

  private _closeSelect(): void {
    this._open = false
    this._focusedIndex = -1
  }

  private _selectByIndex(idx: number): void {
    const opt = this._flatOptions[idx]
    if (!opt || opt.disabled) return
    this.value = opt.value
    this._closeSelect()
    this._touched = true
    this.dispatchEvent(
      new CustomEvent('lf-change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    )
  }

  /** Returns the index of the nearest enabled option from `start` in `direction`. */
  private _findEnabled(start: number, direction: 1 | -1): number {
    const flat = this._flatOptions
    let idx = start
    while (idx >= 0 && idx < flat.length) {
      if (!flat[idx]?.disabled) return idx
      idx += direction
    }
    return -1
  }

  private _moveFocus(direction: 1 | -1): void {
    const next = this._findEnabled(this._focusedIndex + direction, direction)
    if (next >= 0) this._focusedIndex = next
  }

  // ─── Event handlers ────────────────────────────────────────────────────────

  private readonly _onTriggerClick = (): void => {
    if (this.disabled || this.readonly) return
    if (this._open) {
      this._closeSelect()
    } else {
      this._openSelect()
    }
  }

  private readonly _onTriggerBlur = (): void => {
    if (this._open) {
      this._closeSelect()
    }
    this._touched = true
    this._updateInvalidState()
  }

  private readonly _onKeydown = (e: KeyboardEvent): void => {
    if (this.disabled || this.readonly) return

    const flat = this._flatOptions

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!this._open) {
          this._openSelect('first')
        } else {
          this._moveFocus(1)
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (!this._open) {
          this._openSelect('last')
        } else {
          this._moveFocus(-1)
        }
        break

      case 'Home':
        e.preventDefault()
        if (this._open) {
          const first = this._findEnabled(0, 1)
          if (first >= 0) this._focusedIndex = first
        }
        break

      case 'End':
        e.preventDefault()
        if (this._open) {
          const last = this._findEnabled(flat.length - 1, -1)
          if (last >= 0) this._focusedIndex = last
        }
        break

      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!this._open) {
          this._openSelect()
        } else if (this._focusedIndex >= 0) {
          this._selectByIndex(this._focusedIndex)
        }
        break

      case 'Escape':
        if (this._open) {
          e.preventDefault()
          this._closeSelect()
        }
        break

      case 'Tab':
        if (this._open) {
          this._closeSelect()
        }
        break

      default:
        // Typeahead: jump to option whose label starts with the typed character
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          const ch = e.key.toLowerCase()
          const startFrom = this._focusedIndex >= 0 ? this._focusedIndex + 1 : 0
          let found = flat.findIndex(
            (o, i) => i >= startFrom && !o.disabled && o.label.toLowerCase().startsWith(ch),
          )
          if (found < 0) {
            found = flat.findIndex(
              (o, i) => i < startFrom && !o.disabled && o.label.toLowerCase().startsWith(ch),
            )
          }
          if (found >= 0) {
            if (!this._open) this._open = true
            this._focusedIndex = found
          }
        }
    }
  }

  private readonly _onOptionClick = (e: Event, idx: number): void => {
    e.stopPropagation()
    this._selectByIndex(idx)
  }

  private readonly _onOptionMousedown = (e: Event): void => {
    // Prevent the trigger from losing focus when clicking an option
    e.preventDefault()
  }

  // ─── Rendering helpers ─────────────────────────────────────────────────────

  private _renderOption(opt: LfSelectOption, flatIdx: number) {
    const optId = `${this._listboxId}-${flatIdx}`
    const isSelected = opt.value === this.value
    const isFocused = flatIdx === this._focusedIndex
    const partList = [
      'option',
      isSelected ? 'option--selected' : '',
      isFocused ? 'option--focused' : '',
      opt.disabled ? 'option--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ')
    const classList = [
      'option',
      isSelected ? 'option--selected' : '',
      isFocused ? 'option--focused' : '',
      opt.disabled ? 'option--disabled' : '',
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
        @click=${(e: Event) => this._onOptionClick(e, flatIdx)}
        @mousedown=${this._onOptionMousedown}
      >
        ${opt.label}
      </li>
    `
  }

  private _renderOptionItems() {
    let flatIdx = 0
    return this.options.map((item) => {
      if ('group' in item) {
        const groupLabelId = `${this._listboxId}-group-${flatIdx}`
        const groupOpts = item.options.map((opt) => this._renderOption(opt, flatIdx++))
        return html`
          <li part="group" class="group" role="group" aria-labelledby=${groupLabelId}>
            <span id=${groupLabelId} part="group-label" class="group-label">${item.group}</span>
            <ul class="group-options" role="presentation">
              ${groupOpts}
            </ul>
          </li>
        `
      }
      return this._renderOption(item, flatIdx++)
    })
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  override render() {
    const triggerId = this.fieldId || this._triggerId
    const selectedLabel = this._selectedLabel

    return html`
      <button
        part="trigger"
        class="trigger"
        id=${triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded=${this._open ? 'true' : 'false'}
        aria-controls=${this._listboxId}
        aria-activedescendant=${this._focusedOptionId}
        aria-required=${this.required ? 'true' : nothing}
        aria-invalid=${this.error || (this._touched && !this.internals.validity.valid)
          ? 'true'
          : nothing}
        ?disabled=${this.disabled}
        @click=${this._onTriggerClick}
        @blur=${this._onTriggerBlur}
        @keydown=${this._onKeydown}
      >
        <span part="value" class="value">
          ${selectedLabel !== undefined
            ? selectedLabel
            : html`<span class="placeholder">${this.placeholder}</span>`}
        </span>
        <svg
          part="icon"
          class="icon"
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
        class="listbox${this._open ? ' listbox--open' : ''}"
        id=${this._listboxId}
        role="listbox"
        aria-labelledby=${triggerId}
      >
        ${this._renderOptionItems()}
      </ul>
    `
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-select': LfSelect
  }
}
