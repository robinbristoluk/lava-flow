// Polyfill ElementInternals for happy-dom which does not implement attachInternals.
// This only runs in the test environment and has no effect in real browsers.
if (!('attachInternals' in HTMLElement.prototype)) {
  Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
    configurable: true,
    writable: true,
    value(): ElementInternals {
      const VALIDITY_FLAGS = [
        'badInput',
        'customError',
        'patternMismatch',
        'rangeOverflow',
        'rangeUnderflow',
        'stepMismatch',
        'tooLong',
        'tooShort',
        'typeMismatch',
        'valueMissing',
      ] as const

      const validityState = {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false,
      }

      return {
        setFormValue: () => {},
        setValidity(flags: Record<string, boolean> = {}) {
          for (const flag of VALIDITY_FLAGS) {
            validityState[flag] = !!flags[flag]
          }
          validityState.valid = VALIDITY_FLAGS.every((f) => !validityState[f])
        },
        checkValidity: () => validityState.valid,
        reportValidity: () => validityState.valid,
        get validity() {
          return validityState as unknown as ValidityState
        },
        validationMessage: '',
        willValidate: false,
        form: null,
        labels: null as unknown as NodeList,
        shadowRoot: null,
        role: null,
        ariaAtomic: null,
        ariaAutoComplete: null,
        ariaBusy: null,
        ariaChecked: null,
        ariaColCount: null,
        ariaColIndex: null,
        ariaColSpan: null,
        ariaCurrent: null,
        ariaDescription: null,
        ariaDisabled: null,
        ariaExpanded: null,
        ariaHasPopup: null,
        ariaHidden: null,
        ariaInvalid: null,
        ariaKeyShortcuts: null,
        ariaLabel: null,
        ariaLevel: null,
        ariaLive: null,
        ariaModal: null,
        ariaMultiLine: null,
        ariaMultiSelectable: null,
        ariaOrientation: null,
        ariaPlaceholder: null,
        ariaPosInSet: null,
        ariaPressed: null,
        ariaReadOnly: null,
        ariaRequired: null,
        ariaRoleDescription: null,
        ariaRowCount: null,
        ariaRowIndex: null,
        ariaRowSpan: null,
        ariaSelected: null,
        ariaSetSize: null,
        ariaSort: null,
        ariaValueMax: null,
        ariaValueMin: null,
        ariaValueNow: null,
        ariaValueText: null,
        ariaRelevant: null,
        setCustomValidity: () => {},
      } as unknown as ElementInternals
    },
  })
}
