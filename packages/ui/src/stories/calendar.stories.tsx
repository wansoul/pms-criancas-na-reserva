import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import type { DateRange } from "react-day-picker"
import { ptBR } from "react-day-picker/locale"

import { Calendar, CalendarDayButton } from "../components/calendar"

// ─── Helpers para stories com preço ──────────────────────────────────────────

type Offer = {
  validFrom: string
  validUntil: string
  discountType: "percent" | "fixed"
  discountValue: number
}

const MOCK_BASE_PRICE = 220

const MOCK_OFFERS: Offer[] = [
  { validFrom: "2026-06-01", validUntil: "2026-07-31", discountType: "percent", discountValue: 15 },
  { validFrom: "2026-09-01", validUntil: "2026-09-10", discountType: "fixed", discountValue: 80 },
]

function getPriceForDate(date: Date, basePrice: number, offers: Offer[]): number | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) return null
  let price = basePrice
  const dow = date.getDay()
  if (dow === 5 || dow === 6) price = Math.round(price * 1.3)
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  for (const offer of offers) {
    if (iso >= offer.validFrom && iso <= offer.validUntil) {
      price =
        offer.discountType === "percent"
          ? Math.round(price * (1 - offer.discountValue / 100))
          : Math.max(price - offer.discountValue, 0)
      break
    }
  }
  return price
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    captionLayout: {
      control: "select",
      options: ["label", "dropdown"],
      description: "Layout do cabeçalho do mês",
    },
    showOutsideDays: {
      control: "boolean",
      description: "Exibe dias fora do mês atual",
    },
    disabled: {
      control: false,
    },
  },
  args: {
    captionLayout: "label",
    showOutsideDays: true,
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Calendar>

// ─── Stories básicas ──────────────────────────────────────────────────────────

export const Default: Story = {
  name: "Seleção simples",
  render: (args) => {
    const [selected, setSelected] = useState<Date | undefined>()
    return (
      <Calendar
        {...args}
        mode="single"
        selected={selected}
        onSelect={setSelected}
        locale={ptBR}
      />
    )
  },
}

export const Intervalo: Story = {
  name: "Intervalo de datas",
  render: (args) => {
    const [range, setRange] = useState<DateRange | undefined>()
    return (
      <Calendar
        {...args}
        mode="range"
        selected={range}
        onSelect={setRange}
        locale={ptBR}
      />
    )
  },
}

export const DoisMeses: Story = {
  name: "Dois meses",
  render: (args) => {
    const [range, setRange] = useState<DateRange | undefined>()
    return (
      <Calendar
        {...args}
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        locale={ptBR}
      />
    )
  },
}

export const ComDropdown: Story = {
  name: "Com dropdown de mês/ano",
  render: (args) => {
    const [selected, setSelected] = useState<Date | undefined>()
    return (
      <Calendar
        {...args}
        mode="single"
        captionLayout="dropdown"
        selected={selected}
        onSelect={setSelected}
        locale={ptBR}
        startMonth={new Date(2020, 0)}
        endMonth={new Date(2030, 11)}
      />
    )
  },
}

export const ComDatasDesabilitadas: Story = {
  name: "Com datas desabilitadas",
  render: (args) => {
    const [selected, setSelected] = useState<Date | undefined>()
    const today = new Date()
    return (
      <Calendar
        {...args}
        mode="single"
        selected={selected}
        onSelect={setSelected}
        locale={ptBR}
        disabled={{ before: today }}
      />
    )
  },
}

export const SemDiasExteriores: Story = {
  name: "Sem dias externos",
  render: (args) => {
    const [selected, setSelected] = useState<Date | undefined>()
    return (
      <Calendar
        {...args}
        mode="single"
        showOutsideDays={false}
        selected={selected}
        onSelect={setSelected}
        locale={ptBR}
      />
    )
  },
}

// ─── Stories com preço de tarifas ─────────────────────────────────────────────

export const ComPrecosDeTarifas: Story = {
  name: "Com preços de tarifas",
  parameters: {
    docs: {
      description: {
        story:
          "Cada dia exibe o menor preço disponível. Fins de semana têm acréscimo de 30%. Dias dentro de períodos de oferta mostram o preço com desconto aplicado.",
      },
    },
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange | undefined>()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    function PriceDayButton({ children, day, ...rest }: React.ComponentProps<typeof CalendarDayButton>) {
      const price = getPriceForDate(day.date, MOCK_BASE_PRICE, MOCK_OFFERS)
      return (
        <CalendarDayButton day={day} locale={ptBR} {...rest}>
          {children}
          {price !== null && <span className="text-xs opacity-70">R${price}</span>}
        </CalendarDayButton>
      )
    }

    const offerRanges = MOCK_OFFERS.map((o) => ({
      from: new Date(o.validFrom + "T12:00:00"),
      to: new Date(o.validUntil + "T12:00:00"),
    }))

    return (
      <div className="w-[340px]">
        <style>{`
          .day-has-offer button::after {
            content: '';
            position: absolute;
            top: 15%;
            right: 15%;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: var(--primary);
            pointer-events: none;
            z-index: 10;
          }
          .day-has-offer[data-selected="true"] button::after,
          .day-has-offer[aria-selected="true"] button::after {
            background-color: rgba(255,255,255,0.7);
          }
          button[data-day] { font-weight: 700; }
        `}</style>
        <div className="[&_button[data-day]]:aspect-auto [&_button[data-day]]:h-full [&_button[data-day]]:py-2">
          <Calendar
            {...args}
            mode="range"
            selected={range}
            onSelect={setRange}
            locale={ptBR}
            disabled={{ before: today }}
            showOutsideDays={false}
            buttonVariant="outline"
            className="w-full p-0 [--cell-radius:0.75rem] [--cell-size:--spacing(8)]"
            components={{ DayButton: PriceDayButton }}
            classNames={{
              root: "w-full",
              outside: "opacity-0 pointer-events-none",
              weekdays: "flex py-2",
              week: "flex w-full",
              day: "group/day relative h-auto w-full rounded-(--cell-radius) p-0 text-center select-none overflow-visible [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius) [&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
            }}
            modifiers={{ hasOffer: offerRanges }}
            modifiersClassNames={{ hasOffer: "day-has-offer" }}
          />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="text-[11px] text-muted-foreground">Dias com oferta ativa</span>
        </div>
      </div>
    )
  },
}

export const SeletorDeIntervaloComPrecos: Story = {
  name: "Seletor de intervalo (check-in / check-out)",
  parameters: {
    docs: {
      description: {
        story:
          "Simula o fluxo do DatePickerSheet: abas de check-in e check-out com estado ativo, calendário com preços e botão de confirmação.",
      },
    },
  },
  render: (args) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [range, setRange] = useState<DateRange | undefined>()
    const [activeField, setActiveField] = useState<"checkin" | "checkout">("checkin")

    function handleSelect(_r: DateRange | undefined, triggerDate: Date) {
      if (activeField === "checkin" || !range?.from) {
        setRange({ from: triggerDate, to: undefined })
        setActiveField("checkout")
      } else {
        if (triggerDate > range.from) {
          setRange({ from: range.from, to: triggerDate })
          setActiveField("checkin")
        } else {
          setRange({ from: triggerDate, to: undefined })
          setActiveField("checkout")
        }
      }
    }

    const calendarSelected: DateRange | undefined =
      activeField === "checkout" && range?.from
        ? { from: range.from, to: undefined }
        : range

    function fmt(d?: Date) {
      if (!d) return "Selecione"
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    }

    function PriceDayButton({ children, day, ...rest }: React.ComponentProps<typeof CalendarDayButton>) {
      const price = getPriceForDate(day.date, MOCK_BASE_PRICE, MOCK_OFFERS)
      return (
        <CalendarDayButton day={day} locale={ptBR} {...rest}>
          {children}
          {price !== null && <span className="text-xs opacity-70">R${price}</span>}
        </CalendarDayButton>
      )
    }

    const offerRanges = MOCK_OFFERS.map((o) => ({
      from: new Date(o.validFrom + "T12:00:00"),
      to: new Date(o.validUntil + "T12:00:00"),
    }))

    return (
      <div className="w-[340px] rounded-2xl border border-border bg-background p-4 shadow-md">
        <style>{`
          .rdp-story-offer button::after {
            content: '';
            position: absolute;
            top: 15%; right: 15%;
            width: 4px; height: 4px;
            border-radius: 50%;
            background-color: var(--primary);
            pointer-events: none;
            z-index: 10;
          }
          .rdp-story-offer[data-selected="true"] button::after,
          .rdp-story-offer[aria-selected="true"] button::after {
            background-color: rgba(255,255,255,0.7);
          }
          button[data-day] { font-weight: 700; }
        `}</style>

        {/* Abas check-in / check-out */}
        <div className="mb-4 flex gap-2">
          {(["checkin", "checkout"] as const).map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => setActiveField(field)}
              className="flex-1 rounded-xl p-2.5 text-left transition-colors"
              className={
                activeField === field
                  ? "border-2 border-primary bg-primary/10"
                  : field === "checkout" ? "border border-dashed border-border" : "border border-border"
              }
            >
              <p className={`text-[9px] font-bold uppercase tracking-wide ${activeField === field ? "text-primary" : ""}`}>
                {field === "checkin" ? "Check-in" : "Check-out"}
              </p>
              <p className={`mt-0.5 text-sm font-semibold ${activeField === field ? "text-primary" : ""}`}>
                {field === "checkin" ? fmt(range?.from) : fmt(range?.to)}
              </p>
            </button>
          ))}
        </div>

        {/* Calendário com preços */}
        <div className="[&_button[data-day]]:aspect-auto [&_button[data-day]]:h-full [&_button[data-day]]:py-2">
          <Calendar
            {...args}
            mode="range"
            selected={calendarSelected}
            onSelect={handleSelect}
            locale={ptBR}
            disabled={{ before: today }}
            showOutsideDays={false}
            buttonVariant="outline"
            className="w-full p-0 [--cell-radius:0.75rem] [--cell-size:--spacing(8)]"
            components={{ DayButton: PriceDayButton }}
            classNames={{
              root: "w-full",
              outside: "opacity-0 pointer-events-none",
              weekdays: "flex py-2",
              week: "flex w-full",
              day: "group/day relative h-auto w-full rounded-(--cell-radius) p-0 text-center select-none overflow-visible [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius) [&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
            }}
            modifiers={{ hasOffer: offerRanges }}
            modifiersClassNames={{ hasOffer: "rdp-story-offer" }}
          />
        </div>

        {/* Legenda + CTA */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] text-muted-foreground">Dias com oferta ativa</span>
        </div>
        <button
          disabled={!range?.from || !range?.to}
          className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
        >
          Confirmar datas
        </button>
      </div>
    )
  },
}
