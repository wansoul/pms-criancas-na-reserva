"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CalendarBlank, ClockClockwise, User } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"

import { PhotosCard } from "../../../_components/photos-card"
import { AmenitiesCard } from "../../../_components/amenities-card"
import type { UhCategory } from "../data/mock-categories"

const LIST_URL = "/cadastros/categorias-de-uh"

/** Create + edit form for a UH category. Mocked — no persistence. */
export function CategoryForm({ category }: { category?: UhCategory }) {
  const router = useRouter()
  const isEdit = Boolean(category)

  const [title, setTitle] = React.useState(category?.title ?? "")
  const [occupants, setOccupants] = React.useState(String(category?.occupants ?? 2))
  const [position, setPosition] = React.useState(category?.position ?? "")
  const [description, setDescription] = React.useState(category?.description ?? "")
  const [active, setActive] = React.useState(category?.active ?? true)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock: nothing is persisted — return to the list.
    router.push(LIST_URL)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* ─── Dados da categoria ─── */}
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Atualizar Categoria de UH" : "Nova Categoria de UH"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Field label="Título" required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Field>

            <Field label="Ocupantes" required>
              <Input
                type="number"
                min={1}
                value={occupants}
                onChange={(e) => setOccupants(e.target.value)}
                className="w-28"
                required
              />
            </Field>

            <Field label="Posição">
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-28"
                placeholder="001"
              />
            </Field>

            <Field label="Descrição" alignTop>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </Field>

            <Field label="Ativo?">
              <Switch checked={active} onCheckedChange={setActive} />
            </Field>

            {isEdit && (
              <div className="mt-1 flex flex-col gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
                <MetaRow icon={<CalendarBlank className="size-3.5" />} label="Criado em" value={category!.createdAt} />
                <MetaRow icon={<ClockClockwise className="size-3.5" />} label="Alterado em" value={category!.updatedAt} />
                <MetaRow icon={<User className="size-3.5" />} label="Alterado por" value={category!.updatedBy} />
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit">
                {isEdit ? "Atualizar Categoria de UH" : "Cadastrar Categoria de UH"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PhotosCard photos={category?.photos ?? []} title="Fotos da categoria" />

      <AmenitiesCard amenities={category?.amenities ?? []} />
    </form>
  )
}

/** Label-left, control-right form row (desktop-primary). */
function Field({
  label,
  required,
  accent,
  alignTop,
  children,
}: {
  label: string
  required?: boolean
  accent?: boolean
  alignTop?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid gap-1.5 sm:grid-cols-[180px_1fr] sm:gap-4",
        alignTop ? "sm:items-start" : "sm:items-center"
      )}
    >
      <label
        className={cn(
          "text-sm font-medium sm:pt-2 sm:text-right",
          accent ? "text-primary" : "text-foreground",
          alignTop && "sm:pt-2"
        )}
      >
        {required && <span className="text-destructive">* </span>}
        {label}
      </label>
      <div className="max-w-md">{children}</div>
    </div>
  )
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
      <span className="sm:text-right">{label}</span>
      <span className="inline-flex items-center gap-1.5">
        {icon}
        {value}
      </span>
    </div>
  )
}
