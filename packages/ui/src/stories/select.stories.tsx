import type { Meta, StoryObj } from "@storybook/react"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "../components/select"
import { Label } from "../components/label"

const meta: Meta = {
  title: "Components/Select",
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="op1">Opção 1</SelectItem>
        <SelectItem value="op2">Opção 2</SelectItem>
        <SelectItem value="op3">Opção 3</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const ComLabel: Story = {
  name: "Com label",
  render: () => (
    <div className="flex flex-col gap-2 w-[220px]">
      <Label htmlFor="periodo">Período</Label>
      <Select>
        <SelectTrigger id="periodo">
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Últimos 7 dias</SelectItem>
          <SelectItem value="30d">Últimos 30 dias</SelectItem>
          <SelectItem value="90d">Últimos 90 dias</SelectItem>
          <SelectItem value="12m">Últimos 12 meses</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const ComGrupos: Story = {
  name: "Com grupos",
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Tipo de quarto" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Standard</SelectLabel>
          <SelectItem value="std-single">Single</SelectItem>
          <SelectItem value="std-double">Double</SelectItem>
          <SelectItem value="std-twin">Twin</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Superior</SelectLabel>
          <SelectItem value="sup-suite">Suíte</SelectItem>
          <SelectItem value="sup-master">Master</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Desabilitado: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Indisponível" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="op1">Opção 1</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Tamanhos: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Select>
        <SelectTrigger size="sm" className="w-[180px]">
          <SelectValue placeholder="Tamanho sm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Item A</SelectItem>
          <SelectItem value="b">Item B</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger size="default" className="w-[180px]">
          <SelectValue placeholder="Tamanho default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Item A</SelectItem>
          <SelectItem value="b">Item B</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}
