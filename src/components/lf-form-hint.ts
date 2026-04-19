import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../styles/lf-form-hint.scss?inline'
import type { LfAllFormProps } from '../types/form-field'

/**
 * Form hint component. Renders helper text below an input.
 *
 * @csspart hint - The hint text container.
 * @cssprop [--lf-color-hint=#6b7280] - Hint text colour.
 * @cssprop [--lf-font-family-base=system-ui] - Hint font family.
 * @cssprop [--lf-font-size-sm=0.875rem] - Hint font size.
 */
@customElement('lf-form-hint')
export class LfFormHint extends LitElement implements Pick<LfAllFormProps, 'hint'> {
  /** helper text to display */
  @property({ type: String })
  hint = ''

  override render() {
    return html`<span part="hint" role="note">${this.hint}</span>`
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-form-hint': LfFormHint
  }
}
