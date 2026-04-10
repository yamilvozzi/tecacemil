// Shared payment method constants — single source of truth

export const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'debito',   label: 'Débito / Transf.' },
  { value: 'visa',     label: 'VISA' },
  { value: 'amex',     label: 'AMEX' },
]

export function pmLabel(value) {
  return PAYMENT_METHODS.find(p => p.value === value)?.label || value
}

export function pmTag(value) {
  const map = {
    visa:     { label: 'VISA',            cls: 'tag-visa'     },
    amex:     { label: 'AMEX',            cls: 'tag-amex'     },
    debito:   { label: 'Débito / Transf.', cls: 'tag-debito'   },
    efectivo: { label: 'Efectivo',         cls: 'tag-efectivo' },
    // legacy aliases
    visa_yamil:    { label: 'VISA', cls: 'tag-visa' },
    visa_celeste:  { label: 'VISA', cls: 'tag-visa' },
    amex_yamil:    { label: 'AMEX', cls: 'tag-amex' },
    amex_celeste:  { label: 'AMEX', cls: 'tag-amex' },
  }
  const entry = map[value] || map['efectivo']
  return <span className={`tag ${entry.cls}`}>{entry.label}</span>
}
