"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import { ptBR } from "react-day-picker/locale"
import { CalendarBlank, UserPlus } from "@phosphor-icons/react"

import { Badge } from "@workspace/ui/components/badge"
import { Calendar } from "@workspace/ui/components/calendar"
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
import { cn } from "@workspace/ui/lib/utils"

import { Field, Separator } from "../../_components/form-field"
import { SituacaoField } from "../../_components/situacao-field"
import {
  defaultPeriod,
  formatRange,
  nightsBetween,
} from "../../data/reservation-format"

export const GUESTS = [
  "Eduardo Santos",
  "Aline Dias",
  "Thaise Gomes",
  "Gabriel Martinez Santamaria",
]
export const CHANNELS = [
  "Booking.com",
  "Airbnb",
  "Expedia",
  "Site próprio",
  "Balcão",
]

/** Shared state for the group reservation form top (situação → canal de venda), reused by the per-UH and per-category variants. */
export function useGroupReservationBase() {
  const [situacao, setSituacao] = React.useState("pre-reservar")
  const [guest, setGuest] = React.useState("")
  const [period, setPeriod] = React.useState<DateRange | undefined>(
    defaultPeriod
  )
  const [breakfast, setBreakfast] = React.useState(false)
  const [channel, setChannel] = React.useState("")
  const [plate, setPlate] = React.useState("")
  const [notes, setNotes] = React.useState("")

  const nights = nightsBetween(period)

  return {
    situacao,
    setSituacao,
    guest,
    setGuest,
    period,
    setPeriod,
    breakfast,
    setBreakfast,
    channel,
    setChannel,
    plate,
    setPlate,
    notes,
    setNotes,
    nights,
  }
}

export type GroupReservationBase = ReturnType<typeof useGroupReservationBase>

/** Situação → Canal de venda fields, shared by the per-UH and per-category group reservation forms. */
export function GroupReservationBaseFields({
  base,
}: {
  base: GroupReservationBase
}) {
  return (
    <>
      {/* Situação */}
      <Field label="Situação" required alignTop>
        <SituacaoField value={base.situacao} onChange={base.setSituacao} />
      </Field>

      <Separator />

      {/* Hóspede responsável */}
      <Field label="Hóspede resp." required>
        <div className="flex items-center gap-2">
          <Select
            value={base.guest}
            onValueChange={(v) => base.setGuest(v ?? "")}
          >
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
                "flex h-(--density-input-height) w-full max-w-xs items-center gap-2 rounded-md border border-input bg-transparent px-3 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:border-ring dark:bg-input/30"
              )}
            >
              <CalendarBlank className="size-4 shrink-0 text-muted-foreground" />
              <span
                className={cn(!base.period?.from && "text-muted-foreground")}
              >
                {formatRange(base.period) || "Selecione o período"}
              </span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={base.period}
                onSelect={base.setPeriod}
                locale={ptBR}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <Badge className="shrink-0 px-3 py-1 text-sm">
            {base.nights} {base.nights === 1 ? "diária" : "diárias"}
          </Badge>
        </div>
      </Field>

      {/* Café da manhã */}
      <Field label="Café da manhã">
        <div className="flex items-center gap-2">
          <Switch
            checked={base.breakfast}
            onCheckedChange={base.setBreakfast}
          />
          <span className="text-xs text-muted-foreground">
            aplica a todas as UHs
          </span>
        </div>
      </Field>

      {/* Canal de venda */}
      <Field label="Canal de venda">
        <Select
          value={base.channel}
          onValueChange={(v) => base.setChannel(v ?? "")}
        >
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
    </>
  )
}
