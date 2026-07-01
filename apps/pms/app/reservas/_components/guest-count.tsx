import { Input } from "@workspace/ui/components/input"

export function GuestCount({
  label,
  required,
  value,
  onChange,
  min,
}: {
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  min: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {required && <span className="text-destructive">* </span>}
        {label}
      </span>
      <Input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
