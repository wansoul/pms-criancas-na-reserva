import type { Meta, StoryObj } from "@storybook/react"

import { Separator } from "../components/separator"

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px] flex flex-col gap-3">
      <p className="text-sm font-medium">Seção A</p>
      <Separator orientation="horizontal" />
      <p className="text-sm font-medium">Seção B</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3">
      <span className="text-sm">Configuração</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Dashboard</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Cadastros</span>
    </div>
  ),
}

export const ComTexto: Story = {
  name: "Com rótulo (seções)",
  render: () => (
    <div className="w-[400px] flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Promoções opcionais
      </span>
      <Separator className="flex-1" />
    </div>
  ),
}
