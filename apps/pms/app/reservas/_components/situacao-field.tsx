import { cn } from "@workspace/ui/lib/utils"

// ─── Situação (ação ao criar a reserva) ───────────────────────────────────────
// Each option maps to the lifecycle status the new reservation starts in.
export type SituacaoOption = {
  value: string
  label: string
  /** Chip color when selected. */
  chipClass: string
}

// Ordered to match the reference layout (row-major over a 3-column grid):
// pré-reservar | hospedar | em espera
// reservar     | bloquear datas
export const SITUACOES: SituacaoOption[] = [
  {
    value: "pre-reservar",
    label: "pré-reservar",
    chipClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300",
  },
  {
    value: "hospedar",
    label: "hospedar",
    chipClass: "bg-orange-500 text-white",
  },
  {
    value: "em-espera",
    label: "em espera",
    chipClass: "bg-pink-500 text-white",
  },
  { value: "reservar", label: "reservar", chipClass: "bg-blue-500 text-white" },
  {
    value: "bloquear-datas",
    label: "bloquear datas",
    chipClass: "bg-zinc-700 text-white",
  },
]

export function SituacaoField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
      {SITUACOES.map((s) => {
        const selected = value === s.value
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
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
  )
}
