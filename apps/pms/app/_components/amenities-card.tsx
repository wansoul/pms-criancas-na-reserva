"use client"

import * as React from "react"
import { ListChecks, Plus, X } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

/**
 * Reusable "comodidades" section for cadastro/conta pages. Holds its own
 * removable-chip state (mocked — "Adicionar comodidade" is a placeholder).
 */
export function AmenitiesCard({ amenities: initial }: { amenities: string[] }) {
  const [amenities, setAmenities] = React.useState<string[]>(initial)

  function remove(name: string) {
    setAmenities((prev) => prev.filter((a) => a !== name))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="size-4" /> Comodidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {amenities.length}{" "}
            {amenities.length === 1 ? "comodidade ativa" : "comodidades ativas"}
          </p>
          <Button type="button" variant="outline" size="sm">
            <Plus /> Adicionar comodidade
          </Button>
        </div>

        {amenities.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {amenities.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 py-1 pr-1.5 pl-3 text-xs font-medium"
              >
                {name}
                <button
                  type="button"
                  aria-label={`Remover ${name}`}
                  onClick={() => remove(name)}
                  className="flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-3" weight="bold" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-md border border-dashed border-border bg-muted/30 px-3 py-6 text-center text-xs text-muted-foreground">
            Nenhuma comodidade adicionada.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
