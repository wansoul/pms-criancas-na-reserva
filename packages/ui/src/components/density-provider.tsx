"use client"

import * as React from "react"

export type Density = "comfortable" | "compact"

export const DensityContext = React.createContext<{
  density: Density
  setDensity: (density: Density) => void
}>({
  density: "comfortable",
  setDensity: () => {},
})

export function DensityProvider({
  defaultDensity = "comfortable",
  children,
}: {
  defaultDensity?: Density
  children: React.ReactNode
}) {
  const [density, setDensity] = React.useState<Density>(defaultDensity)

  React.useEffect(() => {
    document.documentElement.setAttribute("data-density", density)
  }, [density])

  return (
    <DensityContext.Provider value={{ density, setDensity }}>
      {children}
    </DensityContext.Provider>
  )
}
