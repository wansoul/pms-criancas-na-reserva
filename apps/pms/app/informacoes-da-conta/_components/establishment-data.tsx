"use client"

import * as React from "react"
import { Info } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { PhotosCard } from "../../_components/photos-card"
import { AmenitiesCard } from "../../_components/amenities-card"
import { mockProperty } from "../data/mock-property"

/** "Dados do Estabelecimento" tab — descrição, fotos e comodidades do hotel. */
export function EstablishmentData() {
  const [description, setDescription] = React.useState(mockProperty.description)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock: nada é persistido no protótipo.
  }

  const photos = [mockProperty.coverPhoto, ...mockProperty.photos]

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="size-4" /> Informações do estabelecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1.5 sm:grid-cols-[180px_1fr] sm:items-start sm:gap-4">
              <label className="text-sm font-medium text-foreground sm:pt-2 sm:text-right">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="min-h-28 w-full max-w-2xl rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="submit">Atualizar dados do estabelecimento</Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <PhotosCard photos={photos} title="Fotos do estabelecimento" />

      <AmenitiesCard amenities={mockProperty.amenities} />
    </div>
  )
}
