import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'

/**
 * Theme wrapper that provides library-wide CSS custom properties.
 *
 * @slot - Components to be themed.
 * @csspart container - Wraps slotted content and applies theme variables.
 * @cssprop [--lf-primary-bg=#5b21b6] - Primary background color for interactive components.
 * @cssprop [--lf-primary-bg-hover=#4c1d95] - Primary hover background color.
 * @cssprop [--lf-primary-text=#ffffff] - Primary foreground color.
 * @cssprop [--lf-secondary-bg=#ffffff] - Secondary background color.
 * @cssprop [--lf-secondary-bg-hover=#f5f3ff] - Secondary hover background color.
 * @cssprop [--lf-secondary-border=#5b21b6] - Secondary border color.
 * @cssprop [--lf-secondary-text=#4c1d95] - Secondary foreground color.
 * @cssprop [--lf-focus-ring=#7c3aed] - Focus ring color.
 */
@customElement('lf-theme')
export class LfTheme extends LitElement {
  @property({ type: String, attribute: 'primary-bg' })
  primaryBg = '#5b21b6'

  @property({ type: String, attribute: 'primary-bg-hover' })
  primaryBgHover = '#4c1d95'

  @property({ type: String, attribute: 'primary-text' })
  primaryText = '#ffffff'

  @property({ type: String, attribute: 'secondary-bg' })
  secondaryBg = '#ffffff'

  @property({ type: String, attribute: 'secondary-bg-hover' })
  secondaryBgHover = '#f5f3ff'

  @property({ type: String, attribute: 'secondary-border' })
  secondaryBorder = '#5b21b6'

  @property({ type: String, attribute: 'secondary-text' })
  secondaryText = '#4c1d95'

  @property({ type: String, attribute: 'focus-ring' })
  focusRing = '#7c3aed'

  override render() {
    return html`
      <div
        part="container"
        style=${styleMap({
          '--lf-primary-bg': this.primaryBg,
          '--lf-primary-bg-hover': this.primaryBgHover,
          '--lf-primary-text': this.primaryText,
          '--lf-secondary-bg': this.secondaryBg,
          '--lf-secondary-bg-hover': this.secondaryBgHover,
          '--lf-secondary-border': this.secondaryBorder,
          '--lf-secondary-text': this.secondaryText,
          '--lf-focus-ring': this.focusRing,
        })}
      >
        <slot></slot>
      </div>
    `
  }

  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }

    [part='container'] {
      width: 100%;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'lf-theme': LfTheme
  }
}
