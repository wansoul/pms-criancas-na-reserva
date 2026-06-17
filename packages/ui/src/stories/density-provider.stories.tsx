import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

import { DensityProvider, type Density } from "../components/density-provider"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/card"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Label } from "../components/label"

const meta: Meta = {
  title: "System/DensityProvider",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Provedor de contexto que controla a densidade da interface. Aplica `data-density` no `<html>` e disponibiliza o hook `useDensity()` para leitura e alteração da densidade em qualquer componente filho.",
      },
    },
  },
}

export default meta
type Story = StoryObj

function DemoForm({ density }: { density: Density }) {
  return (
    <div style={{ width: 360 }}>
      <DensityProvider defaultDensity={density}>
        <Card>
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <CardDescription>Preencha os dados para criar sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-(--density-form-gap)">
              <div className="flex flex-col gap-(--density-field-gap)">
                <Label htmlFor={`name-${density}`}>Nome completo</Label>
                <Input id={`name-${density}`} placeholder="João Silva" />
              </div>
              <div className="flex flex-col gap-(--density-field-gap)">
                <Label htmlFor={`email-${density}`}>E-mail</Label>
                <Input id={`email-${density}`} type="email" placeholder="joao@email.com" />
              </div>
              <div className="flex flex-col gap-(--density-field-gap)">
                <Label htmlFor={`pass-${density}`}>Senha</Label>
                <Input id={`pass-${density}`} type="password" placeholder="••••••••" />
              </div>
              <Button className="mt-1 w-full">Criar conta</Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">
              Já tem conta?{" "}
              <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                Entrar
              </a>
            </p>
          </CardFooter>
        </Card>
      </DensityProvider>
    </div>
  )
}

export const Confortavel: Story = {
  name: "Confortável (padrão)",
  render: () => <DemoForm density="comfortable" />,
}

export const Compacta: Story = {
  name: "Compacta",
  render: () => <DemoForm density="compact" />,
}

export const ComparacaoLadoALado: Story = {
  name: "Comparação lado a lado",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen items-center justify-center gap-12 bg-background p-12">
      <div className="flex flex-col items-center gap-4">
        <span className="text-muted-foreground text-sm font-medium">Confortável</span>
        <DemoForm density="comfortable" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <span className="text-muted-foreground text-sm font-medium">Compacta</span>
        <DemoForm density="compact" />
      </div>
    </div>
  ),
}

export const Interativo: Story = {
  name: "Toggle interativo",
  render: () => {
    const [density, setDensity] = useState<Density>("comfortable")
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
          <Button
            variant={density === "comfortable" ? "default" : "outline"}
            size="sm"
            onClick={() => setDensity("comfortable")}
          >
            Confortável
          </Button>
          <Button
            variant={density === "compact" ? "default" : "outline"}
            size="sm"
            onClick={() => setDensity("compact")}
          >
            Compacta
          </Button>
        </div>
        <DemoForm density={density} />
      </div>
    )
  },
}
