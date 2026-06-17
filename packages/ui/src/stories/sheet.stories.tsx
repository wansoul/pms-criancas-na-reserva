import type { Meta, StoryObj } from "@storybook/react"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../components/sheet"
import { Button } from "../components/button"

const meta: Meta = {
  title: "Components/Sheet",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center py-16">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Direita: Story = {
  name: "Da direita (padrão)",
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Abrir sheet</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Detalhes do quarto</SheetTitle>
          <SheetDescription>
            Suíte Casal — Praia do Rosa
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-4 py-2 text-sm text-muted-foreground">
          Conteúdo da sheet aqui.
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" className="flex-1">Fechar</Button>} />
          <Button className="flex-1">Reservar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const DeBaixo: Story = {
  name: "De baixo (mobile bottom sheet)",
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Bottom sheet</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Selecione as datas</SheetTitle>
          <SheetDescription>
            Escolha check-in e check-out
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-4 py-4 text-sm text-muted-foreground">
          Calendário aqui.
        </div>
        <SheetFooter>
          <Button className="w-full">Confirmar datas</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const SemBotaoFechar: Story = {
  name: "Sem botão de fechar",
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Sem X</Button>} />
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Confirmação de reserva</SheetTitle>
        </SheetHeader>
        <div className="flex-1 px-4 py-2 text-sm text-muted-foreground">
          Confirme os dados antes de prosseguir.
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" className="flex-1">Cancelar</Button>} />
          <Button className="flex-1">Confirmar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
