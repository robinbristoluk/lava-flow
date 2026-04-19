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
 * @cssprop [--lf-color-primary=#5b21b6] - Primary button background.
 * @cssprop [--lf-color-primary-hover=#4c1d95] - Primary button hover background.
 * @cssprop [--lf-color-on-primary=#ffffff] - Text on primary button.
 * @cssprop [--lf-color-secondary=#ffffff] - Secondary button background.
 * @cssprop [--lf-color-secondary-hover=#f5f3ff] - Secondary button hover background.
 * @cssprop [--lf-color-secondary-border=#5b21b6] - Secondary button border.
 * @cssprop [--lf-color-on-secondary=#4c1d95] - Text on secondary button.
 * @cssprop [--lf-color-focus-ring=#7c3aed] - Focus ring color.
 * @cssprop [--lf-radius-md=0.625rem] - Button corner radius.
 * @cssprop [--lf-font-family-base=system-ui] - Button font family.
 * @cssprop [--lf-font-size-base=1rem] - Button font size.
 * @cssprop [--lf-font-weight-semibold=600] - Button font weight.
 * @cssprop [--lf-space-2=0.5rem] - Gap between icon and label.
 * @cssprop [--lf-space-3=0.625rem] - Button block padding.
 * @cssprop [--lf-space-4=1rem] - Button inline padding.
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
