import { X } from "@phosphor-icons/react"

import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { getCategoryById } from "@/app/cadastros/categorias-de-uh/data/mock-categories"

import { ChildrenCount } from "../../_components/children-count"
import { GuestCount } from "../../_components/guest-count"
import { formatCurrency } from "../../data/reservation-format"
import { mockTariffs } from "../../data/mock-tarifario"
import { calculateDailyRate } from "../../data/tariff-calculator"

export type CategoryOccupancy = {
  categoryId: number
  quantity: string
  adults: string
  childrenAges: string[]
  exempt: string
}

export const CATEGORY_OPTIONS = mockTariffs.map((t) => ({
  categoryId: t.categoryId,
  title: getCategoryById(t.categoryId)?.title ?? `Categoria ${t.categoryId}`,
}))

export function CategoryOccupancyRow({
  occupancy,
  availableCategories,
  breakfast,
  onChange,
  onRemove,
}: {
  occupancy: CategoryOccupancy
  availableCategories: { categoryId: number; title: string }[]
  breakfast: boolean
  onChange: (patch: Partial<CategoryOccupancy>) => void
  onRemove: () => void
}) {
  const tariff = mockTariffs.find((t) => t.categoryId === occupancy.categoryId)

  const perUnit = calculateDailyRate(
    tariff,
    parseInt(occupancy.adults, 10) || 0,
    occupancy.childrenAges.map((age) => parseInt(age, 10) || 0),
    breakfast
  )
  const quantity = parseInt(occupancy.quantity, 10) || 0
  const rowTotal = perUnit.total * quantity

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
      <div className="flex items-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Categoria
          </span>
          <Select
            value={String(occupancy.categoryId)}
            onValueChange={(v) => onChange({ categoryId: Number(v) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value: string) =>
                  availableCategories.find(
                    (c) => String(c.categoryId) === value
                  )?.title
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((c) => (
                <SelectItem key={c.categoryId} value={String(c.categoryId)}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-20 shrink-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Quant.
          </span>
          <Input
            type="number"
            min={1}
            value={occupancy.quantity}
            onChange={(e) => onChange({ quantity: e.target.value })}
          />
        </div>
        <div className="flex w-28 shrink-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Valor
          </span>
          <Input
            readOnly
            tabIndex={-1}
            value={formatCurrency(rowTotal)}
            className="bg-muted text-foreground"
          />
        </div>
        <button
          type="button"
          aria-label="Remover categoria"
          onClick={onRemove}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3 grid max-w-xl grid-cols-3 gap-4 border-t border-dashed border-border pt-3">
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
