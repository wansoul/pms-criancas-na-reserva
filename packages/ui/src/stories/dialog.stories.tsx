import type { Meta, StoryObj } from "@storybook/react"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/dialog"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Label } from "../components/label"

const meta: Meta = {
  title: "Components/Dialog",
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

export const Padrao: Story = {
  name: "Padrão",
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Abrir dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conectar conta do gateway</DialogTitle>
          <DialogDescription>
            Receba PIX e cartão com confirmação automática.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="demo-name">Razão social</Label>
          <Input id="demo-name" placeholder="Pousada do Sol Ltda" />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button>Conectar conta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const SemBotaoFechar: Story = {
  name: "Sem botão de fechar",
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Sem X</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirmar ação</DialogTitle>
          <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
