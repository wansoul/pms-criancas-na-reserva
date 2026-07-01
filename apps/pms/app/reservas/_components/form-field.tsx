import { cn } from "@workspace/ui/lib/utils"

/** Label-left, control-right form row (desktop-primary). */
export function Field({
  label,
  required,
  alignTop,
  children,
}: {
  label: string
  required?: boolean
  alignTop?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid gap-1.5 sm:grid-cols-[160px_1fr] sm:gap-6",
        alignTop ? "sm:items-start" : "sm:items-center"
      )}
    >
      <label
        className={cn(
          "text-sm font-medium text-foreground sm:text-right",
          alignTop && "sm:pt-1.5"
        )}
      >
        {required && <span className="text-destructive">* </span>}
        {label}
      </label>
      <div>{children}</div>
    </div>
  )
}

export function Separator() {
  return <div className="border-t border-border" />
}
