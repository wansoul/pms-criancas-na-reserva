import type { Meta, StoryObj } from "@storybook/react"

import { Label } from "../components/label"
import { Input } from "../components/input"

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Nome completo",
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {}

export const ComInput: Story = {
  name: "Com input associado",
  render: (args) => (
    <div className="flex w-80 flex-col gap-(--density-field-gap)">
      <Label htmlFor="label-input" {...args} />
      <Input id="label-input" placeholder="Digite seu nome" />
    </div>
  ),
}

export const Obrigatorio: Story = {
  name: "Campo obrigatório",
  render: (args) => (
    <div className="flex w-80 flex-col gap-(--density-field-gap)">
      <Label htmlFor="label-required" {...args}>
        E-mail <span className="text-destructive">*</span>
      </Label>
      <Input id="label-required" type="email" placeholder="seu@email.com" required />
    </div>
  ),
}

export const Desabilitado: Story = {
  name: "Campo desabilitado",
  render: (args) => (
    <div className="group flex w-80 flex-col gap-(--density-field-gap)" data-disabled="true">
      <Label htmlFor="label-disabled" {...args} />
      <Input id="label-disabled" placeholder="Campo desabilitado" disabled />
    </div>
  ),
}
