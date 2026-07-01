"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CornersOut, Plus } from "@phosphor-icons/react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { getCategoryById } from "@/app/cadastros/categorias-de-uh/data/mock-categories"

import { Field, Separator } from "../../_components/form-field"
import { getTariffForUh } from "../../data/mock-tarifario"
import { formatCurrency, formatRange } from "../../data/reservation-format"
import { calculateDailyRate } from "../../data/tariff-calculator"
import {
  GroupReservationBaseFields,
  useGroupReservationBase,
} from "./group-reservation-base-fields"
import { UhOccupancyCard, type UhOccupancy } from "./uh-occupancy-card"

const LIST_URL = "/reservas"

export const GROUP_RESERVATION_FORM_ID = "group-reservation-form"

const UHS = ["Apto 01", "Apto 02", "Apto 03", "Apto 04", "Chalé 01"]

function newOccupancy(uh: string): UhOccupancy {
  return { uh, adults: "1", childrenAges: [], exempt: "0" }
}

/** Fields + state for the group reservation form, shared by the full-page and modal variants. Mocked — no persistence. */
export function GroupReservationFormFields({
  formId = GROUP_RESERVATION_FORM_ID,
  onSubmitted,
}: {
  formId?: string
  onSubmitted: () => void
}) {
  const base = useGroupReservationBase()
  const [uhs, setUhs] = React.useState<UhOccupancy[]>([])
  const [showBreakdown, setShowBreakdown] = React.useState(false)

  const availableUhs = UHS.filter((u) => !uhs.some((occ) => occ.uh === u))

  const availableUhsByCategory: { category: string; uhs: string[] }[] = []
  for (const uh of availableUhs) {
    const tariff = getTariffForUh(uh)
    const category = tariff
      ? getCategoryById(tariff.categoryId)?.title
      : undefined
    const label = category ?? "Outras"
    const group = availableUhsByCategory.find((g) => g.category === label)
    if (group) {
      group.uhs.push(uh)
    } else {
      availableUhsByCategory.push({ category: label, uhs: [uh] })
    }
  }

  function addUh(uh: string) {
    if (!uh || uhs.some((occ) => occ.uh === uh)) return
    setUhs((prev) => [...prev, newOccupancy(uh)])
  }

  function removeUh(uh: string) {
    setUhs((prev) => prev.filter((occ) => occ.uh !== uh))
  }

  function patchUh(uh: string, patch: Partial<Omit<UhOccupancy, "uh">>) {
    setUhs((prev) =>
      prev.map((occ) => (occ.uh === uh ? { ...occ, ...patch } : occ))
    )
  }

  const uhBreakdowns = uhs.map((occ) => {
    const tariff = getTariffForUh(occ.uh)
    const breakdown = calculateDailyRate(
      tariff,
      parseInt(occ.adults, 10) || 0,
      occ.childrenAges.map((age) => parseInt(age, 10) || 0),
      base.breakfast
    )
    return { uh: occ.uh, tariff, breakdown }
  })

  const totalPerNight = uhBreakdowns.reduce(
    (sum, b) => sum + b.breakdown.total,
    0
  )
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

      {/* UHs */}
      <Field label="UHs" required alignTop>
        <div className="flex flex-col gap-3">
          <Select value="" onValueChange={(v) => addUh(v ?? "")}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="+ adicionar UH" />
            </SelectTrigger>
            <SelectContent>
              {availableUhsByCategory.map(
                ({ category, uhs: uhsInCategory }) => (
                  <SelectGroup key={category}>
                    <SelectLabel>{category}</SelectLabel>
                    {uhsInCategory.map((u) => (
                      <SelectItem key={u} value={u}>
                        <Plus className="size-3.5" />
                        {u}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )
              )}
            </SelectContent>
          </Select>

          <div className="flex flex-col gap-3">
            {uhs.map((occ) => (
              <UhOccupancyCard
                key={occ.uh}
                occupancy={occ}
                breakfast={base.breakfast}
                onChange={(patch) => patchUh(occ.uh, patch)}
                onRemove={() => removeUh(occ.uh)}
              />
            ))}
          </div>
        </div>
      </Field>

      {/* Valor total das diárias */}
      <Field label="Valor total" required>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 text-sm">
              {formatCurrency(totalGeral)}
            </Badge>
            {uhs.length > 0 && (
              <button
                type="button"
                onClick={() => setShowBreakdown((v) => !v)}
                className="text-xs text-primary hover:underline"
              >
                ver detalhes {showBreakdown ? "▴" : "▾"}
              </button>
            )}
          </div>
          {showBreakdown && uhs.length > 0 && (
            <div className="flex max-w-sm flex-col gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              {uhBreakdowns.map(({ uh, tariff, breakdown }) => (
                <div key={uh} className="flex flex-col gap-1">
                  <div className="flex justify-between gap-3">
                    <span>
                      {uh}
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
                      <span>{formatCurrency(breakdown.extraAdultsTotal)}</span>
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
                </div>
              ))}
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

/** Full-page create flow for a group reservation. */
export function GroupReservationForm() {
  const router = useRouter()

  return (
    <Card className="h-fit overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h1 className="text-sm font-semibold tracking-wide text-foreground uppercase">
          Nova reserva em grupo
        </h1>
        <CornersOut className="size-4 text-muted-foreground" />
      </div>
      <CardContent className="px-5 py-5">
        <div className="flex flex-col gap-6">
          <GroupReservationFormFields
            onSubmitted={() => router.push(LIST_URL)}
          />
          <Separator />
          <div className="flex justify-end">
            <Button type="submit" form={GROUP_RESERVATION_FORM_ID}>
              Adicionar reserva em grupo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
