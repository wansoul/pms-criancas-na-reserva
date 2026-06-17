// Server component: use the phosphor SSR entry to avoid the client-only IconContext.
import { Stack } from "@phosphor-icons/react/dist/ssr"

import { PageBreadcrumb } from "./page-breadcrumb"

type PagePlaceholderProps = {
  title: string
  description?: string
  parent?: { label: string; url: string }
  /** Headline shown inside the empty-state box. */
  emptyTitle?: string
  /** Secondary line inside the empty-state box. */
  emptyDescription?: string
}

/** Temporary content shell for not-yet-built logged-in pages. */
export function PagePlaceholder({
  title,
  description,
  parent,
  emptyTitle = "Conteúdo em construção",
  emptyDescription = "Esta tela faz parte da estrutura do sistema e será detalhada em breve.",
}: PagePlaceholderProps) {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <PageBreadcrumb title={title} parent={parent} />
        <h1 className="mt-3 font-heading text-lg font-normal uppercase tracking-wide">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Stack className="size-6" />
        </span>
        <div>
          <p className="text-sm font-medium">{emptyTitle}</p>
          <p className="text-xs text-muted-foreground">{emptyDescription}</p>
        </div>
      </div>
    </div>
  )
}
