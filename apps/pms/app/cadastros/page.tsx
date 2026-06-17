import Link from "next/link"
import type { Icon } from "@phosphor-icons/react"
import {
  Bed,
  Buildings,
  Calculator,
  CalendarDots,
  FolderOpen,
  Medal,
  Rocket,
  ShoppingCart,
  Signpost,
  Tag,
  Users,
} from "@phosphor-icons/react/dist/ssr"

import { Card } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

import { PageBreadcrumb } from "../_components/page-breadcrumb"

type RegistroCard = {
  title: string
  description: string
  icon: Icon
  url: string
}

const registros: RegistroCard[] = [
  {
    title: "Categorias de UH",
    description: "Categorize as UHs",
    icon: Tag,
    url: "/cadastros/categorias-de-uh",
  },
  {
    title: "UHs",
    description: "Unidades Habitacionais",
    icon: Bed,
    url: "#",
  },
  {
    title: "Tarifas",
    description: "Tarifário, preços e pacotes",
    icon: FolderOpen,
    url: "#",
  },
  {
    title: "Empresas",
    description: "Clientes, fornecedores e outros",
    icon: Buildings,
    url: "#",
  },
  {
    title: "Itens",
    description: "Defina seus produtos e serviços",
    icon: ShoppingCart,
    url: "#",
  },
  {
    title: "Canais de venda",
    description: "OTAs e outros canais",
    icon: Rocket,
    url: "#",
  },
  {
    title: "Pontos de venda",
    description: "Pontos dos produtos e serviços",
    icon: Signpost,
    url: "#",
  },
  {
    title: "Usuários",
    description: "Usuários, grupos e permissões",
    icon: Users,
    url: "#",
  },
  {
    title: "Contas",
    description: "Contas para receitas e despesas",
    icon: Calculator,
    url: "#",
  },
  {
    title: "Categorias",
    description: "Categorias para receitas e despesas",
    icon: Medal,
    url: "#",
  },
  {
    title: "Eventos",
    description: "Eventos mostrados no mapa",
    icon: CalendarDots,
    url: "#",
  },
]

export default function CadastrosPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <PageBreadcrumb title="Cadastros" />
        <h1 className="mt-3 font-heading text-lg font-normal tracking-wide uppercase">
          Cadastros
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesse e gerencie os principais cadastros do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {registros.map((item) => (
          <Link key={item.title} href={item.url} className="group">
            <Card
              className={cn(
                "flex flex-row items-center justify-between gap-4 px-5 py-4",
                "transition-shadow group-hover:shadow-md group-hover:ring-1 group-hover:ring-foreground/10",
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-heading text-sm font-semibold text-primary group-hover:text-primary/80">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <item.icon className="size-5 text-primary" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
