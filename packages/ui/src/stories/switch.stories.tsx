import type { Meta, StoryObj } from "@storybook/react"

import { Switch } from "../components/switch"
import { Label } from "../components/label"

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    size: "default",
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {}

export const Ativo: Story = {
  name: "Ativo por padrão",
  args: { defaultChecked: true },
}

export const Desabilitado: Story = {
  args: { disabled: true },
}

export const Pequeno: Story = {
  name: "Tamanho sm",
  args: { size: "sm" },
}

export const ComLabel: Story = {
  name: "Com label",
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notif" />
      <Label htmlFor="notif">Receber notificações por e-mail</Label>
    </div>
  ),
}

export const ListaDeConfiguracoes: Story = {
  name: "Lista de configurações",
  render: () => (
    <div className="flex flex-col gap-4 w-[360px]">
      {[
        { id: "motor", label: "Motor de Reservas ativo", checked: true },
        { id: "pix", label: "Aceitar PIX", checked: true },
        { id: "card", label: "Aceitar cartão de crédito", checked: false },
        { id: "email", label: "Enviar confirmação por e-mail", checked: true },
      ].map(({ id, label, checked }) => (
        <div key={id} className="flex items-center justify-between">
          <Label htmlFor={id} className="cursor-pointer">{label}</Label>
          <Switch id={id} defaultChecked={checked} />
        </div>
      ))}
    </div>
  ),
}
