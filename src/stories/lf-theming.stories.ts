/**
 * Token override stories — demonstrating how all lf-* components respond
 * when the design token set is swapped out via CSS custom properties.
 *
 * Three presets are shown:
 *  1. **Dark** — a dark-surface colour palette.
 *  2. **Compact** — reduced spacing and smaller type.
 *  3. **High-contrast** — accessible colours with thicker borders and ring.
 */
import { html } from 'lit'
import type { Meta, StoryObj } from '@storybook/web-components-vite'

import '../components/lf-form-field'
import '../components/lf-radio-group'
import '../components/lf-checkbox-group'

const meta: Meta = {
  title: 'Design Tokens/Theming',
  parameters: {
    docs: {
      description: {
        component:
          'These stories show how lava-flow components respond to token overrides. ' +
          'Override any `--lf-*` custom property on a parent element (or `:root`) to ' +
          'retheme an entire section or the whole page.',
      },
    },
  },
}

export default meta
type Story = StoryObj

// ─── Dark theme ───────────────────────────────────────────────────────────────

export const Dark: Story = {
  name: 'Dark theme',
  render: () => html`
    <div
      style="
        --lf-color-primary: #a78bfa;
        --lf-color-primary-hover: #8b5cf6;
        --lf-color-on-primary: #1c1c2e;
        --lf-color-secondary: #1c1c2e;
        --lf-color-secondary-hover: #2e2e45;
        --lf-color-secondary-border: #a78bfa;
        --lf-color-on-secondary: #c4b5fd;
        --lf-color-focus-ring: #a78bfa;
        --lf-color-label: #e5e7eb;
        --lf-color-hint: #9ca3af;
        --lf-color-error: #f87171;
        --lf-color-input-bg: #1f1f35;
        --lf-color-input-text: #f9fafb;
        --lf-color-input-border: #4b5563;
        --lf-color-input-border-focus: #a78bfa;
        --lf-color-input-placeholder: #6b7280;
        --lf-color-input-disabled-bg: #2d2d45;
        --lf-color-input-disabled-text: #6b7280;
        background: #111827;
        border-radius: var(--lf-radius-md, 0.625rem);
        display: grid;
        gap: 1.25rem;
        padding: 1.5rem;
        width: min(28rem, 100%);
      "
    >
      <lf-form-field
        label="Email address"
        name="email"
        type="email"
        placeholder="you@example.com"
        hint="We'll never share your email."
      ></lf-form-field>

      <lf-form-field
        label="Message"
        name="message"
        multiline
        placeholder="Write your message…"
      ></lf-form-field>

      <lf-radio-group
        label="Preferred contact"
        name="contact"
        .options=${[
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'none', label: 'None', disabled: true },
        ]}
      ></lf-radio-group>

      <button
        type="submit"
        style="
          background: var(--lf-color-primary, #5b21b6);
          border: none;
          border-radius: var(--lf-radius-md, 0.625rem);
          color: var(--lf-color-on-primary, #ffffff);
          cursor: pointer;
          font: inherit;
          font-size: var(--lf-font-size-base, 1rem);
          font-weight: var(--lf-font-weight-semibold, 600);
          min-height: 2.75rem;
          padding: var(--lf-space-3, 0.625rem) var(--lf-space-4, 1rem);
          width: 100%;
        "
      >Send message</button>
    </div>
  `,
}

// ─── Compact spacing ──────────────────────────────────────────────────────────

export const Compact: Story = {
  name: 'Compact spacing',
  render: () => html`
    <div
      style="
        --lf-space-2: 0.25rem;
        --lf-space-3: 0.375rem;
        --lf-space-4: 0.75rem;
        --lf-font-size-base: 0.875rem;
        --lf-font-size-sm: 0.75rem;
        --lf-checkbox-size: 1rem;
        --lf-radio-size: 1rem;
        display: grid;
        gap: 0.75rem;
        width: min(26rem, 100%);
      "
    >
      <lf-form-field
        label="First name"
        name="first"
        placeholder="Jane"
      ></lf-form-field>

      <lf-form-field
        label="Last name"
        name="last"
        placeholder="Smith"
      ></lf-form-field>

      <lf-checkbox-group
        label="Interests"
        name="interests"
        .options=${[
          { value: 'design', label: 'Design' },
          { value: 'engineering', label: 'Engineering' },
          { value: 'product', label: 'Product' },
        ]}
      ></lf-checkbox-group>

      <button
        style="
          background: var(--lf-color-primary, #5b21b6);
          border: none;
          border-radius: var(--lf-radius-md, 0.625rem);
          color: var(--lf-color-on-primary, #ffffff);
          cursor: pointer;
          font: inherit;
          font-size: var(--lf-font-size-base, 0.875rem);
          font-weight: var(--lf-font-weight-semibold, 600);
          min-height: 2.25rem;
          padding: var(--lf-space-3, 0.375rem) var(--lf-space-4, 0.75rem);
          width: 100%;
        "
      >Save</button>
    </div>
  `,
}

// ─── High-contrast / accessible ───────────────────────────────────────────────

export const HighContrast: Story = {
  name: 'High contrast',
  render: () => html`
    <div
      style="
        --lf-color-primary: #0000ee;
        --lf-color-primary-hover: #000080;
        --lf-color-on-primary: #ffffff;
        --lf-color-secondary: #ffffff;
        --lf-color-secondary-hover: #e8e8ff;
        --lf-color-secondary-border: #0000ee;
        --lf-color-on-secondary: #000080;
        --lf-color-focus-ring: #0000ee;
        --lf-color-label: #000000;
        --lf-color-hint: #595959;
        --lf-color-error: #c00000;
        --lf-color-input-bg: #ffffff;
        --lf-color-input-text: #000000;
        --lf-color-input-border: #767676;
        --lf-color-input-border-focus: #0000ee;
        --lf-color-input-placeholder: #767676;
        --lf-color-input-disabled-bg: #f5f5f5;
        --lf-color-input-disabled-text: #767676;
        --lf-radius-sm: 0;
        --lf-radius-md: 0;
        display: grid;
        gap: 1.25rem;
        width: min(28rem, 100%);
      "
    >
      <lf-form-field
        label="Username"
        name="username"
        placeholder="Enter username"
        required
      ></lf-form-field>

      <lf-form-field
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        hint="Minimum 12 characters."
        required
      ></lf-form-field>

      <lf-radio-group
        label="Account type"
        name="account"
        .options=${[
          { value: 'personal', label: 'Personal' },
          { value: 'business', label: 'Business' },
        ]}
      ></lf-radio-group>

      <button
        style="
          background: var(--lf-color-primary, #0000ee);
          border: 2px solid var(--lf-color-primary, #0000ee);
          border-radius: var(--lf-radius-md, 0);
          color: var(--lf-color-on-primary, #ffffff);
          cursor: pointer;
          font: inherit;
          font-size: var(--lf-font-size-base, 1rem);
          font-weight: var(--lf-font-weight-semibold, 600);
          min-height: 2.75rem;
          padding: var(--lf-space-3, 0.625rem) var(--lf-space-4, 1rem);
          width: 100%;
        "
      >Sign in</button>
    </div>
  `,
}
