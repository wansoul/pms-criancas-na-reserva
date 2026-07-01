"use client"

import type { CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { XIcon } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@workspace/ui/components/dialog"

import {
  GROUP_RESERVATION_BY_CATEGORY_FORM_ID,
  GroupReservationFormByCategoryFields,
} from "./group-reservation-form-by-category"

const LIST_URL = "/reservas"

/** Group reservation create flow where UHs are chosen by category + quantity, presented as a modal. */
export function GroupReservationByCategoryModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  function handleSubmitted() {
    onOpenChange(false)
    router.push(LIST_URL)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] max-h-[90vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[640px]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <DialogTitle className="text-base">Nova reserva em grupo</DialogTitle>
          <DialogClose
            aria-label="Fechar"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <XIcon className="size-4" />
          </DialogClose>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-5"
          style={{ "--field-label-width": "110px" } as CSSProperties}
        >
          <GroupReservationFormByCategoryFields
            formId={GROUP_RESERVATION_BY_CATEGORY_FORM_ID}
            onSubmitted={handleSubmitted}
          />
        </div>

        <DialogFooter className="shrink-0 border-t border-border px-5 py-4 sm:justify-end">
          <Button type="submit" form={GROUP_RESERVATION_BY_CATEGORY_FORM_ID}>
            Adicionar reserva em grupo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
