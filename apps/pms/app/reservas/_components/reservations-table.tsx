"use client"

import * as React from "react"
import Link from "next/link"
import {
  MagnifyingGlass,
  Funnel,
  PlusCircle,
  ClipboardText,
  UsersThree,
  Bed,
  DownloadSimple,
  Minus,
  CornersOut,
  CaretUpDown,
} from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

import {
  RESERVATION_STATUSES,
  STATUS_META,
  type Reservation,
  type ReservationStatus,
} from "../data/mock-reservations"

type StatusFilter = "todos" | ReservationStatus

export function ReservationsTable({ reservations }: { reservations: Reservation[] }) {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("reservado")
  const [collapsed, setCollapsed] = React.useState(false)

  const rows = React.useMemo(() => {
    const term = query.trim().toLowerCase()
    return reservations.filter((r) => {
      const matchesStatus = status === "todos" || r.status === status
      const matchesQuery =
        term === "" ||
        r.code.toLowerCase().includes(term) ||
        r.guest.toLowerCase().includes(term) ||
        r.uh.toLowerCase().includes(term)
      return matchesStatus && matchesQuery
    })
  }, [reservations, query, status])

  return (
    <div className="flex flex-col gap-4">
      {/* Search + new reservation */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative min-w-56 flex-1">
            <MagnifyingGlass className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquise por nº, placa do veículo, UH, nome do acompanhante ou nome do hóspede"
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            size="icon"
            aria-label="Filtros avançados"
            className="shrink-0"
          >
            <Funnel weight="fill" />
          </Button>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/reservas/nova" />}
          className="ml-auto"
        >
          <PlusCircle weight="fill" />
          Nova reserva
        </Button>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <StatusChip
          label="Todos"
          active={status === "todos"}
          onClick={() => setStatus("todos")}
        />
        {RESERVATION_STATUSES.map((s) => (
          <StatusChip
            key={s.value}
            label={s.label}
            active={status === s.value}
            activeClass={cn(s.dotClass, "text-white")}
            inactiveClass={s.chipClass}
            onClick={() => setStatus(s.value)}
          />
        ))}
      </div>

      {/* List */}
      <Card className="overflow-hidden p-0">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
            Lista de reservas
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ClipboardText className="size-4" />
              <span className="tabular-nums">1783</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersThree className="size-4" />
              <span className="tabular-nums">2688</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bed className="size-4" />
              <span className="tabular-nums">69</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              aria-label="Exportar"
              className="rounded-md p-1.5 transition-colors hover:bg-muted hover:text-foreground"
            >
              <DownloadSimple className="size-4" />
            </button>
            <button
              type="button"
              aria-label={collapsed ? "Expandir lista" : "Recolher lista"}
              onClick={() => setCollapsed((v) => !v)}
              className="rounded-md p-1.5 transition-colors hover:bg-muted hover:text-foreground"
            >
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Tela cheia"
              className="rounded-md p-1.5 transition-colors hover:bg-muted hover:text-foreground"
            >
              <CornersOut className="size-4" />
            </button>
          </div>
        </div>

        {!collapsed && (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-xs font-medium text-primary-foreground">
                    <HeadCell label="Nº" />
                    <HeadCell label="Hóspede" />
                    <HeadCell label="UH" />
                    <HeadCell label="Check-in" sortedAsc />
                    <HeadCell label="Check-out" />
                    <th className="px-3 py-2.5 text-left font-medium">Qtd.</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-10 text-center text-muted-foreground"
                      >
                        Nenhuma reserva encontrada.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr
                        key={r.code}
                        className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "size-3 shrink-0 rounded-[3px]",
                                STATUS_META[r.status].dotClass
                              )}
                              title={STATUS_META[r.status].label}
                            />
                            <Link
                              href="#"
                              className="font-medium text-primary tabular-nums hover:underline"
                            >
                              {r.code}
                            </Link>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">{r.guest}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {r.uh || "—"}
                        </td>
                        <td className="px-3 py-2.5 tabular-nums">{r.checkIn}</td>
                        <td className="px-3 py-2.5 tabular-nums">{r.checkOut}</td>
                        <td className="px-3 py-2.5 tabular-nums">
                          {r.qty}
                          {r.extra != null && (
                            <span className="ml-1 text-muted-foreground italic">
                              ({r.extra})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

function HeadCell({ label, sortedAsc }: { label: string; sortedAsc?: boolean }) {
  return (
    <th className="px-3 py-2.5 text-left font-medium">
      <span className="inline-flex items-center gap-1">
        {label}
        <CaretUpDown
          weight={sortedAsc ? "fill" : "regular"}
          className="size-3.5 opacity-70"
        />
      </span>
    </th>
  )
}

function StatusChip({
  label,
  active,
  activeClass,
  inactiveClass,
  onClick,
}: {
  label: string
  active: boolean
  activeClass?: string
  inactiveClass?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded border px-2 py-0.5 text-xs font-medium transition-colors",
        active
          ? activeClass
            ? cn("border-transparent", activeClass)
            : "border-transparent bg-foreground text-background"
          : cn(
              "border-border bg-background text-muted-foreground hover:bg-muted",
              inactiveClass
            )
      )}
    >
      {label}
    </button>
  )
}
