"use client"

import { useContext } from "react"

import { DensityContext, type Density } from "@workspace/ui/components/density-provider"

export function useDensity() {
  return useContext(DensityContext)
}

export type { Density }
