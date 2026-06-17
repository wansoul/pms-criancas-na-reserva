import type { Meta, StoryObj } from "@storybook/react"
import { User, Gear, SignOut, Bell, CreditCard, Trash } from "@phosphor-icons/react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../components/dropdown-menu"
import { Button } from "../components/button"

const meta: Meta = {
  title: "Components/DropdownMenu",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center py-16">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Abrir menu</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>
          <User />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Gear />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <SignOut />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const ComAvatar: Story = {
  name: "Menu do usuário (topbar)",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full">WS</Button>} />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Wan Souza</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            Meu perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Assinatura
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notificações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <SignOut />
          Sair
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const ComCheckbox: Story = {
  name: "Com checkboxes",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Filtros</Button>} />
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Mostrar reservas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Confirmadas</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Pendentes</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Canceladas</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const ComRadio: Story = {
  name: "Com radio group",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Período</Button>} />
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Visualizar por</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="30d">
          <DropdownMenuRadioItem value="7d">7 dias</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="30d">30 dias</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="90d">90 dias</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const ComSubmenu: Story = {
  name: "Com submenu",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Ações</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>Editar reserva</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Mais ações</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Reenviar confirmação</DropdownMenuItem>
            <DropdownMenuItem>Gerar voucher</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
