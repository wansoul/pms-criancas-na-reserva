import Link from "next/link"
import type { Icon } from "@phosphor-icons/react"
// Server component: use the phosphor SSR entry to avoid the client-only IconContext.
import {
  CalendarDots,
  ChartBar,
  ChartLineUp,
  CreditCard,
  Heart,
  IdentificationBadge,
  ShieldCheck,
  Trophy,
} from "@phosphor-icons/react/dist/ssr"

import { Card } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

import { PageBreadcrumb } from "../_components/page-breadcrumb"

type AdminStat = { value: string; label: string }

type AdminCard = {
  title: string
  icon: Icon
  url: string
  stats?: AdminStat[]
}

type AdminSection = {
  label: string
  description: string
  icon: Icon
  /** Tailwind text color class for the section + card icons. */
  accent: string
  /** Tailwind background tint for the card icon tile. */
  tint: string
  cards: AdminCard[]
}

/**
 * Internal Hospedin team area, reached via the avatar dropdown ("Área Hospedin").
 * Groups administrative tools into themed sections, each headed by a quote.
 */
const sections: AdminSection[] = [
  {
    label: "Administrativo",
    description: "Transformando organização em prosperidade.",
    icon: ShieldCheck,
    accent: "text-violet-600",
    tint: "bg-violet-50",
    cards: [
      {
        title: "Eventos Nacionais",
        icon: CalendarDots,
        url: "#",
        stats: [{ value: "100", label: "eventos" }],
      },
    ],
  },
  {
    label: "Relacionamento com o cliente",
    description: "Se você ajuda alguém, você tem um cliente para a vida toda.",
    icon: Heart,
    accent: "text-rose-500",
    tint: "bg-rose-50",
    cards: [
      {
        title: "Integração de usuários",
        icon: IdentificationBadge,
        url: "#",
      },
    ],
  },
  {
    label: "Financeiro",
    description: "Preço é o que você paga, valor é o que você leva!",
    icon: CreditCard,
    accent: "text-sky-600",
    tint: "bg-sky-50",
    cards: [
      {
        title: "Contas",
        icon: Trophy,
        url: "#",
        stats: [
          { value: "3541", label: "ativas" },
          { value: "372", label: "trial" },
          { value: "281", label: "inativas" },
        ],
      },
    ],
  },
  {
    label: "Estatísticas",
    description: "A estatística é a arte de torturar os números até que eles confessem.",
    icon: ChartLineUp,
    accent: "text-emerald-600",
    tint: "bg-emerald-50",
    cards: [
      {
        title: "Dashboard",
        icon: ChartBar,
        url: "#",
      },
    ],
  },
]

export default function AreaHospedinPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <div>
        <PageBreadcrumb title="Área Hospedin" />
        <h1 className="mt-3 font-heading text-lg font-normal tracking-wide uppercase">
          Área Hospedin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ferramentas internas do time Hospedin.
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.label} className="flex flex-col gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-base font-medium tracking-wide uppercase">
              <section.icon weight="fill" className={cn("size-5", section.accent)} />
              {section.label}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{section.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.cards.map((card) => (
              <Link key={card.title} href={card.url} className="group">
                <Card className="flex-row items-center gap-4 px-4 py-4 transition-shadow group-hover:shadow-md group-hover:ring-foreground/20">
                  <span
                    className={cn(
                      "flex size-16 shrink-0 items-center justify-center rounded-md",
                      section.tint
                    )}
                  >
                    <card.icon className={cn("size-8", section.accent)} />
                  </span>
                  <div className="flex flex-1 flex-col items-end gap-1 text-right">
                    <span className="font-heading text-sm font-medium">{card.title}</span>
                    {card.stats ? (
                      <div className="flex items-baseline gap-3">
                        {card.stats.map((stat) => (
                          <span key={stat.label} className="flex flex-col items-end">
                            <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                              {stat.value}
                            </span>
                            <span className="text-[10px] text-muted-foreground/70 uppercase">
                              {stat.label}
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
