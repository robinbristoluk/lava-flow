import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../styles/lf-button.scss?inline'

export type LfButtonVariant = 'primary' | 'secondary'

/**
 * Accessible, framework-agnostic action button web component.
 *
 * @slot icon - Optional icon before the label.
 * @fires lf-press - Dispatched when the button is activated while enabled.
 * @csspart button - Native button element.
 * @csspart icon - Icon container.
 * @csspart label - Visible button text.
 * @cssprop [--lf-primary-bg=#5b21b6] - Primary button background color.
 * @cssprop [--lf-primary-bg-hover=#4c1d95] - Primary button hover background color.
 * @cssprop [--lf-primary-text=#ffffff] - Primary button text color.
 * @cssprop [--lf-secondary-bg=#ffffff] - Secondary button background color.
 * @cssprop [--lf-secondary-bg-hover=#f5f3ff] - Secondary button hover background color.
 * @cssprop [--lf-secondary-border=#5b21b6] - Secondary button border color.
 * @cssprop [--lf-secondary-text=#4c1d95] - Secondary button text color.
 * @cssprop [--lf-focus-ring=#7c3aed] - Focus ring color.
 */
@customElement('lf-button')
export class LfButton extends LitElement {
  @property({ type: String })
  label = 'Action'

  @property({ type: String })
  variant: LfButtonVariant = 'primary'

  @property({ type: Boolean, reflect: true })
  disabled = false

  @property({ type: Boolean, reflect: true })
  loading = false

  @property({ type: Boolean, attribute: 'full-width', reflect: true })
  fullWidth = false

  private readonly onClick = (): void => {
    if (this.disabled || this.loading) {
      return
    }

    this.dispatchEvent(
      new CustomEvent('lf-press', {
        bubbles: true,
        composed: true,
      })
    )
  }

  override render() {
    const isUnavailable = this.disabled || this.loading

    return html`
      <button
        class="button ${this.variant}"
        part="button"
        type="button"
        aria-label=${this.label}
        aria-disabled=${String(isUnavailable)}
        aria-busy=${String(this.loading)}
        ?disabled=${isUnavailable}
        @click=${this.onClick}
      >
        <span class="icon" part="icon" aria-hidden="true">
          <slot name="icon"></slot>
        </span>
        <span class="label" part="label">${this.label}</span>
      </button>
    `
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-button': LfButton
  }
}
