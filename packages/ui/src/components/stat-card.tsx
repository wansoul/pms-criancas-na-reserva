import * as React from "react"
import {
  type Icon,
  MinusIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "@phosphor-icons/react"
import { cva } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import { Card } from "@workspace/ui/components/card"

export type StatCardDelta = {
  /** Pre-formatted change label, e.g. "12%" or "0,5 pp". */
  value: string
  direction: "up" | "down" | "flat"
}

const deltaVariants = cva(
  "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
  {
    variants: {
      direction: {
        up: "text-emerald-600 dark:text-emerald-400",
        down: "text-destructive",
        flat: "text-muted-foreground",
      },
    },
    defaultVariants: { direction: "flat" },
  }
)

const DELTA_ICON = {
  up: TrendUpIcon,
  down: TrendDownIcon,
  flat: MinusIcon,
} as const

/**
 * KPI / metric card: big value with an optional trend delta and hint.
 * Built on `Card`, so it inherits the density system and theming.
 */
function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<typeof Card> & {
  label: string
  value: string
  delta?: StatCardDelta
  hint?: string
  icon?: Icon
}) {
  const DeltaIcon = delta ? DELTA_ICON[delta.direction] : null

  return (
    <Card className={cn("justify-between", className)} {...props}>
      <div className="flex items-start justify-between gap-3 px-(--density-card-px) group-data-[size=sm]/card:px-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
          <span className="font-heading text-2xl leading-none font-semibold tabular-nums">
            {value}
          </span>
          {(delta || hint) && (
            <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              {delta && DeltaIcon && (
                <span className={deltaVariants({ direction: delta.direction })}>
                  <DeltaIcon weight="bold" className="size-3.5" />
                  {delta.value}
                </span>
              )}
              {hint && (
                <span className="text-xs text-muted-foreground">{hint}</span>
              )}
            </span>
          )}
        </div>
        {Icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" weight="duotone" />
          </span>
        )}
      </div>
    </Card>
  )
}

export { StatCard }
