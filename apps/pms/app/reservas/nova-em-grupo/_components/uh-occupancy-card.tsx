import { X } from "@phosphor-icons/react"

import { getCategoryById } from "@/app/cadastros/categorias-de-uh/data/mock-categories"

import { ChildrenCount } from "../../_components/children-count"
import { GuestCount } from "../../_components/guest-count"
import { getTariffForUh } from "../../data/mock-tarifario"
import { calculateDailyRate } from "../../data/tariff-calculator"

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export type UhOccupancy = {
  uh: string
  adults: string
  childrenAges: string[]
  exempt: string
}

export function UhOccupancyCard({
  occupancy,
  breakfast,
  onChange,
  onRemove,
}: {
  occupancy: UhOccupancy
  breakfast: boolean
  onChange: (patch: Partial<Omit<UhOccupancy, "uh">>) => void
  onRemove: () => void
}) {
  const tariff = getTariffForUh(occupancy.uh)
  const category = tariff ? getCategoryById(tariff.categoryId) : undefined

  const breakdown = calculateDailyRate(
    tariff,
    parseInt(occupancy.adults, 10) || 0,
    occupancy.childrenAges.map((age) => parseInt(age, 10) || 0),
    breakfast
  )

  function setChildrenCount(value: string) {
    const count = Math.max(0, parseInt(value, 10) || 0)
    const prev = occupancy.childrenAges
    onChange({
      childrenAges:
        count > prev.length
          ? [...prev, ...Array(count - prev.length).fill("")]
          : prev.slice(0, count),
    })
  }

  function setChildAge(index: number, value: string) {
    onChange({
      childrenAges: occupancy.childrenAges.map((age, i) =>
        i === index ? value : age
      ),
    })
  }

  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 truncate text-sm font-medium text-foreground">
          {occupancy.uh}
          {category && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              · {category.title}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {formatCurrency(breakdown.total)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              /diária
            </span>
          </span>
          <button
            type="button"
            aria-label={`Remover ${occupancy.uh}`}
            onClick={onRemove}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid max-w-xl grid-cols-3 gap-4">
        <GuestCount
          label="Nº adultos"
          required
          value={occupancy.adults}
          onChange={(v) => onChange({ adults: v })}
          min={1}
        />
        <ChildrenCount
          ages={occupancy.childrenAges}
          onCountChange={setChildrenCount}
          onAgeChange={setChildAge}
          tariff={tariff}
        />
        <GuestCount
          label="Nº isentos"
          value={occupancy.exempt}
          onChange={(v) => onChange({ exempt: v })}
          min={0}
        />
      </div>
    </div>
  )
}
