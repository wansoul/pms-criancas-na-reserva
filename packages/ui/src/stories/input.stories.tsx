import type { Meta, StoryObj } from "@storybook/react"

import { Input } from "../components/input"
import { Label } from "../components/label"

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "Tipo do campo",
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    type: "text",
    placeholder: "Digite algo...",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "seu@email.com",
  },
}

export const Senha: Story = {
  name: "Senha",
  args: {
    type: "password",
    placeholder: "••••••••",
  },
}

export const Desabilitado: Story = {
  name: "Desabilitado",
  args: {
    disabled: true,
    placeholder: "Campo desabilitado",
  },
}

export const ComErro: Story = {
  name: "Com erro",
  args: {
    "aria-invalid": true,
    placeholder: "Campo inválido",
  },
}

export const ComLabel: Story = {
  name: "Com label",
  render: (args) => (
    <div className="flex flex-col gap-(--density-field-gap)">
      <Label htmlFor="input-com-label">E-mail</Label>
      <Input id="input-com-label" {...args} />
    </div>
  ),
  args: {
    type: "email",
    placeholder: "seu@email.com",
  },
}

export const ComLabelEErro: Story = {
  name: "Com label e erro",
  render: (args) => (
    <div className="flex flex-col gap-(--density-field-gap)">
      <Label htmlFor="input-erro">E-mail</Label>
      <Input id="input-erro" {...args} />
      <span className="text-xs text-destructive">E-mail inválido.</span>
    </div>
  ),
  args: {
    type: "email",
    placeholder: "seu@email.com",
    "aria-invalid": true,
  },
}
