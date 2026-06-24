"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DateRange } from "react-day-picker"
import { ptBR } from "react-day-picker/locale"
import { CalendarBlank, CornersOut, UserPlus } from "@phosphor-icons/react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Switch } from "@workspace/ui/components/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

import { getTariffForUh, type Tariff } from "../data/mock-tarifario"
import { calculateDailyRate, getPayingChildAges } from "../data/tariff-calculator"

const LIST_URL = "/reservas"

// ─── Situação (ação ao criar a reserva) ───────────────────────────────────────
// Each option maps to the lifecycle status the new reservation starts in.
type SituacaoOption = {
  value: string
  label: string
  /** Chip color when selected. */
  chipClass: string
}

// Ordered to match the reference layout (row-major over a 3-column grid):
// pré-reservar | hospedar | em espera
// reservar     | bloquear datas
const SITUACOES: SituacaoOption[] = [
  { value: "pre-reservar", label: "pré-reservar", chipClass: "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300" },
  { value: "hospedar", label: "hospedar", chipClass: "bg-orange-500 text-white" },
  { value: "em-espera", label: "em espera", chipClass: "bg-pink-500 text-white" },
  { value: "reservar", label: "reservar", chipClass: "bg-blue-500 text-white" },
  { value: "bloquear-datas", label: "bloquear datas", chipClass: "bg-zinc-700 text-white" },
]

const GUESTS = ["Eduardo Santos", "Aline Dias", "Thaise Gomes", "Gabriel Martinez Santamaria"]
const UHS = ["Apto 01", "Apto 02", "Apto 03", "Apto 04", "Chalé 01"]
const CHANNELS = ["Booking.com", "Airbnb", "Expedia", "Site próprio", "Balcão"]

function nightsBetween(range?: DateRange) {
  if (!range?.from || !range?.to) return 0
  const ms = range.to.getTime() - range.from.getTime()
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)))
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd}/${mm}/${d.getFullYear()}`
}

function formatRange(range?: DateRange) {
  if (!range?.from) return ""
  if (!range.to) return formatDate(range.from)
  return `${formatDate(range.from)} - ${formatDate(range.to)}`
}

// Default to a single-night stay starting today.
function defaultPeriod(): DateRange {
  const from = new Date()
  const to = new Date()
  to.setDate(from.getDate() + 1)
  return { from, to }
}

/** Create form for a new reservation. Mocked — no persistence. */
export function ReservationForm() {
  const router = useRouter()

  const [situacao, setSituacao] = React.useState("pre-reservar")
  const [guest, setGuest] = React.useState("")
  const [period, setPeriod] = React.useState<DateRange | undefined>(defaultPeriod)
  const [uh, setUh] = React.useState("")
  const [breakfast, setBreakfast] = React.useState(false)
  const [channel, setChannel] = React.useState("")
  const [adults, setAdults] = React.useState("1")
  const [childrenAges, setChildrenAges] = React.useState<string[]>([])
  const [exempt, setExempt] = React.useState("0")
  const [plate, setPlate] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [showBreakdown, setShowBreakdown] = React.useState(false)

  function setChildrenCount(value: string) {
    const count = Math.max(0, parseInt(value, 10) || 0)
    setChildrenAges((prev) =>
      count > prev.length
        ? [...prev, ...Array(count - prev.length).fill("")]
        : prev.slice(0, count)
    )
  }

  function setChildAge(index: number, value: string) {
    setChildrenAges((prev) => prev.map((age, i) => (i === index ? value : age)))
  }

  const nights = nightsBetween(period)
  // Calculated from the rate defined in the tarifário for the selected UH — not user-editable.
  const tariff = getTariffForUh(uh)
  const breakdown = calculateDailyRate(
    tariff,
    parseInt(adults, 10) || 0,
    childrenAges.map((age) => parseInt(age, 10) || 0),
    breakfast
  )
  const totalDiarias = breakdown.total * nights

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock: nothing is persisted — return to the list.
    router.push(LIST_URL)
  }

  return (
    <Card className="h-fit overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h1 className="text-sm font-semibold tracking-wide text-foreground uppercase">
          Nova reserva
        </h1>
        <CornersOut className="size-4 text-muted-foreground" />
      </div>
      <CardContent className="px-5 py-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-1">
      {/* Situação */}
      <Field label="Situação" required alignTop>
        <div className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
          {SITUACOES.map((s) => {
            const selected = situacao === s.value
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setSituacao(s.value)}
                className="group flex items-center gap-2 text-left"
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selected ? "border-primary" : "border-muted-foreground/40"
                  )}
                >
                  {selected && <span className="size-2 rounded-full bg-primary" />}
                </span>
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-medium transition-opacity",
                    s.chipClass,
                    !selected && "opacity-70 group-hover:opacity-100"
                  )}
                >
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </Field>

      <Separator />

      {/* Hóspede */}
      <Field label="Hóspede" required>
        <div className="flex items-center gap-2">
          <Select value={guest} onValueChange={(v) => setGuest(v ?? "")}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {GUESTS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            aria-label="Cadastrar novo hóspede"
            className="shrink-0 rounded-md p-1.5 text-primary transition-colors hover:bg-muted"
          >
            <UserPlus className="size-5" />
          </button>
        </div>
      </Field>

      {/* Período */}
      <Field label="Período" required>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger
              className={cn(
                "flex h-(--density-input-height) w-full max-w-xs items-center gap-2 rounded-md border border-input bg-transparent px-3 text-left text-sm shadow-xs outline-none transition-[color,box-shadow] hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:border-ring dark:bg-input/30"
              )}
            >
              <CalendarBlank className="size-4 shrink-0 text-muted-foreground" />
              <span className={cn(!period?.from && "text-muted-foreground")}>
                {formatRange(period) || "Selecione o período"}
              </span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={period}
                onSelect={setPeriod}
                locale={ptBR}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <Badge className="shrink-0 px-3 py-1 text-sm">
            {nights} {nights === 1 ? "diária" : "diárias"}
          </Badge>
        </div>
      </Field>

      {/* UH */}
      <Field label="UH" required>
        <Select value={uh} onValueChange={(v) => setUh(v ?? "")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {UHS.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Café da manhã */}
      <Field label="Café da manhã">
        <Switch checked={breakfast} onCheckedChange={setBreakfast} />
      </Field>

      {/* Canal de venda */}
      <Field label="Canal de venda">
        <Select value={channel} onValueChange={(v) => setChannel(v ?? "")}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="» selecione o canal de venda «" />
          </SelectTrigger>
          <SelectContent>
            {CHANNELS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Nº hóspedes */}
      <Field label="Nº hóspedes" alignTop>
        <div className="grid max-w-xl grid-cols-3 gap-4">
          <GuestCount label="Nº adultos" required value={adults} onChange={setAdults} min={1} />
          <ChildrenCount
            ages={childrenAges}
            onCountChange={setChildrenCount}
            onAgeChange={setChildAge}
            tariff={tariff}
          />
          <GuestCount label="Nº isentos" value={exempt} onChange={setExempt} min={0} />
        </div>
      </Field>

      {/* Valor total das diárias */}
      <Field label="Valor total das diárias" required>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 text-sm">{formatCurrency(totalDiarias)}</Badge>
            {tariff && (
              <button
                type="button"
                onClick={() => setShowBreakdown((v) => !v)}
                className="text-xs text-primary hover:underline"
              >
                ver detalhes {showBreakdown ? "▴" : "▾"}
              </button>
            )}
          </div>
          {showBreakdown && tariff && (
            <div className="flex max-w-sm flex-col gap-1 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <div className="flex justify-between gap-3">
                <span>Diária base (até {tariff.baseOccupancy} hóspedes)</span>
                <span>{formatCurrency(breakdown.basePrice)}</span>
              </div>
              {breakdown.extraAdultsCount > 0 && (
                <div className="flex justify-between gap-3">
                  <span>
                    {breakdown.extraAdultsCount} adulto{breakdown.extraAdultsCount > 1 ? "s" : ""} extra
                  </span>
                  <span>{formatCurrency(breakdown.extraAdultsTotal)}</span>
                </div>
              )}
              {breakdown.extraChildLines.map((line, i) => (
                <div key={i} className="flex justify-between gap-3">
                  <span>{line.label}</span>
                  <span>{formatCurrency(line.price)}</span>
                </div>
              ))}
              {breakdown.breakfastPrice > 0 && (
                <div className="flex justify-between gap-3">
                  <span>Café da manhã</span>
                  <span>{formatCurrency(breakdown.breakfastPrice)}</span>
                </div>
              )}
              <div className="flex justify-between gap-3 border-t border-border pt-1 font-medium text-foreground">
                <span>Valor por diária</span>
                <span>{formatCurrency(breakdown.total)}</span>
              </div>
              <div>
                × {nights} {nights === 1 ? "diária" : "diárias"} ({formatRange(period)})
              </div>
            </div>
          )}
        </div>
      </Field>

      {/* Placa de veículo */}
      <Field label="Placa de veículo">
        <Input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          className="max-w-md"
        />
      </Field>

      {/* Observação */}
      <Field label="Observação" alignTop>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </Field>

      <Separator />

      <div className="flex justify-end">
        <Button type="submit">Adicionar Reserva</Button>
      </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Separator() {
  return <div className="border-t border-border" />
}

/** Label-left, control-right form row (desktop-primary). */
function Field({
  label,
  required,
  alignTop,
  children,
}: {
  label: string
  required?: boolean
  alignTop?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid gap-1.5 sm:grid-cols-[160px_1fr] sm:gap-6",
        alignTop ? "sm:items-start" : "sm:items-center"
      )}
    >
      <label className={cn("text-sm font-medium text-foreground sm:text-right", alignTop && "sm:pt-1.5")}>
        {required && <span className="text-destructive">* </span>}
        {label}
      </label>
      <div>{children}</div>
    </div>
  )
}

function GuestCount({
  label,
  required,
  value,
  onChange,
  min,
}: {
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  min: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {required && <span className="text-destructive">* </span>}
        {label}
      </span>
      <Input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function ChildrenCount({
  ages,
  onCountChange,
  onAgeChange,
  tariff,
}: {
  ages: string[]
  onCountChange: (v: string) => void
  onAgeChange: (index: number, v: string) => void
  tariff: Tariff | undefined
}) {
  const payingAges = tariff ? getPayingChildAges(tariff) : []

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        <span className="text-destructive">* </span>Nº crianças
      </span>
      <Input type="number" min={0} value={String(ages.length)} onChange={(e) => onCountChange(e.target.value)} />
      {ages.length > 0 && (
        <div className="mt-1 flex flex-col gap-1.5">
          {ages.map((age, i) => {
            const select = (
              <Select
                value={age}
                onValueChange={(v) => onAgeChange(i, v ?? "")}
                disabled={!tariff}
              >
                <SelectTrigger size="sm" className="h-7 w-24 px-2 text-xs">
                  <SelectValue placeholder="Idade">
                    {(value) => (value ? `${value} anos` : "Idade")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {payingAges.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      {a} anos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
            return (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Criança {i + 1}</span>
                {tariff ? (
                  select
                ) : (
                  <Tooltip>
                    {/* A disabled control doesn't fire pointer events, so the
                        trigger wraps it with its own hover-catching element. */}
                    <TooltipTrigger render={<span className="inline-flex" />}>
                      {select}
                    </TooltipTrigger>
                    <TooltipContent>
                      Selecione primeiro a UH para informar a idade.
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
