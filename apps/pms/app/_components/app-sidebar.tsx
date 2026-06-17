"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CaretDown, Question } from "@phosphor-icons/react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"

import { navSections } from "./nav-config"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center px-3">
        <Link href="/home" className="flex items-center gap-2.5">
          <Image
            src="/hospedin-icon-light.svg"
            alt="Hospedin"
            width={18}
            height={20}
            priority
            className="shrink-0"
          />
          <span className="text-[16px] font-semibold text-white group-data-[collapsible=icon]:hidden">
            Hospedin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navSections.map((section) => (
          <Collapsible
            key={section.label}
            defaultOpen
            className="group/section"
          >
            <SidebarGroup className="px-0">
              <SidebarGroupLabel
                render={<CollapsibleTrigger />}
                className="cursor-pointer pl-5 text-sidebar-foreground/55 uppercase tracking-wider hover:text-sidebar-foreground/80"
              >
                {section.label}
                <CaretDown className="ml-auto size-3.5 transition-transform duration-200 group-data-[panel-open]/section:rotate-180" />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      const isActive =
                        pathname === item.url || pathname.startsWith(`${item.url}/`)
                      return (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            isActive={isActive}
                            tooltip={item.title}
                            className="rounded-none group-data-[state=expanded]:pl-5 data-active:group-data-[state=expanded]:border-l-4 data-active:group-data-[state=expanded]:border-l-[#19c2a8] data-active:group-data-[state=expanded]:pl-4 data-active:!bg-[#19c2a8]/12 data-active:!text-[#19c2a8]"
                            render={<Link href={item.url} />}
                          >
                            <item.icon weight={isActive ? "fill" : "regular"} />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                          {item.badge ? (
                            <SidebarMenuBadge className="bg-[#f0915e] text-white">
                              {item.badge}
                            </SidebarMenuBadge>
                          ) : null}
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Ajuda"
              className="rounded-none pl-5 text-[#f5d400] hover:text-[#f5d400] [&_svg]:text-[#f5d400]"
              render={<Link href="/ajuda" />}
            >
              <Question weight="fill" />
              <span>Ajuda</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
