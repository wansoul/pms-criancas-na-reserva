"use client"

import { useEffect } from "react"
import Hotjar from "@hotjar/browser"

const siteId = 3167615
const hotjarVersion = 6

export function HotjarInit() {
  useEffect(() => {
    Hotjar.init(siteId, hotjarVersion)
  }, [])

  return null
}
