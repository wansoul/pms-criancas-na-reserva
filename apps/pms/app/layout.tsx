import React from "react"
import type { Metadata } from "next"
import { Geist_Mono, Open_Sans, Montserrat } from "next/font/google"

import "../../../packages/ui/src/styles/globals.css"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { DensityProvider } from "@workspace/ui/components/density-provider"
import { cn } from "@workspace/ui/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { HotjarInit } from "@/components/hotjar-init"

import { AppSidebar } from "./_components/app-sidebar"
import { AppTopbar } from "./_components/app-topbar"

const montserratHeading = Montserrat({ subsets: ["latin"], variable: "--font-heading" })

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  ...(process.env.VERCEL ? { icons: { icon: "/hospedin-favicon.png" } } : {}),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-density="comfortable"
      className={cn("antialiased", fontMono.variable, "font-sans", openSans.variable, montserratHeading.variable)}
    >
      <body>
        <HotjarInit />
        <ThemeProvider>
          <DensityProvider defaultDensity="comfortable">
            <TooltipProvider delay={0}>
              <SidebarProvider style={{ "--sidebar-width": "240px" } as React.CSSProperties}>
                <AppSidebar />
                <SidebarInset>
                  <AppTopbar />
                  <div className="flex-1">{children}</div>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </DensityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
