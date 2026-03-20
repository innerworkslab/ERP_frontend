import { Building, Component, Home, ShieldCheck, Split } from "lucide-react";

export const routeConfig: Record<
  string,
  { title: string; desc: string; breadcrumb: string }
> = {
  "/auth": {
    title: "Dashboard",
    desc: "Welcome back to your control panel.",
    breadcrumb: "Home",
  },
  "/auth/branches": {
    title: "Branch Management",
    desc: "Manage your regional offices and branch locations.",
    breadcrumb: "Branches",
  },
  "/auth/departments": {
    title: "Department Management",
    desc: "Manage your organizational departments.",
    breadcrumb: "Departments",
  },
  "/auth/roles": {
    title: "Role Management",
    desc: "Define organizational hierarchy and permission profiles.",
    breadcrumb: "Roles",
  },
  "/auth/features": {
    title: "Feature Management",
    desc: "Configure system capabilities and assign functional access.",
    breadcrumb: "Features",
  },
};

export const menu = [
  {
    section: "Overview",
    items: [{ name: "Dashboard", path: "/auth", icon: Home }],
  },
  {
    section: "Organization",
    items: [
      { name: "Branches", path: "/auth/branches", icon: Split },
      { name: "Departments", path: "/auth/departments", icon: Building },
    ],
  },
  {
    section: "Access Control",
    items: [
      { name: "Roles", path: "/auth/roles", icon: ShieldCheck },
      { name: "Features", path: "/auth/features", icon: Component },
    ],
  },
];
