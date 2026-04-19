# lava-flow

A production-ready, framework-agnostic Lit web component library built with strict TypeScript and SCSS.

## Scripts

- `npm run dev` - Vite development preview
- `npm run build` - Library build (`dist/index.js`, `dist/index.d.ts`)
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

### `lf-theme`

Theme wrapper component that provides shared CSS custom properties to nested library components.

**CSS parts**

- `container`

## Theming

Wrap components in `lf-theme` to set theme tokens using attributes/properties:

```html
<lf-theme primary-bg="#4f46e5" focus-ring="#4338ca">
  <lf-button label="Continue"></lf-button>
</lf-theme>
```

`lf-button` consumes the following CSS custom properties:

- `--lf-primary-bg`
- `--lf-primary-bg-hover`
- `--lf-primary-text`
- `--lf-secondary-bg`
- `--lf-secondary-bg-hover`
- `--lf-secondary-border`
- `--lf-secondary-text`
- `--lf-focus-ring`

These tokens and parts are documented in component JSDoc using standard web-components tags (`@csspart`, `@cssprop`).
