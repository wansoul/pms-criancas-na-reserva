import type { Meta, StoryObj } from "@storybook/react"

import { Skeleton } from "../components/skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
}

export const CardDeReserva: Story = {
  name: "Card de reserva (loading state)",
  render: () => (
    <div className="flex items-center gap-4 w-[360px]">
      <Skeleton className="size-12 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ),
}

export const StatCards: Story = {
  name: "StatCards (loading state)",
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[720px]">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-4 flex flex-col gap-3">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  ),
}

export const LinhaDeTabela: Story = {
  name: "Linhas de tabela (loading state)",
  render: () => (
    <div className="flex flex-col gap-3 w-[480px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-4/12" />
          <Skeleton className="h-4 w-3/12" />
          <Skeleton className="h-4 w-2/12" />
          <Skeleton className="h-5 w-2/12 rounded-full" />
        </div>
      ))}
    </div>
  ),
}
