"use client"

import Link from "next/link"
import {
  Bell,
  CaretDown,
  CornersOut,
  FileText,
  Gear,
  MagnifyingGlass,
  Moon,
  NotePencil,
  Plus,
  Power,
  ShieldCheck,
  Sun,
  User,
  WarningCircle,
} from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import * as React from "react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="size-9" aria-hidden />
  }

  const isDark = resolvedTheme === "dark"
  const label = isDark ? "Ativar modo claro" : "Ativar modo escuro"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={label}
        >
          <Sun
            className={`absolute size-5 transition-all duration-200 motion-reduce:transition-none ${isDark ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-90"}`}
          />
          <Moon
            className={`absolute size-5 transition-all duration-200 motion-reduce:transition-none ${isDark ? "scale-0 opacity-0 -rotate-90" : "scale-100 opacity-100 rotate-0"}`}
          />
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type TopbarNotice = { icon: typeof Bell; count: number; tone: string; label: string }

const notices: TopbarNotice[] = [
  { icon: WarningCircle, count: 119, tone: "bg-rose-500", label: "Pendências" },
  { icon: Bell, count: 3, tone: "bg-orange-400", label: "Notificações" },
]

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-1 border-b border-border bg-background px-3">
      <SidebarTrigger className="size-9" />

      <Button variant="ghost" size="icon" className="size-9 text-muted-foreground">
        <CornersOut className="size-5" />
        <span className="sr-only">Tela cheia</span>
      </Button>
      <Button variant="ghost" size="icon" className="size-9 text-muted-foreground">
        <Plus className="size-5" />
        <span className="sr-only">Criar</span>
      </Button>
      <Button variant="ghost" size="icon" className="size-9 text-muted-foreground">
        <MagnifyingGlass className="size-5" />
        <span className="sr-only">Buscar</span>
      </Button>

      <div className="ml-auto flex items-center gap-1">
        {notices.map((notice) => (
          <Button
            key={notice.label}
            variant="ghost"
            size="icon"
            className="relative size-9 text-muted-foreground"
          >
            <notice.icon className="size-5" />
            <span
              className={`absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ${notice.tone}`}
            >
              {notice.count}
            </span>
            <span className="sr-only">{notice.label}</span>
          </Button>
        ))}

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-1.5 py-1 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8">
              <AvatarFallback className="bg-[#404e67] text-xs text-white">MP</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">Minha pousada</span>
            <CaretDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem render={<Link href="/area-hospedin" />}>
              <ShieldCheck className="size-4" />
              Área Hospedin
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/informacoes-da-conta" />}>
              <Gear className="size-4" />
              Minha conta
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="size-4" />
              Meu usuário
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/cadastros" />}>
              <NotePencil className="size-4" />
              Cadastros
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="size-4" />
              Relatórios
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileText className="size-4" />
              Notas fiscais
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Power className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
