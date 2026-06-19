"use client"

import * as React from "react"
import { Minus, Plus } from "@phosphor-icons/react"

import { Card } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

// Rotating tips shown alongside the form, mirroring the legacy "DICAS" panel.
const TIPS: { title: string; body: string }[] = [
  { title: "Observação", body: "Campo onde você pode colocar qualquer informação sobre a reserva." },
  { title: "Situação", body: "Escolha “pré-reservar” para segurar a data sem confirmar a reserva." },
  { title: "Hóspede", body: "Não encontrou o hóspede? Use o botão ao lado para cadastrar um novo." },
  { title: "Café da manhã", body: "Ative para incluir o café da manhã no valor da diária." },
]

export function DicasCard() {
  const [collapsed, setCollapsed] = React.useState(false)
  const [active, setActive] = React.useState(0)
  const tip = TIPS[active]!

  return (
    <Card className="h-fit overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">Dicas</h2>
        <button
          type="button"
          aria-label={collapsed ? "Expandir dicas" : "Recolher dicas"}
          onClick={() => setCollapsed((v) => !v)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {collapsed ? <Plus className="size-4" /> : <Minus className="size-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-4 px-5 py-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{tip.title}:</span> {tip.body}
          </p>
          <div className="flex items-center gap-1.5">
            {TIPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Dica ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i === active ? "bg-primary" : "bg-border hover:bg-muted-foreground/40"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
