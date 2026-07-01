import type { DateRange } from "react-day-picker"

export function nightsBetween(range?: DateRange) {
  if (!range?.from || !range?.to) return 0
  const ms = range.to.getTime() - range.from.getTime()
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)))
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd}/${mm}/${d.getFullYear()}`
}

export function formatRange(range?: DateRange) {
  if (!range?.from) return ""
  if (!range.to) return formatDate(range.from)
  return `${formatDate(range.from)} - ${formatDate(range.to)}`
}

/** Default to a single-night stay starting today. */
export function defaultPeriod(): DateRange {
  const from = new Date()
  const to = new Date()
  to.setDate(from.getDate() + 1)
  return { from, to }
}
