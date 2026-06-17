"use client"

import Image from "next/image"
import { Images, Plus } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

/**
 * Reusable "photos" section for cadastro/conta pages (category, establishment…).
 * Display-only in the prototype — "Adicionar foto" is a mocked button.
 */
export function PhotosCard({
  photos,
  title = "Fotos",
}: {
  photos: string[]
  title?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images className="size-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-md text-xs text-muted-foreground">
            Adicione até 10 imagens no formato JPG ou PNG, com no máximo 5 MB.
            Recomendadas as dimensões 1920x1080 px.
          </p>
          <Button type="button" variant="outline" size="sm">
            <Plus /> Adicionar foto
          </Button>
        </div>

        {photos.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {photos.map((src, i) => (
              <div
                key={src}
                className="relative h-24 w-32 overflow-hidden rounded-md border border-border"
              >
                <Image
                  src={src}
                  alt={`Foto ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-md border border-dashed border-border bg-muted/30 px-3 py-6 text-center text-xs text-muted-foreground">
            Nenhuma foto adicionada.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
