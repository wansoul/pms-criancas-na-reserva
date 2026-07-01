"use client"

import * as React from "react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { Field, Separator } from "../../_components/form-field"
import { formatCurrency, formatRange } from "../../data/reservation-format"
import { calculateDailyRate } from "../../data/tariff-calculator"
import { mockTariffs } from "../../data/mock-tarifario"
import {
  GroupReservationBaseFields,
  useGroupReservationBase,
} from "./group-reservation-base-fields"
import {
  CATEGORY_OPTIONS,
  CategoryOccupancyRow,
  type CategoryOccupancy,
} from "./category-occupancy-row"

export const GROUP_RESERVATION_BY_CATEGORY_FORM_ID =
  "group-reservation-form-by-category"

function newCategoryOccupancy(categoryId: number): CategoryOccupancy {
  return {
    categoryId,
    quantity: "1",
    adults: "1",
    childrenAges: [],
    exempt: "0",
  }
}

/** Fields + state for the group reservation form where UHs are chosen by category + quantity instead of individually. Mocked — no persistence. */
export function GroupReservationFormByCategoryFields({
  formId = GROUP_RESERVATION_BY_CATEGORY_FORM_ID,
  onSubmitted,
}: {
  formId?: string
  onSubmitted: () => void
}) {
  const base = useGroupReservationBase()
  const [rows, setRows] = React.useState<CategoryOccupancy[]>([])
  const [showBreakdown, setShowBreakdown] = React.useState(false)

  const usedCategoryIds = new Set(rows.map((r) => r.categoryId))
  const canAddRow = usedCategoryIds.size < CATEGORY_OPTIONS.length

  function addRow() {
    const next = CATEGORY_OPTIONS.find(
      (c) => !usedCategoryIds.has(c.categoryId)
    )
    if (!next) return
    setRows((prev) => [...prev, newCategoryOccupancy(next.categoryId)])
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  function patchRow(index: number, patch: Partial<CategoryOccupancy>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    )
  }

  function availableCategoriesFor(index: number) {
    const current = rows[index]?.categoryId
    return CATEGORY_OPTIONS.filter(
      (c) => c.categoryId === current || !usedCategoryIds.has(c.categoryId)
    )
  }

  const rowBreakdowns = rows.map((row) => {
    const tariff = mockTariffs.find((t) => t.categoryId === row.categoryId)
    const quantity = parseInt(row.quantity, 10) || 0
    const breakdown = calculateDailyRate(
      tariff,
      parseInt(row.adults, 10) || 0,
      row.childrenAges.map((age) => parseInt(age, 10) || 0),
      base.breakfast
    )
    return {
      row,
      tariff,
      quantity,
      breakdown,
      rowTotal: breakdown.total * quantity,
    }
  })

  const totalPerNight = rowBreakdowns.reduce((sum, b) => sum + b.rowTotal, 0)
  const totalGeral = totalPerNight * base.nights

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock: nothing is persisted.
    onSubmitted()
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-1"
    >
      <GroupReservationBaseFields base={base} />

      <Separator />

      {/* UHs por categoria */}
      <Field label="UHs" required alignTop>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {rows.map((row, index) => (
              <CategoryOccupancyRow
                key={row.categoryId}
                occupancy={row}
                availableCategories={availableCategoriesFor(index)}
                breakfast={base.breakfast}
                onChange={(patch) => patchRow(index, patch)}
                onRemove={() => removeRow(index)}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            disabled={!canAddRow}
            onClick={addRow}
          >
            + Adicionar categoria
          </Button>
        </div>
      </Field>

      {/* Valor total das diárias */}
      <Field label="Valor total" required>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 text-sm">
              {formatCurrency(totalGeral)}
            </Badge>
            {rows.length > 0 && (
              <button
                type="button"
                onClick={() => setShowBreakdown((v) => !v)}
                className="text-xs text-primary hover:underline"
              >
                ver detalhes {showBreakdown ? "▴" : "▾"}
              </button>
            )}
          </div>
          {showBreakdown && rows.length > 0 && (
            <div className="flex max-w-sm flex-col gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              {rowBreakdowns.map(
                ({ row, tariff, quantity, breakdown, rowTotal }) => (
                  <div key={row.categoryId} className="flex flex-col gap-1">
                    <div className="flex justify-between gap-3">
                      <span>
                        {
                          CATEGORY_OPTIONS.find(
                            (c) => c.categoryId === row.categoryId
                          )?.title
                        }
                        {tariff && ` (até ${tariff.baseOccupancy} hóspedes)`}
                      </span>
                      <span>{formatCurrency(breakdown.basePrice)}</span>
                    </div>
                    {breakdown.extraAdultsCount > 0 && (
                      <div className="flex justify-between gap-3 pl-3">
                        <span>
                          {breakdown.extraAdultsCount} adulto
                          {breakdown.extraAdultsCount > 1 ? "s" : ""} extra
                        </span>
                        <span>
                          {formatCurrency(breakdown.extraAdultsTotal)}
                        </span>
                      </div>
                    )}
                    {breakdown.extraChildLines.map((line, i) => (
                      <div key={i} className="flex justify-between gap-3 pl-3">
                        <span>{line.label}</span>
                        <span>{formatCurrency(line.price)}</span>
                      </div>
                    ))}
                    {breakdown.breakfastPrice > 0 && (
                      <div className="flex justify-between gap-3 pl-3">
                        <span>Café da manhã</span>
                        <span>{formatCurrency(breakdown.breakfastPrice)}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-3 pl-3">
                      <span>
                        × {quantity} {quantity === 1 ? "UH" : "UHs"}
                      </span>
                      <span>{formatCurrency(rowTotal)}</span>
                    </div>
                  </div>
                )
              )}
              <div className="flex justify-between gap-3 border-t border-border pt-1 font-medium text-foreground">
                <span>Total por diária</span>
                <span>{formatCurrency(totalPerNight)}</span>
              </div>
              <div>
                × {base.nights} {base.nights === 1 ? "diária" : "diárias"} (
                {formatRange(base.period)})
              </div>
            </div>
          )}
        </div>
      </Field>

      {/* Placa de veículo */}
      <Field label="Placa de veículo">
        <Input
          value={base.plate}
          onChange={(e) => base.setPlate(e.target.value)}
          className="max-w-md"
        />
      </Field>

      {/* Observação */}
      <Field label="Observação" alignTop>
        <textarea
          value={base.notes}
          onChange={(e) => base.setNotes(e.target.value)}
          rows={4}
          className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </Field>
    </form>
  )
}
