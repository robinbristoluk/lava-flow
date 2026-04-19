# AI Agent Considerations

- Keep this repository framework-agnostic: build standard Web Components with Lit and avoid React/Vue/Angular-specific runtime assumptions.
- Maintain strict TypeScript and resolve lint/type violations before proposing changes.
- Prioritize accessibility by default (semantic elements, keyboard support, ARIA only when needed, and clear accessible names).
- Ensure components remain mobile-friendly with touch-target sizing, responsive layout behavior, and resilient styling.
- Preserve Storybook stories and tests as living documentation for component behavior and accessibility.
- Avoid introducing breaking API changes to custom element names, public attributes/properties, and dispatched events without explicit migration notes.
