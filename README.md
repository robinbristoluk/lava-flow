# lava-flow

A production-ready, framework-agnostic Lit web component library built with strict TypeScript and SCSS.

## Scripts

- `npm run dev` - Vite development preview
- `npm run build` - Library build (`dist/index.js`, `dist/index.d.ts`, `dist/tokens.css`)
- `npm run lint` - ESLint checks for TypeScript + Lit patterns
- `npm run test` - Vitest unit tests
- `npm run storybook` - Storybook for component development
- `npm run build-storybook` - Static Storybook build

## Components

### `lf-button`

Accessible, mobile-friendly action button.

- semantic `<button>` behavior
- ARIA state attributes (`aria-busy`, `aria-disabled`, `aria-label`)
- touch-friendly sizing
- framework-friendly `lf-press` custom event

**CSS parts**

- `button`
- `icon`
- `label`

## Design tokens

Design tokens are distributed as a compiled CSS file. Import it once in your
application stylesheet so the custom properties cascade into all `lf-*`
components via the browser's inheritance model (CSS custom properties cross
shadow-DOM boundaries automatically).

```css
@import 'lava-flow/tokens.css';
```

All tokens are declared on `:root` inside the `lf-tokens` CSS layer, which
means any rule outside a layer automatically takes precedence, making
overrides straightforward.

### Token reference

| Token | Default | Group |
|---|---|---|
| `--lf-color-primary` | `#5b21b6` | Colour |
| `--lf-color-primary-hover` | `#4c1d95` | Colour |
| `--lf-color-on-primary` | `#ffffff` | Colour |
| `--lf-color-secondary` | `#ffffff` | Colour |
| `--lf-color-secondary-hover` | `#f5f3ff` | Colour |
| `--lf-color-secondary-border` | `#5b21b6` | Colour |
| `--lf-color-on-secondary` | `#4c1d95` | Colour |
| `--lf-color-focus-ring` | `#7c3aed` | Colour |
| `--lf-space-2` | `0.5rem` | Spacing |
| `--lf-space-3` | `0.625rem` | Spacing |
| `--lf-space-4` | `1rem` | Spacing |
| `--lf-font-family-base` | `system-ui, …` | Typography |
| `--lf-font-size-base` | `1rem` | Typography |
| `--lf-font-weight-semibold` | `600` | Typography |
| `--lf-line-height-base` | `1.2` | Typography |
| `--lf-radius-md` | `0.625rem` | Radius |

### Overriding tokens

Set any token on `:root` or a scoping element — no wrapper component needed:

```css
/* global override */
:root {
  --lf-color-primary: #4f46e5;
  --lf-color-primary-hover: #4338ca;
  --lf-color-focus-ring: #4338ca;
}

/* scoped override */
.my-section {
  --lf-radius-md: 9999px;
}
```

Each component also documents which tokens it consumes via `@cssprop` tags in
its JSDoc, visible in the Storybook autodocs panel.
