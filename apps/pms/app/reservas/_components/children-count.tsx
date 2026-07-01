import { Input } from "@workspace/ui/components/input"
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

import type { Tariff } from "../data/mock-tarifario"
import { getPayingChildAges } from "../data/tariff-calculator"

export function ChildrenCount({
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
      <Input
        type="number"
        min={0}
        value={String(ages.length)}
        onChange={(e) => onCountChange(e.target.value)}
      />
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
                <span className="text-xs text-muted-foreground">
                  Criança {i + 1}
                </span>
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
