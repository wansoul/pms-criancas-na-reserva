import {
  BookOpen,
  ChartBar,
  CreditCard,
  House,
  type Icon,
  MapTrifold,
  Package,
  Sun,
  Users,
} from "@phosphor-icons/react"

export type NavItem = {
  title: string
  url: string
  icon: Icon
  badge?: string
}

export type NavSection = {
  label: string
  items: NavItem[]
}

/** Sidebar navigation for the logged-in PMS area (área logada). */
export const navSections: NavSection[] = [
  {
    label: "Menu principal",
    items: [
      { title: "Home", url: "/home", icon: House },
      { title: "Indicadores", url: "/indicadores", icon: ChartBar },
      { title: "Mapa", url: "/mapa", icon: MapTrifold },
      { title: "Reservas", url: "/reservas", icon: BookOpen },
      { title: "Hóspedes", url: "/hospedes", icon: Users },
      { title: "Day Use", url: "/day-use", icon: Sun },
      { title: "Transações", url: "/transacoes", icon: CreditCard, badge: "731" },
      { title: "Meu Caixa", url: "/meu-caixa", icon: Package },
    ],
  },
]
