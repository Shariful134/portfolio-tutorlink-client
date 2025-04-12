"use client";

import * as React from "react";
import {
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";

import { NavUser } from "./nav-user";
import { useUser } from "@/context/UserContext";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/user/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "My Bookings",
        url: user?.role === "student" ? "/student/bookings" : "/tutor/bookings",
        icon: Bot,
        items:
          user?.role === "student"
            ? [
                {
                  title: "Bookings Request",
                  url: "/student/bookings",
                },
                {
                  title: "Bookings History",
                  url: "/student/bookingsHistory",
                },
              ]
            : [
                {
                  title: "Bookings Request",
                  url: "/tutor/bookings",
                },
                {
                  title: "Bookings History",
                  url: "/tutor/bookingsHistory",
                },
              ],
      },

      {
        title: "Shop",
        url: "/user/shop/products",
        icon: Bot,
        items: [
          {
            title: "Manage Products",
            url: "/user/shop/products",
          },
          {
            title: "Manage Categories",
            url: "/user/shop/category",
          },
          {
            title: "Manage Brands",
            url: "/user/shop/brand",
          },
        ],
      },

      {
        title: "Setting",
        url: "/tutor",
        icon: Settings,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
