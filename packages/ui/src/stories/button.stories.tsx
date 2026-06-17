import type { Meta, StoryObj } from "@storybook/react"
import { House, ArrowRight, CircleNotch } from "@phosphor-icons/react"

import { Button } from "../components/button"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
      description: "Estilo visual do botão",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
      description: "Tamanho do botão",
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    children: "Botão",
    variant: "default",
    size: "default",
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const Outline: Story = {
  args: { variant: "outline" },
}

export const Secondary: Story = {
  args: { variant: "secondary" },
}

export const Ghost: Story = {
  args: { variant: "ghost" },
}

export const Destructive: Story = {
  args: { variant: "destructive", children: "Excluir" },
}

export const Link: Story = {
  args: { variant: "link" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ComIcone: Story = {
  name: "Com ícone",
  args: {
    children: (
      <>
        <House />
        Início
      </>
    ),
  },
}

export const ComIconeNoFinal: Story = {
  name: "Com ícone no final",
  args: {
    children: (
      <>
        Continuar
        <ArrowRight />
      </>
    ),
  },
}

export const Carregando: Story = {
  name: "Carregando",
  args: {
    disabled: true,
    children: (
      <>
        <CircleNotch className="animate-spin" />
        Aguarde...
      </>
    ),
  },
}

export const TodasVariantes: Story = {
  name: "Todas as variantes",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const TodosTamanhos: Story = {
  name: "Todos os tamanhos",
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="xs">Extra pequeno</Button>
      <Button size="sm">Pequeno</Button>
      <Button size="default">Padrão</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
}

export const Icones: Story = {
  name: "Ícones",
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="icon-xs"><House /></Button>
      <Button size="icon-sm"><House /></Button>
      <Button size="icon"><House /></Button>
      <Button size="icon-lg"><House /></Button>
    </div>
  ),
}
