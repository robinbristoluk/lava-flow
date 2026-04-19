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

- `lf-change` — fired on every input event; `event.detail.value` holds the current value.

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

### Token reference

| Token | Default | Group |
|---|---|---|
| `--lf-color-label` | `#374151` | Colour |
| `--lf-color-hint` | `#6b7280` | Colour |
| `--lf-color-error` | `#dc2626` | Colour |
| `--lf-color-input-bg` | `#ffffff` | Colour |
| `--lf-color-input-text` | `#111827` | Colour |
| `--lf-color-input-border` | `#d1d5db` | Colour |
| `--lf-color-input-border-focus` | `#5b21b6` | Colour |
| `--lf-color-input-placeholder` | `#9ca3af` | Colour |
| `--lf-color-input-disabled-bg` | `#f3f4f6` | Colour |
| `--lf-color-input-disabled-text` | `#9ca3af` | Colour |
| `--lf-color-focus-ring` | `#7c3aed` | Colour |
| `--lf-space-2` | `0.5rem` | Spacing |
| `--lf-space-3` | `0.625rem` | Spacing |
| `--lf-space-4` | `1rem` | Spacing |
| `--lf-font-family-base` | `system-ui, …` | Typography |
| `--lf-font-size-base` | `1rem` | Typography |
| `--lf-font-size-sm` | `0.875rem` | Typography |
| `--lf-font-weight-semibold` | `600` | Typography |
| `--lf-line-height-base` | `1.2` | Typography |
| `--lf-radius-md` | `0.625rem` | Radius |

### Overriding tokens

```css
/* global */
:root { --lf-color-input-border-focus: #4f46e5; }

/* scoped */
.checkout-form { --lf-radius-md: 0.25rem; }
```
