import type { Meta, StoryObj } from "@storybook/react"

import { StatCard } from "../components/stat-card"

const meta: Meta<typeof StatCard> = {
  title: "Components/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[240px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StatCard>

export const Alta: Story = {
  name: "Tendência de alta",
  args: {
    label: "Receita pelo motor",
    value: "R$ 18.450",
    delta: { value: "12%", direction: "up" },
    hint: "vs. mês anterior",
  },
}

export const Baixa: Story = {
  name: "Tendência de baixa",
  args: {
    label: "Taxa de conversão",
    value: "3,1%",
    delta: { value: "0,4 pp", direction: "down" },
    hint: "168 visitas",
  },
}

export const Estavel: Story = {
  name: "Estável",
  args: {
    label: "Reservas pelo motor",
    value: "7",
    delta: { value: "estável", direction: "flat" },
  },
}

export const SemDelta: Story = {
  name: "Sem comparação",
  args: {
    label: "Reservas pelo motor",
    value: "0",
    hint: "Compartilhe seu link para começar",
  },
}

export const Grade: Story = {
  name: "Grade de 3 (heróis)",
  render: () => (
    <div className="grid w-[720px] grid-cols-3 gap-4">
      <StatCard
        label="Receita pelo motor"
        value="R$ 18.450"
        delta={{ value: "12%", direction: "up" }}
        hint="vs. mês anterior"
      />
      <StatCard
        label="Taxa de conversão"
        value="3,8%"
        delta={{ value: "0,5 pp", direction: "up" }}
        hint="712 visitas"
      />
      <StatCard
        label="Reservas pelo motor"
        value="27"
        delta={{ value: "4", direction: "up" }}
        hint="vs. mês anterior"
      />
    </div>
  ),
}
