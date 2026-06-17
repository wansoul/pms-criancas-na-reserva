"use client"

import * as React from "react"
import type { Icon } from "@phosphor-icons/react"
import {
  IdentificationCard,
  Gear,
  Buildings,
  ListChecks,
  Receipt,
  Rocket,
  Stack,
} from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"

import { EstablishmentData } from "./establishment-data"

type TabId =
  | "conta"
  | "configuracao"
  | "estabelecimento"
  | "politica"
  | "faturamento"
  | "plano"

const TABS: { id: TabId; label: string; icon: Icon }[] = [
  { id: "conta", label: "Informações da conta", icon: IdentificationCard },
  { id: "configuracao", label: "Configuração da conta", icon: Gear },
  { id: "estabelecimento", label: "Dados do Estabelecimento", icon: Buildings },
  { id: "politica", label: "Política de Hospedagem", icon: ListChecks },
  { id: "faturamento", label: "Dados de faturamento", icon: Receipt },
  { id: "plano", label: "Meu plano", icon: Rocket },
]

export function AccountTabs() {
  // Defaults to the only built tab (Dados do Estabelecimento).
  const [active, setActive] = React.useState<TabId>("estabelecimento")

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const selected = active === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "-mb-px flex items-center gap-1.5 border-b-2 px-1 py-2.5 text-sm font-medium transition-colors",
                selected
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon weight={selected ? "fill" : "regular"} className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {active === "estabelecimento" ? (
        <EstablishmentData />
      ) : (
        <TabPlaceholder label={TABS.find((t) => t.id === active)?.label ?? ""} />
      )}
    </div>
  )
}

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Stack className="size-6" />
      </span>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          Esta aba faz parte da estrutura do sistema e será detalhada em breve.
        </p>
      </div>
    </div>
  )
}
