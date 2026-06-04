"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CheckCircle2,
  Code2,
  Star,
  LineChart,
  Command,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "All Snippets",
      url: "/snippets",
      icon: <Code2 />,
    },
    {
      title: "Favorites",
      url: "/dashboard/upcoming",
      icon: <Star />,
    },
    {
      title: "Analytics",
      url: "/dashboard/completed",
      icon: <LineChart />,
    },
    {
      title: "Settings",
      url: "/dashboard/completed",
      icon: <CheckCircle2 />,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2 group-data-[state=collapsed]:justify-center">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="size-4" />
          </div>

          {!isCollapsed && (
            <div className="flex gap-0.5 leading-none">
              <span className="font-semibold">SnipBox</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname === item.url}
              >
                <Link
                  href={item.url}
                  className={
                    "w-full flex items-center gap-3 px-3 py-5 rounded-lg duration-200 ease-in-out font-medium text-sm cursor-pointer "
                  }
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
