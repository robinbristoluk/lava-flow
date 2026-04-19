# lava-flow

A production-ready, framework-agnostic Lit web component library built with strict TypeScript and SCSS.

## Scripts

- `npm run dev` - Vite development preview
- `npm run build` - Library build (`dist/index.js`, `dist/index.d.ts`, `dist/tokens.css`)
- `npm run lint` - ESLint checks for TypeScript + Lit patterns
- `npm run test` - Vitest unit tests
- `npm run storybook` - Storybook for component development
- `npm run build-storybook` - Static Storybook build

## Form components

All form components are individually importable and can be composed in any order.
`lf-form-field` is the recommended all-in-one option for most use cases.

### `lf-form-field`

Composite form field that bundles a label, input, and optional hint/error message in
a single shadow root with a proper accessible `<label for>` association.

```html
<!-- Hint and error are omitted when not set -->
<lf-form-field
  label="Email address"
  name="email"
  type="email"
  placeholder="you@example.com"
  hint="We'll never share your email."
></lf-form-field>

<!-- With validation error -->
<lf-form-field
  label="Email address"
  name="email"
  type="email"
  error="Enter a valid email address."
  required
></lf-form-field>
```

The component is form-associated: its `name` + `value` participate in `<form>` submission.

**Properties** (all optional unless marked)

| Property | Attribute | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | `''` | Visible label text |
| `name` | `name` | `string` | `''` | Form submission name |
| `value` | `value` | `string` | `''` | Current value |
| `type` | `type` | `LfInputType` | `'text'` | HTML input type |
| `placeholder` | `placeholder` | `string` | `''` | Placeholder text |
| `hint` | `hint` | `string` | `''` | Helper text (omitted when empty) |
| `error` | `error` | `string` | `''` | Error message (omitted when empty) |
| `required` | `required` | `boolean` | `false` | Marks the field as required |
| `disabled` | `disabled` | `boolean` | `false` | Disables the field |
| `readonly` | `readonly` | `boolean` | `false` | Makes the field read-only |
| `autocomplete` | `autocomplete` | `string` | `''` | Browser autocomplete hint |
| `minLength` | `min-length` | `number` | `0` | Minimum character count |
| `maxLength` | `max-length` | `number` | `0` | Maximum character count |
| `inputMode` | `inputmode` | `LfInputMode` | `'text'` | Virtual keyboard hint |

**Events**

- `lf-input` — fired on every keystroke (input/textarea modes); `event.detail.value` holds the current value.
- `lf-change` — fired when the value is committed (blur / Enter in input/textarea modes, or whenever the select value changes); `event.detail.value` holds the value.

**CSS parts**: `field`, `label`, `input`, `hint`, `error`

---

### Building blocks (standalone)

Use these individually when you need full layout control.

#### `lf-label`

```html
<lf-label field-id="name-input" label="Full name"></lf-label>
```

**CSS parts**: `label`

#### `lf-input`

Form-associated input component. Set `field-id` to match an `lf-label`'s `field-id`.

```html
<lf-input field-id="name-input" name="fullname" placeholder="John Smith"></lf-input>
```

**Events**: `lf-input` (every keystroke), `lf-change` (committed value)
**CSS parts**: `input`

#### `lf-form-hint`

```html
<lf-form-hint hint="Enter your name as it appears on your ID."></lf-form-hint>
```

**CSS parts**: `hint`

#### `lf-form-error`

```html
<lf-form-error error="This field is required."></lf-form-error>
```

**CSS parts**: `error`

---

## TypeScript types

All components implement `Pick<LfAllFormProps, ...>` of the shared interface, ensuring
each element exposes only the subset of properties relevant to it:

```ts
import type { LfAllFormProps, LfInputType, LfInputMode } from 'lava-flow'
```

## Design tokens

Import the compiled token stylesheet once in your application:

```css
@import 'lava-flow/tokens.css';
```

All tokens are declared on `:root` inside the `lf-tokens` CSS layer, giving any
unlayered consumer rule automatic override precedence.

### Dark / light mode

lava-flow automatically adapts to the OS colour scheme via
`@media (prefers-color-scheme: dark)`. No extra setup is required — just import
`tokens.css` and the components respond to the system setting.

You can also force a mode with the `data-theme` attribute on any ancestor element
(including `<html>`):

```html
<!-- force dark mode regardless of the OS setting -->
<html data-theme="dark">

<!-- force light mode regardless of the OS setting -->
<html data-theme="light">

<!-- scope dark mode to one section of the page -->
<section data-theme="dark">…</section>
```

### Token reference

Each of the five semantic colour roles — **primary**, **success**, **warning**, **info**, and **error** — exposes four sub-tokens plus three new palette variants:

| Sub-token | Purpose |
|---|---|
| `--lf-color-{role}` | Base colour |
| `--lf-color-{role}-hover` | Hover/pressed state |
| `--lf-color-on-{role}` | Foreground (text/icon) placed *on* the base colour |
| `--lf-color-{role}-accent` | Light tint — subtle backgrounds for badges, alerts, chips |
| `--lf-color-{role}-contrast` | Deep shade — text or borders on light surfaces |
| `--lf-color-{role}-complementary` | Harmoniously paired hue from a different colour family |

#### Primary (violet)

| Token | Light | Dark |
|---|---|---|
| `--lf-color-primary` | `#5b21b6` | `#7c3aed` |
| `--lf-color-primary-hover` | `#4c1d95` | `#6d28d9` |
| `--lf-color-on-primary` | `#ffffff` | `#ffffff` |
| `--lf-color-primary-accent` | `#ede9fe` | `#1e1b4b` |
| `--lf-color-primary-contrast` | `#2e1065` | `#c4b5fd` |
| `--lf-color-primary-complementary` | `#b45309` | `#fbbf24` |

#### Secondary (utility)

| Token | Light | Dark |
|---|---|---|
| `--lf-color-secondary` | `#ffffff` | `#1e1b4b` |
| `--lf-color-secondary-hover` | `#f5f3ff` | `#2e2a5e` |
| `--lf-color-secondary-border` | `#5b21b6` | `#7c3aed` |
| `--lf-color-on-secondary` | `#4c1d95` | `#c4b5fd` |

#### Success (green)

| Token | Light | Dark |
|---|---|---|
| `--lf-color-success` | `#16a34a` | `#4ade80` |
| `--lf-color-success-hover` | `#15803d` | `#22c55e` |
| `--lf-color-on-success` | `#052e16` | `#052e16` |
| `--lf-color-success-accent` | `#dcfce7` | `#052e16` |
| `--lf-color-success-contrast` | `#14532d` | `#86efac` |
| `--lf-color-success-complementary` | `#0e7490` | `#22d3ee` |

#### Warning (amber)

| Token | Light | Dark |
|---|---|---|
| `--lf-color-warning` | `#d97706` | `#fbbf24` |
| `--lf-color-warning-hover` | `#b45309` | `#f59e0b` |
| `--lf-color-on-warning` | `#431407` | `#431407` |
| `--lf-color-warning-accent` | `#fef3c7` | `#431407` |
| `--lf-color-warning-contrast` | `#78350f` | `#fde68a` |
| `--lf-color-warning-complementary` | `#dc2626` | `#f87171` |

#### Info (blue)

| Token | Light | Dark |
|---|---|---|
| `--lf-color-info` | `#2563eb` | `#60a5fa` |
| `--lf-color-info-hover` | `#1d4ed8` | `#3b82f6` |
| `--lf-color-on-info` | `#ffffff` | `#172554` |
| `--lf-color-info-accent` | `#dbeafe` | `#172554` |
| `--lf-color-info-contrast` | `#1e3a8a` | `#93c5fd` |
| `--lf-color-info-complementary` | `#7c3aed` | `#a78bfa` |

#### Error (red)

| Token | Light | Dark |
|---|---|---|
| `--lf-color-error` | `#dc2626` | `#f87171` |
| `--lf-color-on-error` | `#ffffff` | `#450a0a` |
| `--lf-color-error-accent` | `#fee2e2` | `#450a0a` |
| `--lf-color-error-contrast` | `#7f1d1d` | `#fca5a5` |
| `--lf-color-error-complementary` | `#b45309` | `#fbbf24` |

#### Surface, interactive, and form tokens

| Token | Light | Dark | Group |
|---|---|---|---|
| `--lf-color-surface` | `#ffffff` | `#111827` | Surface |
| `--lf-color-surface-alt` | `#f9fafb` | `#1f2937` | Surface |
| `--lf-color-focus-ring` | `#7c3aed` | `#a78bfa` | Interactive |
| `--lf-color-label` | `#374151` | `#e5e7eb` | Form |
| `--lf-color-hint` | `#6b7280` | `#9ca3af` | Form |
| `--lf-color-input-bg` | `#ffffff` | `#1f2937` | Form |
| `--lf-color-input-text` | `#111827` | `#f9fafb` | Form |
| `--lf-color-input-border` | `#d1d5db` | `#374151` | Form |
| `--lf-color-input-border-focus` | `#5b21b6` | `#7c3aed` | Form |
| `--lf-color-input-placeholder` | `#9ca3af` | `#6b7280` | Form |
| `--lf-color-input-disabled-bg` | `#f3f4f6` | `#111827` | Form |
| `--lf-color-input-disabled-text` | `#9ca3af` | `#4b5563` | Form |

#### Non-colour tokens

| Token | Default | Group |
|---|---|---|
| `--lf-space-2` | `0.5rem` | Spacing |
| `--lf-space-3` | `0.625rem` | Spacing |
| `--lf-space-4` | `1rem` | Spacing |
| `--lf-font-family-base` | `system-ui, …` | Typography |
| `--lf-font-size-base` | `1rem` | Typography |
| `--lf-font-size-sm` | `0.875rem` | Typography |
| `--lf-font-weight-semibold` | `600` | Typography |
| `--lf-line-height-base` | `1.2` | Typography |
| `--lf-radius-sm` | `0.25rem` | Radius |
| `--lf-radius-md` | `0.625rem` | Radius |
| `--lf-transition-duration` | `150ms` | Motion |
| `--lf-transition-easing` | `ease` | Motion |
| `--lf-shadow-popover` | `0 4px 12px rgb(0 0 0 / 10%)` *(dark: 40%)* | Shadow |
| `--lf-checkbox-size` | `1.125rem` | Component sizes |
| `--lf-radio-size` | `1.125rem` | Component sizes |

### Overriding tokens

```css
/* global override */
:root { --lf-color-primary: #059669; }

/* scoped override */
.checkout-form { --lf-radius-md: 0.25rem; }

/* success alert using the full set */
.alert-success {
  background: var(--lf-color-success-accent);
  border: 1px solid var(--lf-color-success);
  color: var(--lf-color-success-contrast);
}

/* info badge */
.badge-info {
  background: var(--lf-color-info-accent);
  color: var(--lf-color-info-contrast);
}
```
