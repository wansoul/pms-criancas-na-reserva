"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckCircle,
  Prohibit,
  Trash,
  MagnifyingGlass,
  Funnel,
  PlusCircle,
} from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"

import type { UhCategory } from "../data/mock-categories"

type StatusFilter = "todos" | "ativos" | "inativos"

const FILTER_LABELS: Record<StatusFilter, string> = {
  todos: "Todas",
  ativos: "Ativas",
  inativos: "Inativas",
}

export function CategoriesTable({ categories }: { categories: UhCategory[] }) {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("todos")

  const rows = React.useMemo(() => {
    const term = query.trim().toLowerCase()
    return categories.filter((c) => {
      const matchesStatus =
        status === "todos" ||
        (status === "ativos" && c.active) ||
        (status === "inativos" && !c.active)
      const matchesQuery = term === "" || c.title.toLowerCase().includes(term)
      return matchesStatus && matchesQuery
    })
  }, [categories, query, status])

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <MagnifyingGlass className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise por título"
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md border border-transparent bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
              status !== "todos" && "ring-2 ring-primary/30"
            )}
          >
            <Funnel weight={status === "todos" ? "regular" : "fill"} className="size-4" />
            <span className="sr-only md:not-sr-only">{FILTER_LABELS[status]}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup
              value={status}
              onValueChange={(v) => setStatus(v as StatusFilter)}
            >
              <DropdownMenuRadioItem value="todos">Todas</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ativos">Ativas</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inativos">Inativas</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button render={<Link href="/cadastros/categorias-de-uh/nova" />} className="ml-auto">
          <PlusCircle weight="fill" />
          Nova categoria
        </Button>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-3 py-2 text-left font-medium">Id</th>
                  <th className="px-3 py-2 text-left font-medium">Ativo?</th>
                  <th className="px-3 py-2 text-left font-medium">Posição</th>
                  <th className="px-3 py-2 text-left font-medium">Título</th>
                  <th className="px-3 py-2 text-right font-medium">Locais</th>
                  <th className="px-3 py-2 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  rows.map((c) => (
                    <tr key={c.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{c.id}</td>
                      <td className="px-3 py-2.5">
                        {c.active ? (
                          <CheckCircle weight="bold" className="size-5 text-emerald-600" />
                        ) : (
                          <Prohibit weight="bold" className="size-5 text-destructive" />
                        )}
                        <span className="sr-only">{c.active ? "Ativa" : "Inativa"}</span>
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                        {c.position ?? "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <Link
                          href={`/cadastros/categorias-de-uh/${c.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        <span className={c.locais > 0 ? "font-medium text-primary" : "text-muted-foreground"}>
                          {c.locais}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {c.locais === 0 ? (
                          <button
                            type="button"
                            aria-label={`Excluir categoria ${c.title}`}
                            className="text-destructive transition-colors hover:text-destructive/70"
                          >
                            <Trash className="size-4" />
                          </button>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
