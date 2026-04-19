import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../styles/lf-form-error.scss?inline'
import type { LfAllFormProps } from '../types/form-field'

/**
 * Form error message component. Renders a validation error below an input.
 *
 * @csspart error - The error text container.
 * @cssprop [--lf-color-error=#dc2626] - Error text colour.
 * @cssprop [--lf-font-family-base=system-ui] - Error font family.
 * @cssprop [--lf-font-size-sm=0.875rem] - Error font size.
 */
@customElement('lf-form-error')
export class LfFormError extends LitElement implements Pick<LfAllFormProps, 'error'> {
  /** validation error message */
  @property({ type: String })
  error = ''

  override render() {
    return html`<span part="error" role="alert">${this.error}</span>`
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-form-error': LfFormError
  }
}
