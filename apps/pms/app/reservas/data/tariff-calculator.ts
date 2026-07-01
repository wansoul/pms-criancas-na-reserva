// ─── Cálculo de diária a partir do tarifário (lógica pura) ─────────────────
// Sem React, sem estado — apenas funções puras consumidas pelo formulário de
// nova reserva para derivar o valor da diária a partir da ocupação informada.

import type { ChildBand, Tariff } from "./mock-tarifario"

export function isChildExempt(age: number, tariff: Tariff): boolean {
  return tariff.childBands.some(
    (band) => band.price === 0 && age >= band.minAge && age <= band.maxAge
  )
}

function findChildBand(age: number, tariff: Tariff): ChildBand | undefined {
  return tariff.childBands.find(
    (band) => age >= band.minAge && age <= band.maxAge
  )
}

/** Ages covered by paying bands (price > 0), ascending — used to populate the age dropdown. */
export function getPayingChildAges(tariff: Tariff): number[] {
  const ages = new Set<number>()
  for (const band of tariff.childBands) {
    if (band.price === 0) continue
    for (let age = band.minAge; age <= band.maxAge; age++) {
      ages.add(age)
    }
  }
  return Array.from(ages).sort((a, b) => a - b)
}

export type RateBreakdown = {
  basePrice: number
  extraAdultsCount: number
  extraAdultsTotal: number
  extraChildLines: { label: string; price: number }[]
  /** Acréscimo de café da manhã aplicado a esta diária (0 quando não incluído). */
  breakfastPrice: number
  total: number
}

export function calculateDailyRate(
  tariff: Tariff | undefined,
  adults: number,
  childrenAges: number[],
  breakfast: boolean = false
): RateBreakdown {
  if (!tariff) {
    return {
      basePrice: 0,
      extraAdultsCount: 0,
      extraAdultsTotal: 0,
      extraChildLines: [],
      breakfastPrice: 0,
      total: 0,
    }
  }

  // 1. Adultos preenchem a base primeiro.
  const adultsInBase = Math.min(adults, tariff.baseOccupancy)
  let remainingBaseSlots = tariff.baseOccupancy - adultsInBase

  // 2. Vagas restantes da base são preenchidas pelas crianças pagantes, na
  // ordem em que aparecem em childrenAges (sem reordenar).
  const extraPayingChildren: number[] = []
  for (const age of childrenAges) {
    if (isChildExempt(age, tariff)) continue // isentas nunca ocupam vaga.

    if (remainingBaseSlots > 0) {
      remainingBaseSlots -= 1
      continue
    }
    extraPayingChildren.push(age)
  }

  // 3. Adultos extras.
  const extraAdultsCount = adults - adultsInBase
  const extraAdultsTotal = extraAdultsCount * tariff.extraAdultPrice

  // 4. Agrupa crianças extras por faixa/preço (fallback = preço de adulto extra).
  type GroupKey = string
  const groups = new Map<
    GroupKey,
    { label: string; price: number; count: number }
  >()

  for (const age of extraPayingChildren) {
    const band = findChildBand(age, tariff)
    if (band) {
      const key = `band:${band.minAge}-${band.maxAge}-${band.price}`
      const existing = groups.get(key)
      if (existing) {
        existing.count += 1
      } else {
        groups.set(key, {
          label: `(${band.minAge}–${band.maxAge} anos)`,
          price: band.price,
          count: 1,
        })
      }
    } else {
      const key = "fallback"
      const existing = groups.get(key)
      if (existing) {
        existing.count += 1
      } else {
        groups.set(key, {
          label: "(fora de faixa)",
          price: tariff.extraAdultPrice,
          count: 1,
        })
      }
    }
  }

  const extraChildLines = Array.from(groups.values()).map(
    ({ label, price, count }) => ({
      label: `${count} criança${count > 1 ? "s" : ""} ${label}`,
      price: price * count,
    })
  )

  const breakfastPrice = breakfast ? tariff.breakfastPrice : 0

  const total =
    tariff.basePrice +
    extraAdultsTotal +
    extraChildLines.reduce((sum, line) => sum + line.price, 0) +
    breakfastPrice

  return {
    basePrice: tariff.basePrice,
    extraAdultsCount,
    extraAdultsTotal,
    extraChildLines,
    breakfastPrice,
    total,
  }
}
