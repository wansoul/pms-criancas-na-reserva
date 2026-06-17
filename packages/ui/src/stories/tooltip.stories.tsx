import type { Meta, StoryObj } from "@storybook/react"
import { Info } from "@phosphor-icons/react"

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/tooltip"
import { Button } from "../components/button"

const meta: Meta = {
  title: "Components/Tooltip",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex items-center justify-center py-16">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger className="rounded border border-border px-3 py-1.5 text-sm">
        Passe o mouse
      </TooltipTrigger>
      <TooltipContent>Texto de ajuda</TooltipContent>
    </Tooltip>
  ),
}

export const EmBotao: Story = {
  name: "Em botão de ação",
  render: () => (
    <Tooltip>
      <TooltipTrigger className="inline-flex">
        <Button variant="outline" size="icon">
          <Info />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Ver detalhes da reserva</TooltipContent>
    </Tooltip>
  ),
}

export const Posicoes: Story = {
  name: "Posições",
  render: () => (
    <div className="flex items-center gap-6">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger className="rounded border border-border px-3 py-1.5 text-sm capitalize">
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}
