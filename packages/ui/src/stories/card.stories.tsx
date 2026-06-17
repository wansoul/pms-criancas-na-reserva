import type { Meta, StoryObj } from "@storybook/react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "../components/card"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Label } from "../components/label"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "Tamanho do card",
    },
  },
  args: {
    size: "default",
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Título do card</CardTitle>
        <CardDescription>Descrição breve sobre o conteúdo deste card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Conteúdo principal do card. Pode incluir texto, formulários, tabelas ou qualquer outro elemento.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">Cancelar</Button>
        <Button className="flex-1">Confirmar</Button>
      </CardFooter>
    </Card>
  ),
}

export const Compacto: Story = {
  name: "Compacto (size=sm)",
  render: (args) => (
    <Card {...args} size="sm">
      <CardHeader>
        <CardTitle>Card compacto</CardTitle>
        <CardDescription>Versão reduzida para espaços menores.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Conteúdo compacto.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Ação</Button>
      </CardFooter>
    </Card>
  ),
}

export const ComAcaoNoHeader: Story = {
  name: "Com ação no cabeçalho",
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Gerencie as preferências da sua conta.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">Editar</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Configure notificações, privacidade e dados pessoais.
        </p>
      </CardContent>
    </Card>
  ),
}

export const FormularioDeLogin: Story = {
  name: "Formulário de login",
  render: (args) => (
    <Card {...args}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-primary-foreground"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
        <CardDescription>Entre com sua conta para acessar o Hospedin</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-(--density-form-gap)">
          <div className="flex flex-col gap-(--density-field-gap)">
            <Label htmlFor="login-email">E-mail</Label>
            <Input id="login-email" type="email" placeholder="seu@email.com" />
          </div>
          <div className="flex flex-col gap-(--density-field-gap)">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Senha</Label>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
                Esqueceu a senha?
              </a>
            </div>
            <Input id="login-password" type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="mt-1 w-full">Entrar</Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">
          Não tem uma conta?{" "}
          <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
            Cadastre-se
          </a>
        </p>
      </CardFooter>
    </Card>
  ),
}
