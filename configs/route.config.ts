import {
  BookText,
  Building,
  Home,
  Split,
  Ticket,
  Users,
  Users2,
} from "lucide-react";

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
  "/auth/staffs": {
    title: "Staff Management",
    desc: "Manage your organizational staff.",
    breadcrumb: "Staffs",
  },
  "/auth/staffs/add": {
    title: "Add Staff",
    desc: "Create a new staff member for your organization.",
    breadcrumb: "Staffs/Add",
  },
  "/auth/staffs/:id/edit": {
    title: "Edit Staff",
    desc: "Modify existing staff details and status.",
    breadcrumb: "Staffs/Edit",
  },
  "/auth/suppliers": {
    title: "Supplier Management",
    desc: "Manage your supplier base.",
    breadcrumb: "Suppliers",
  },
  "/auth/suppliers/add": {
    title: "Add Supplier",
    desc: "Create a new supplier for your organization.",
    breadcrumb: "Suppliers/Add",
  },
  "/auth/suppliers/:id/edit": {
    title: "Edit Supplier",
    desc: "Modify existing supplier details and status.",
    breadcrumb: "Suppliers/Edit",
  },
  "/auth/customers": {
    title: "Customer Management",
    desc: "Manage your customer base.",
    breadcrumb: "Customers",
  },
  "/auth/customers/add": {
    title: "Add Customer",
    desc: "Create a new customer for your organization.",
    breadcrumb: "Customers/Add",
  },
  "/auth/customers/:id/edit": {
    title: "Edit Customer",
    desc: "Modify existing customer details and status.",
    breadcrumb: "Customers/Edit",
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
      { name: "Staffs", path: "/auth/staffs", icon: Users },
      { name: "Suppliers", path: "/auth/suppliers", icon: Users2 },
      { name: "Customers", path: "/auth/customers", icon: Users2 },
    ],
  },
  {
    section: "Accounting",
    items: [{ name: "Cashbook (COA)", path: "/auth/cashbook", icon: BookText }],
  },
];
