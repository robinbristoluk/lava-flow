/**
 * Token override stories — demonstrating how all lf-* components respond
 * when the design token set is swapped out via CSS custom properties.
 *
 * Stories:
 *  1. **Light** — the default light palette (violet primary, green success, amber warning, blue info).
 *  2. **Dark** — dark palette, applied via `data-theme="dark"` (same tokens the system dark mode uses).
 *  3. **Side by side** — light and dark rendered next to each other.
 *  4. **Colour Variations** — practical examples of accent, contrast, and complementary tokens per role.
 *  5. **Compact** — reduced spacing and smaller type.
 *  6. **High contrast** — accessible high-contrast colours.
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
          'lava-flow components automatically adapt to the OS colour scheme via ' +
          '`prefers-color-scheme`. You can also force a mode by placing `data-theme="dark"` ' +
          'or `data-theme="light"` on any ancestor element (including `<html>`).\n\n' +
          'Beyond dark/light, the token system includes five semantic colour roles — ' +
          '**primary** (violet), **success** (green), **warning** (amber), **info** (blue), ' +
          'and **error** (red). Each role exposes four sub-tokens:\n\n' +
          '- `--lf-color-{role}` — base colour\n' +
          '- `--lf-color-{role}-accent` — light tint for alert/badge backgrounds\n' +
          '- `--lf-color-{role}-contrast` — deep shade for text/borders on light surfaces\n' +
          '- `--lf-color-{role}-complementary` — harmoniously paired hue from a different family\n\n' +
          'All tokens automatically adapt for dark mode.',
      },
    },
  },
}

export default meta
type Story = StoryObj

// ─── Shared form for demos ────────────────────────────────────────────────────

const demoForm = () => html`
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
      { value: 'none', label: 'No contact', disabled: true },
    ]}
  ></lf-radio-group>
`

const submitButton = () => html`
  <button
    type="submit"
    style="
      background: var(--lf-color-primary);
      border: none;
      border-radius: var(--lf-radius-md, 0.625rem);
      color: var(--lf-color-on-primary);
      cursor: pointer;
      font: inherit;
      font-size: var(--lf-font-size-base, 1rem);
      font-weight: var(--lf-font-weight-semibold, 600);
      min-height: 2.75rem;
      padding: var(--lf-space-3, 0.625rem) var(--lf-space-4, 1rem);
      width: 100%;
    "
  >Send message</button>
`

// ─── Colour swatches helper ───────────────────────────────────────────────────

const COLOUR_ROLES = ['primary', 'success', 'warning', 'info', 'error'] as const

const SWATCH_VARIANTS = [
  { suffix: '', label: 'base' },
  { suffix: '-accent', label: 'accent' },
  { suffix: '-contrast', label: 'contrast' },
  { suffix: '-complementary', label: 'compl.' },
] as const

const swatchLabel = (text: string) => html`
  <span
    style="
      color:var(--lf-color-label);
      font-family:var(--lf-font-family-base, system-ui, sans-serif);
      font-size:0.65rem;
      text-align:center;
    "
  >${text}</span>
`

const colourSwatches = () => html`
  <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.25rem">
    ${COLOUR_ROLES.map(
      (role) => html`
        <div>
          <div
            style="
              color:var(--lf-color-label);
              font-family:var(--lf-font-family-base, system-ui, sans-serif);
              font-size:0.7rem;
              font-weight:600;
              margin-bottom:0.35rem;
              text-transform:capitalize;
            "
          >${role}</div>
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap">
            ${SWATCH_VARIANTS.map(
              ({ suffix, label }) => html`
                <div style="display:flex; flex-direction:column; align-items:center; gap:0.2rem">
                  <div
                    style="
                      background:var(--lf-color-${role}${suffix});
                      border:1px solid rgb(0 0 0 / 8%);
                      border-radius:var(--lf-radius-sm, 0.25rem);
                      height:1.75rem;
                      width:3rem;
                    "
                  ></div>
                  ${swatchLabel(label)}
                </div>
              `
            )}
          </div>
        </div>
      `
    )}
  </div>
`

// ─── Light ────────────────────────────────────────────────────────────────────

export const Light: Story = {
  name: 'Light (default)',
  render: () => html`
    <div
      data-theme="light"
      style="
        background: var(--lf-color-surface, #ffffff);
        border-radius: var(--lf-radius-md, 0.625rem);
        display: grid;
        gap: 1.25rem;
        padding: 1.5rem;
        width: min(28rem, 100%);
      "
    >
      ${colourSwatches()}
      ${demoForm()}
      ${submitButton()}
    </div>
  `,
}

// ─── Dark ─────────────────────────────────────────────────────────────────────

export const Dark: Story = {
  name: 'Dark',
  render: () => html`
    <div
      data-theme="dark"
      style="
        background: var(--lf-color-surface, #111827);
        border-radius: var(--lf-radius-md, 0.625rem);
        display: grid;
        gap: 1.25rem;
        padding: 1.5rem;
        width: min(28rem, 100%);
      "
    >
      ${colourSwatches()}
      ${demoForm()}
      ${submitButton()}
    </div>
  `,
}

// ─── Side by side ─────────────────────────────────────────────────────────────

export const SideBySide: Story = {
  name: 'Light & Dark side by side',
  render: () => html`
    <div style="display:flex; gap:1.5rem; flex-wrap:wrap; align-items:flex-start">
      <div
        data-theme="light"
        style="
          background: var(--lf-color-surface, #ffffff);
          border-radius: var(--lf-radius-md, 0.625rem);
          display: grid;
          gap: 1rem;
          padding: 1.25rem;
          width: min(24rem, 100%);
        "
      >
        <p style="color:var(--lf-color-label); font-family:var(--lf-font-family-base, system-ui, sans-serif); font-size:0.875rem; font-weight:600; margin:0">Light mode</p>
        ${colourSwatches()}
        ${demoForm()}
        ${submitButton()}
      </div>

      <div
        data-theme="dark"
        style="
          background: var(--lf-color-surface, #111827);
          border-radius: var(--lf-radius-md, 0.625rem);
          display: grid;
          gap: 1rem;
          padding: 1.25rem;
          width: min(24rem, 100%);
        "
      >
        <p style="color:var(--lf-color-label); font-family:var(--lf-font-family-base, system-ui, sans-serif); font-size:0.875rem; font-weight:600; margin:0">Dark mode</p>
        ${colourSwatches()}
        ${demoForm()}
        ${submitButton()}
      </div>
    </div>
  `,
}

// ─── Colour Variations ────────────────────────────────────────────────────────

const ROLE_META: Record<
  (typeof COLOUR_ROLES)[number],
  {
    label: string
    icon: string
    message: string
    complementaryLabel: string
    complementaryProgressLabel: string
    complementaryProgressPct: number
  }
> = {
  primary: {
    label: 'Primary',
    icon: '★',
    message: 'This action uses your primary brand colour.',
    complementaryLabel: 'Amber',
    complementaryProgressLabel: 'Milestone',
    complementaryProgressPct: 65,
  },
  success: {
    label: 'Success',
    icon: '✓',
    message: 'Your changes have been saved successfully.',
    complementaryLabel: 'Cyan',
    complementaryProgressLabel: 'In review',
    complementaryProgressPct: 70,
  },
  warning: {
    label: 'Warning',
    icon: '!',
    message: 'Please review before continuing.',
    complementaryLabel: 'Red',
    complementaryProgressLabel: 'Critical',
    complementaryProgressPct: 55,
  },
  info: {
    label: 'Info',
    icon: 'i',
    message: 'New features are available in this release.',
    complementaryLabel: 'Violet',
    complementaryProgressLabel: 'Action needed',
    complementaryProgressPct: 60,
  },
  error: {
    label: 'Error',
    icon: '×',
    message: 'Something went wrong. Please try again.',
    complementaryLabel: 'Amber',
    complementaryProgressLabel: 'Warnings',
    complementaryProgressPct: 45,
  },
}

const variationCard = (role: (typeof COLOUR_ROLES)[number]) => {
  const meta = ROLE_META[role]
  return html`
    <div>
      <!-- Role heading -->
      <p
        style="
          color: var(--lf-color-label);
          font-family: var(--lf-font-family-base, system-ui, sans-serif);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
        "
      >${meta.label}</p>

      <!-- Alert banner: accent bg · base left-border · contrast body text · base icon chip -->
      <div
        style="
          align-items: flex-start;
          background: var(--lf-color-${role}-accent);
          border: 1px solid var(--lf-color-${role});
          border-left: 4px solid var(--lf-color-${role});
          border-radius: var(--lf-radius-md, 0.625rem);
          display: flex;
          gap: 0.625rem;
          margin-bottom: 0.5rem;
          padding: 0.75rem 1rem;
        "
      >
        <span
          style="
            align-items: center;
            background: var(--lf-color-${role});
            border-radius: 50%;
            color: var(--lf-color-on-${role});
            display: flex;
            flex-shrink: 0;
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.75rem;
            font-variant-emoji: text;
            font-weight: 700;
            height: 1.375rem;
            justify-content: center;
            width: 1.375rem;
          "
        >${meta.icon}</span>
        <p
          style="
            color: var(--lf-color-${role}-contrast);
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.875rem;
            line-height: 1.4;
            margin: 0;
          "
        >${meta.message}</p>
      </div>

      <!-- Chip row: base · accent -->
      <div style="display:flex; gap:0.375rem; flex-wrap:wrap; margin-bottom:0.75rem">
        <span
          style="
            background: var(--lf-color-${role});
            border-radius: 999px;
            color: var(--lf-color-on-${role});
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.2rem 0.625rem;
          "
        >Base</span>
        <span
          style="
            background: var(--lf-color-${role}-accent);
            border: 1px solid var(--lf-color-${role});
            border-radius: 999px;
            color: var(--lf-color-${role}-contrast);
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.2rem 0.625rem;
          "
        >Accent</span>
      </div>

      <!-- Complementary pairing: two-tone progress bar + paired badge row -->
      <p
        style="
          color: var(--lf-color-hint, #6b7280);
          font-family: var(--lf-font-family-base, system-ui, sans-serif);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin: 0 0 0.35rem;
          text-transform: uppercase;
        "
      >Complementary pairing</p>

      <!-- Two-tone progress bar -->
      <div
        style="
          border-radius: 999px;
          display: flex;
          height: 0.5rem;
          margin-bottom: 0.3rem;
          overflow: hidden;
          width: 100%;
        "
        role="img"
        aria-label="${meta.label} ${meta.complementaryProgressPct}%, ${meta.complementaryLabel} ${100 - meta.complementaryProgressPct}%"
      >
        <div style="background:var(--lf-color-${role}); flex:${meta.complementaryProgressPct}"></div>
        <div style="background:var(--lf-color-${role}-complementary); flex:${100 - meta.complementaryProgressPct}"></div>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.625rem;
        "
      >
        <span
          style="
            color: var(--lf-color-${role}-contrast);
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.65rem;
          "
        >${meta.label} · ${meta.complementaryProgressPct}%</span>
        <span
          style="
            color: var(--lf-color-hint, #6b7280);
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.65rem;
          "
        >${meta.complementaryProgressLabel} · ${100 - meta.complementaryProgressPct}%</span>
      </div>

      <!-- Paired badge row -->
      <div style="display:flex; gap:0.375rem; flex-wrap:wrap; align-items:center">
        <span
          style="
            background: var(--lf-color-${role});
            border-radius: var(--lf-radius-sm, 0.25rem);
            color: var(--lf-color-on-${role});
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.65rem;
            font-weight: 600;
            padding: 0.15rem 0.5rem;
          "
        >${meta.label}</span>
        <span
          style="
            color: var(--lf-color-hint, #6b7280);
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.65rem;
          "
        >paired with</span>
        <span
          style="
            background: transparent;
            border: 2px solid var(--lf-color-${role}-complementary);
            border-radius: var(--lf-radius-sm, 0.25rem);
            color: var(--lf-color-${role}-complementary);
            font-family: var(--lf-font-family-base, system-ui, sans-serif);
            font-size: 0.65rem;
            font-weight: 600;
            padding: 0.15rem 0.5rem;
          "
        >${meta.complementaryLabel}</span>
      </div>
    </div>
  `
}

export const ColourVariations: Story = {
  name: 'Colour Variations',
  parameters: {
    docs: {
      description: {
        story:
          'Practical examples of the **accent**, **contrast**, and **complementary** sub-tokens ' +
          'for each of the five roles, rendered side-by-side in **light** and **dark** mode. ' +
          'Each card shows:\n\n' +
          '- **Alert banner** — `accent` background, base left-border, `contrast` body text, base icon chip\n' +
          '- **Chips** — base fill, accent tinted outline\n' +
          '- **Two-tone progress bar** — role base fill on the left, complementary fill on the right, ' +
          'illustrating how the paired hue works as a visual counterpart (e.g. primary/amber, success/cyan)\n' +
          '- **Paired badge row** — role base badge alongside a complementary badge, as used for ' +
          'category + status labelling\n\n' +
          'Both panels are always visible regardless of your OS colour scheme — ' +
          '`data-theme="light"` and `data-theme="dark"` are applied directly to each panel.',
      },
    },
  },
  render: () => html`
    <div
      style="
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        width: min(76rem, 100%);
      "
    >
      <!-- Light panel -->
      <div>
        <p
          style="
            color: #374151;
            font-family: system-ui, sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            margin: 0 0 0.5rem;
            text-transform: uppercase;
          "
        >☀ Light</p>
        <div
          data-theme="light"
          style="
            background: var(--lf-color-surface, #ffffff);
            border-radius: var(--lf-radius-md, 0.625rem);
            display: grid;
            gap: 1.5rem;
            padding: 1.5rem;
          "
        >
          ${COLOUR_ROLES.map(variationCard)}
        </div>
      </div>

      <!-- Dark panel -->
      <div>
        <p
          style="
            color: #374151;
            font-family: system-ui, sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            margin: 0 0 0.5rem;
            text-transform: uppercase;
          "
        >☾ Dark</p>
        <div
          data-theme="dark"
          style="
            background: #111827;
            border-radius: var(--lf-radius-md, 0.625rem);
            display: grid;
            gap: 1.5rem;
            padding: 1.5rem;
          "
        >
          ${COLOUR_ROLES.map(variationCard)}
        </div>
      </div>
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
          background: var(--lf-color-primary);
          border: none;
          border-radius: var(--lf-radius-md, 0.625rem);
          color: var(--lf-color-on-primary);
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
        --lf-color-success: #006400;
        --lf-color-warning: #7a4100;
        --lf-color-info: #00008b;
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
      ${colourSwatches()}

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
          background: var(--lf-color-primary);
          border: 2px solid var(--lf-color-primary);
          border-radius: var(--lf-radius-md, 0);
          color: var(--lf-color-on-primary);
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

