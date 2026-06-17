import type { Meta, StoryObj } from "@storybook/react"
import { Tag, CheckCircle } from "@phosphor-icons/react"

import { Badge } from "../components/badge"

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
  args: {
    children: "Badge",
    variant: "default",
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secundário" },
}

export const Destructive: Story = {
  args: { variant: "destructive", children: "Erro" },
}

export const Outline: Story = {
  args: { variant: "outline", children: "Contorno" },
}

export const TodasVariantes: Story = {
  name: "Todas as variantes",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">
        <CheckCircle data-icon="inline-start" />
        Confirmado
      </Badge>
      <Badge variant="secondary">
        <Tag data-icon="inline-start" />
        Promoção
      </Badge>
      <Badge variant="destructive">
        Cancelado
        <CheckCircle data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

export const CasosDeUso: Story = {
  name: "Casos de uso — reservas",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Confirmada</Badge>
      <Badge variant="secondary">Pendente</Badge>
      <Badge variant="outline">Check-in hoje</Badge>
      <Badge variant="destructive">Cancelada</Badge>
      <Badge variant="ghost">PIX</Badge>
    </div>
  ),
}
