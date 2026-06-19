// ─── Tarifário (mock) ───────────────────────────────────────────────────────
// Modelo simplificado de tarifa por categoria de UH: ocupação base, valor
// base, valor por adulto extra e faixas etárias de criança (isenta/pagantes).
// Vinculado por categoria (UhCategory.id em
// app/cadastros/categorias-de-uh/data/mock-categories.ts), não diretamente
// por UH — múltiplas UHs da mesma categoria compartilham a mesma tarifa.

export type ChildBand = {
  minAge: number
  maxAge: number
  /** 0 = faixa isenta. */
  price: number
}

export type Tariff = {
  /** Referencia UhCategory.id em app/cadastros/categorias-de-uh/data/mock-categories.ts */
  categoryId: number
  baseOccupancy: number
  basePrice: number
  extraAdultPrice: number
  /** Ordenadas por idade crescente. Deve cobrir ao menos uma faixa isenta (price: 0). */
  childBands: ChildBand[]
}

export const mockTariffs: Tariff[] = [
  // Standard Casal (id 1) — exemplo original do pedido.
  {
    categoryId: 1,
    baseOccupancy: 2,
    basePrice: 200,
    extraAdultPrice: 80,
    childBands: [
      { minAge: 0, maxAge: 5, price: 0 },
      { minAge: 6, maxAge: 10, price: 50 },
      { minAge: 11, maxAge: 14, price: 80 },
    ],
  },
  // Suíte Casal (id 2) — categoria superior, valores mais altos.
  {
    categoryId: 2,
    baseOccupancy: 2,
    basePrice: 320,
    extraAdultPrice: 110,
    childBands: [
      { minAge: 0, maxAge: 6, price: 0 },
      { minAge: 7, maxAge: 12, price: 70 },
    ],
  },
  // Chalé Família (id 3) — ocupação base maior, pensada para famílias.
  {
    categoryId: 3,
    baseOccupancy: 4,
    basePrice: 450,
    extraAdultPrice: 90,
    childBands: [
      { minAge: 0, maxAge: 4, price: 0 },
      { minAge: 5, maxAge: 9, price: 40 },
      { minAge: 10, maxAge: 15, price: 65 },
    ],
  },
  // Suíte Superior (id 4) — categoria premium.
  {
    categoryId: 4,
    baseOccupancy: 2,
    basePrice: 380,
    extraAdultPrice: 120,
    childBands: [
      { minAge: 0, maxAge: 5, price: 0 },
      { minAge: 6, maxAge: 12, price: 90 },
    ],
  },
]

/** UH do formulário (string livre, hoje em UHS) → categoria já cadastrada. */
export const UH_CATEGORY: Record<string, number> = {
  "Apto 01": 1,
  "Apto 02": 1,
  "Apto 03": 2,
  "Apto 04": 4,
  "Chalé 01": 3,
}

export function getTariffForUh(uh: string): Tariff | undefined {
  const categoryId = UH_CATEGORY[uh]
  if (categoryId === undefined) return undefined
  return mockTariffs.find((t) => t.categoryId === categoryId)
}
