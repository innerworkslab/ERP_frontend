import { BookText, Building, Home, Split, Ticket } from "lucide-react";

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
  "/auth/branches/add": {
    title: "Add Branch",
    desc: "Create a new branch for your organization.",
    breadcrumb: "Branches/Add",
  },
  "/auth/branches/:id/edit": {
    title: "Edit Branch",
    desc: "Modify existing branch details and status.",
    breadcrumb: "Branches/Edit",
  },
  "/auth/departments": {
    title: "Department Management",
    desc: "Manage your organizational departments.",
    breadcrumb: "Departments",
  },
  "/auth/roles": {
    title: "Role Management",
    desc: "Manage your role for users.",
    breadcrumb: "Roles",
  },
  "/auth/departments/add": {
    title: "Add Department",
    desc: "Create a new department for your organization.",
    breadcrumb: "Departments/Add",
  },
  "/auth/departments/:id/edit": {
    title: "Edit Department",
    desc: "Modify existing department details and status.",
    breadcrumb: "Departments/Edit",
  },
};

export const menu = [
  {
    section: "Overview",
    items: [{ name: "Dashboard", path: "/auth", icon: Home }],
  },
  {
    section: "Management",
    items: [
      { name: "Branches", path: "/auth/branches", icon: Split },
      { name: "Departments", path: "/auth/departments", icon: Building },
      { name: "Role", path: "/auth/roles", icon: Ticket },
    ],
  },
  {
    section: "Accounting",
    items: [{ name: "Cashbook (COA)", path: "/auth/cashbook", icon: BookText }],
  },
];
