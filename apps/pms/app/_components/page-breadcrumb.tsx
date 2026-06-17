"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { navSections } from "./nav-config"

const HOME_URL = "/home"
// "Home" is an intentional exception to the pt-BR UI copy rule for the breadcrumb root.
const ROOT_LABEL = "Home"

/** An explicit intermediate crumb, for routes not described by `navSections`. */
type ParentCrumb = { label: string; url: string }

/**
 * Breadcrumb for logged-in pages, derived from the current route via `navSections`.
 * Shows `Home › [grupo] › [página]`, where the group crumb only appears for
 * sectioned areas (Motor de Reservas, Canais) — not for the flat "Menu principal".
 *
 * Pass `parent` to supply the intermediate crumb explicitly for routes outside
 * the sidebar nav (e.g. the Área Hospedin sub-pages).
 */
export function PageBreadcrumb({
  title,
  parent,
  parents,
}: {
  title: string
  parent?: ParentCrumb
  /** Multiple intermediate crumbs, e.g. Cadastros › Categorias de UH. Wins over `parent`. */
  parents?: ParentCrumb[]
}) {
  const pathname = usePathname()

  // Home is the navigation root — no breadcrumb (nothing to navigate up to).
  if (pathname === HOME_URL) {
    return null
  }

  // Find the owning section, ignoring the flat "Menu principal" grouping.
  const section = navSections.find(
    (s) => s.label !== "Menu principal" && s.items.some((i) => i.url === pathname)
  )
  // Explicit `parents`/`parent` win over the nav-derived section.
  const intermediates: ParentCrumb[] =
    parents ??
    (parent
      ? [parent]
      : section
        ? [{ label: section.label, url: section.items[0]?.url ?? HOME_URL }]
        : [])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={HOME_URL} />}>{ROOT_LABEL}</BreadcrumbLink>
        </BreadcrumbItem>
        {intermediates.map((crumb) => (
          <React.Fragment key={crumb.url}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={crumb.url} />}>
                {crumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
