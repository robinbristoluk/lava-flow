import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from '../styles/lf-label.scss?inline'
import type { LfAllFormProps } from '../types/form-field'

/**
 * Form label component. Renders a semantic `<label>` element.
 *
 * Associate with an input by setting `field-id` to match the input's `id`.
 *
 * @csspart label - The native `<label>` element.
 * @cssprop [--lf-color-label=#374151] - Label text colour.
 * @cssprop [--lf-font-family-base=system-ui] - Label font family.
 * @cssprop [--lf-font-size-sm=0.875rem] - Label font size.
 * @cssprop [--lf-font-weight-semibold=600] - Label font weight.
 */
@customElement('lf-label')
export class LfLabel extends LitElement implements Pick<LfAllFormProps, 'fieldId' | 'label'> {
  /** id of the associated input element */
  @property({ type: String, attribute: 'field-id' })
  fieldId = ''

  /** visible label text */
  @property({ type: String })
  label = ''

  override render() {
    return html`<label part="label" for=${this.fieldId}>${this.label}</label>`
  }

  static override styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-label': LfLabel
  }
}
