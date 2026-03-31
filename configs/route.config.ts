import {
  Building,
  Home,
  Split,
  Ticket,
  Users,
  Users2,
  Component,
  ShieldCheck,
  DollarSign,
  Layers,
  Ruler,
  RefreshCcw,
  Coins,
  Percent,
  Tag,
  Globe,
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
  "/auth/branches/:id": {
    title: "Branch Details",
    desc: "View and modify branch details and status.",
    breadcrumb: "Details",
  },
  "/auth/branches/:id/edit": {
    title: "Edit Branch",
    desc: "Modify existing branch details and status.",
    breadcrumb: "Edit",
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
  "/auth/price-groups": {
    title: "Price Group",
    desc: "Modify price group configurations.",
    breadcrumb: "Price Group",
  },
  "/auth/customer-types": {
    title: "Customer Type Management",
    desc: "Define and manage different customer categories.",
    breadcrumb: "Customer Types",
  },
  "/auth/variations": {
    title: "Variation Management",
    desc: "Manage product attributes and variations.",
    breadcrumb: "Variations",
  },
  "/auth/uom": {
    title: "Units of Measure Management",
    desc: "Manage and define units of measurement for products.",
    breadcrumb: "Units of Measure",
  },
  "/auth/uom-conversions": {
    title: "UOM Conversion Management",
    desc: "Define conversion rates between different units of measure.",
    breadcrumb: "UOM Conversion",
  },
  "/auth/currencies": {
    title: "Currency Management",
    desc: "Manage currencies and their exchange rates.",
    breadcrumb: "Currencies",
  },
  "/auth/discount-groups": {
    title: "Discount Groups",
    desc: "Manage customer discount groups and branch assignments.",
    breadcrumb: "Discount Groups",
  },
  "/auth/brands": {
    title: "Brand Management",
    desc: "Manage your product brands.",
    breadcrumb: "Brands",
  },
  "/auth/categories": {
    title: "Category Management",
    desc: "Manage your product categories.",
    breadcrumb: "Categories",
  },
  "/auth/taxes": {
    title: "Tax Management",
    desc: "Manage tax configurations and rates.",
    breadcrumb: "Taxes",
  },
  "/auth/origin-countries": {
    title: "Origin Country Management",
    desc: "Manage origin countries for products.",
    breadcrumb: "Origin Countries",
  },
  "/auth/products": {
    title: "Product Management",
    desc: "Manage your product catalog.",
    breadcrumb: "Products",
  },
  "/auth/products/add": {
    title: "Add Product",
    desc: "Create a new product for your catalog.",
    breadcrumb: "Products/Add",
  },
  "/auth/products/:id": {
    title: "Product Details",
    desc: "View and modify product details.",
    breadcrumb: "Details",
  },
  "/auth/products/:id/edit": {
    title: "Edit Product",
    desc: "Modify existing product details.",
    breadcrumb: "Edit",
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
      { name: "Staffs", path: "/auth/staffs", icon: Users },
      { name: "Suppliers", path: "/auth/suppliers", icon: Users2 },
      { name: "Customers", path: "/auth/customers", icon: Users2 },
      { name: "Variations", path: "/auth/variations", icon: Component },
    ],
  },
  {
    section: "Sales & Pricing",
    items: [
      { name: "Products", path: "/auth/products", icon: Tag },
      { name: "Price Group", path: "/auth/price-groups", icon: DollarSign },
      {
        name: "Discount Groups",
        path: "/auth/discount-groups",
        icon: Percent,
      },
      { name: "Customer Types", path: "/auth/customer-types", icon: Layers },
      { name: "Taxes", path: "/auth/taxes", icon: Ticket },
    ],
  },
  {
    section: "Setup",
    items: [
      { name: "Units of Measure", path: "/auth/uom", icon: Ruler },
      { name: "Brands", path: "/auth/brands", icon: Tag },
      { name: "Categories", path: "/auth/categories", icon: Layers },
      { name: "Origin Countries", path: "/auth/origin-countries", icon: Globe },
      {
        name: "UOM Conversion",
        path: "/auth/uom-conversions",
        icon: RefreshCcw,
      },
      {
        name: "Currencies",
        path: "/auth/currencies",
        icon: Coins,
      },
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
