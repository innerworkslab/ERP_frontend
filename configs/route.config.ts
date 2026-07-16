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
  Warehouse,
  Package,
  MoveHorizontal,
  History,
  BarChart,
  Wallet,
  ShoppingCart,
  ArrowRightLeft,
  Sliders,
  BookOpen,
  Truck,
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
  "/auth/inventories": {
    title: "Inventory Management",
    desc: "View and modify inventories",
    breadcrumb: "Inventories",
  },
  "/auth/inventories/add": {
    title: "Add Inventory",
    desc: "Create a new inventory for your catalog.",
    breadcrumb: "inventories/Add",
  },
  "/auth/inventories/:id": {
    title: "Inventory Details",
    desc: "View and modify inventory details.",
    breadcrumb: "Details",
  },
  "/auth/inventories/:id/edit": {
    title: "Edit Inventory",
    desc: "Modify existing inventory details.",
    breadcrumb: "Edit",
  },
  "/auth/collections": {
    title: "Collection Management",
    desc: "View and modify collections",
    breadcrumb: "Inventories",
  },
  "/auth/collections/add": {
    title: "Add collection",
    desc: "Create a new collection for your catalog.",
    breadcrumb: "collections/add",
  },
  "/auth/collections/:id": {
    title: "Collection Details",
    desc: "View and modify collection details.",
    breadcrumb: "Details",
  },
  "/auth/collections/:id/edit": {
    title: "Edit collection",
    desc: "Modify existing collection details.",
    breadcrumb: "Edit",
  },
  "/auth/opening-stocks": {
    title: "Collection Management",
    desc: "View and modify opening stocks",
    breadcrumb: "Inventories",
  },
  "/auth/opening-stocks/add": {
    title: "Add Opening Stock",
    desc: "Create a new opening stock for your catalog.",
    breadcrumb: "opening-stocks/add",
  },
  "/auth/opening-stocks/:id": {
    title: "Collection Details",
    desc: "View and modify opening stock details.",
    breadcrumb: "Details",
  },
  "/auth/opening-stocks/:id/edit": {
    title: "Edit Opening Stock",
    desc: "Modify existing opening stock details.",
    breadcrumb: "Edit",
  },
  "/auth/inventory/stock-transfers": {
    title: "Stock Transfers",
    desc: "Manage and track inventory movement between warehouses.",
    breadcrumb: "Inventories",
  },
  "/auth/inventory/stock-transfers/add": {
    title: "New Stock Transfer",
    desc: "Create a new inter-warehouse stock movement.",
    breadcrumb: "stock-transfers/add",
  },
  "/auth/inventory/stock-transfers/:id": {
    title: "Transfer Details",
    desc: "View manifest and logistics path for this transfer.",
    breadcrumb: "Details",
  },
  "/auth/inventory/stock-transfers/:id/edit": {
    title: "Edit Stock Transfer",
    desc: "Modify pending stock transfer records.",
    breadcrumb: "Edit",
  },
  "/auth/stock-ledgers": {
    title: "View Stock Ledgers",
    desc: "View records of stock ledgers",
    breadcrumb: "Stock Ledgers",
  },
  "/auth/stock-balances": {
    title: "View Stock Balances",
    desc: "View records of stock balances",
    breadcrumb: "Stock Balances",
  },
  "/auth/cashbooks": {
    title: "Cashbook Management",
    desc: "View and modify cashbook entries",
    breadcrumb: "Cashbooks",
  },
  "/auth/cashbooks/add": {
    title: "Add Cashbook Entry",
    desc: "Create a new cashbook entry.",
    breadcrumb: "cashbooks/add",
  },
  "/auth/cashbooks/:id": {
    title: "Cashbook Details",
    desc: "View and modify cashbook details.",
    breadcrumb: "Details",
  },
  "/auth/cashbooks/:id/edit": {
    title: "Edit Cashbook Entry",
    desc: "Modify existing cashbook entry details.",
    breadcrumb: "Edit",
  },
  "/auth/cashbook-transactions": {
    title: "Cashbook Transactions",
    desc: "View and modify cashbook transactions",
    breadcrumb: "Cashbook Transactions",
  },
  "/auth/cashbook-transactions/create": {
    title: "Add Transaction",
    desc: "Create a new cashbook transaction.",
    breadcrumb: "Cashbook Transactions/Add",
  },
  "/auth/cashbook-transactions/:id": {
    title: "Transaction Details",
    desc: "View and modify cashbook transaction details.",
    breadcrumb: "Cashbook Transactions/Details",
  },
  "/auth/cashbook-transactions/:id/edit": {
    title: "Edit Transaction",
    desc: "Modify existing cashbook transaction details.",
    breadcrumb: "Cashbook Transactions/Edit",
  },
  "/auth/purchase-orders": {
    title: "Purchase Orders",
    desc: "View and manage purchase orders.",
    breadcrumb: "Purchase Orders",
  },
  "/auth/purchase-orders/add": {
    title: "Add Purchase Order",
    desc: "Create a new purchase order.",
    breadcrumb: "Purchase Orders/Add",
  },
  "/auth/purchase-orders/:id": {
    title: "Purchase Order Details",
    desc: "View and modify purchase order details.",
    breadcrumb: "Purchase Orders/Details",
  },
  "/auth/purchase-orders/:id/edit": {
    title: "Edit Purchase Order",
    desc: "Modify existing purchase order details.",
    breadcrumb: "Purchase Orders/Edit",
  },
  "/auth/cashbook-transfers": {
    title: "Cashbook Transfers",
    desc: "View and manage inter-cashbook asset transfers.",
    breadcrumb: "Cashbook Transfers",
  },
  "/auth/cashbook-transfers/create": {
    title: "Create Transfer",
    desc: "Initiate a new inter-cashbook asset transfer sequence.",
    breadcrumb: "Cashbook Transfers/Create",
  },
  "/auth/cashbook-transfers/:id": {
    title: "Transfer Details",
    desc: "View validation metadata and routing profiles for this transfer.",
    breadcrumb: "Cashbook Transfers/Details",
  },
  "/auth/cashbook-transfers/:id/edit": {
    title: "Edit Transfer",
    desc: "Modify pending inter-cashbook transfer records.",
    breadcrumb: "Cashbook Transfers/Edit",
  },
  "/auth/cashbook-adjustments": {
    title: "Cashbook Adjustments",
    desc: "View and manage manual cashbook balance adjustments.",
    breadcrumb: "Cashbook Adjustments",
  },
  "/auth/cashbook-adjustments/create": {
    title: "Create Adjustment",
    desc: "Execute a structural balance reconciliation adjustment entry.",
    breadcrumb: "Cashbook Adjustments/Create",
  },
  "/auth/cashbook-adjustments/:id": {
    title: "Adjustment Details",
    desc: "View ledger correction values and reconciliation audit logging.",
    breadcrumb: "Cashbook Adjustments/Details",
  },
  "/auth/cashbook-adjustments/:id/edit": {
    title: "Edit Adjustment",
    desc: "Modify historical balance adjustment entries.",
    breadcrumb: "Cashbook Adjustments/Edit",
  },
  "/auth/goods-receive-notes": {
    title: "Goods Receive Notes",
    desc: "View and manage goods receive notes.",
    breadcrumb: "Goods Receive Notes",
  },
  "/auth/goods-receive-notes/add": {
    title: "Add Goods Receive Note",
    desc: "Create a new goods receive note.",
    breadcrumb: "Goods Receive Notes/Add",
  },
  "/auth/goods-receive-notes/:id": {
    title: "Goods Receive Note Details",
    desc: "View and modify goods receive note details.",
    breadcrumb: "Goods Receive Notes/Details",
  },
  "/auth/goods-receive-notes/:id/edit": {
    title: "Edit Goods Receive Note",
    desc: "Modify existing goods receive note details.",
    breadcrumb: "Goods Receive Notes/Edit",
  },
  "/auth/goods-receive-notes/:id/returnable-lines": {
    title: "Returnable Items Matrix",
    desc: "View items available for balance adjustment from this document.",
    breadcrumb: "Goods Receive Notes/Returnable Lines",
  },
  "/auth/purchase-returns": {
    title: "Purchase Returns",
    desc: "View and manage purchase returns.",
    breadcrumb: "Purchase Returns",
  },
  "/auth/purchase-returns/add": {
    title: "Add Purchase Return",
    desc: "Create a new purchase return.",
    breadcrumb: "Purchase Returns/Add",
  },
  "/auth/purchase-returns/:id": {
    title: "Purchase Return Details",
    desc: "View and modify purchase return details.",
    breadcrumb: "Purchase Returns/Details",
  },
  "/auth/purchase-returns/:id/edit": {
    title: "Edit Purchase Return",
    desc: "Modify existing purchase return details.",
    breadcrumb: "Purchase Returns/Edit",
  },
  "/auth/cashbook-ledgers": {
    title: "Cashbook Ledgers",
    desc: "View and manage cashbook ledger entries.",
    breadcrumb: "Cashbook Ledgers",
  },
  "/auth/cashbook-ledgers/:id": {
    title: "Cashbook Ledger Details",
    desc: "View and analyze cashbook ledger entry details.",
    breadcrumb: "Cashbook Ledgers/Details",
  },
  "/auth/delivery-providers": {
    title: "Delivery Providers",
    desc: "View and manage delivery service providers.",
    breadcrumb: "Delivery Providers",
  },
  "/auth/sale-invoices": {
    title: "Sale Invoices",
    desc: "View and manage sale invoices.",
    breadcrumb: "Sale Invoices",
  },
  "/auth/sale-invoices/add": {
    title: "Add Sale Invoice",
    desc: "Create a new sale invoice.",
    breadcrumb: "Sale Invoices/Add",
  },
  "/auth/sale-invoices/:id": {
    title: "Sale Invoice Details",
    desc: "View and modify sale invoice details.",
    breadcrumb: "Sale Invoices/Details",
  },
  "/auth/sale-invoices/:id/edit": {
    title: "Edit Sale Invoice",
    desc: "Modify existing sale invoice details.",
    breadcrumb: "Sale Invoices/Edit",
  },
  "/auth/delivery-notes": {
    title: "Delivery Notes",
    desc: "View and manage delivery notes.",
    breadcrumb: "Delivery Notes",
  },
  "/auth/delivery-notes/add": {
    title: "Add Delivery Note",
    desc: "Create a new delivery note.",
    breadcrumb: "Delivery Notes/Add",
  },
  "/auth/delivery-notes/:id": {
    title: "Delivery Note Details",
    desc: "View and modify delivery note details.",
    breadcrumb: "Delivery Notes/Details",
  },
  "/auth/delivery-notes/:id/edit": {
    title: "Edit Delivery Note",
    desc: "Modify existing delivery note details.",
    breadcrumb: "Delivery Notes/Edit",
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
      { name: "Sale Invoices", path: "/auth/sale-invoices", icon: Ticket },
      { name: "Products", path: "/auth/products", icon: Tag },
      { name: "Collections", path: "/auth/collections", icon: Package },
      { name: "Price Group", path: "/auth/price-groups", icon: DollarSign },
      {
        name: "Discount Groups",
        path: "/auth/discount-groups",
        icon: Percent,
      },
      { name: "Customer Types", path: "/auth/customer-types", icon: Layers },
      { name: "Taxes", path: "/auth/taxes", icon: Ticket },
      {
        name: "Delivery Providers",
        path: "/auth/delivery-providers",
        icon: Truck,
      },
      { name: "Delivery Notes", path: "/auth/delivery-notes", icon: Truck },
    ],
  },
  {
    section: "Inventory Management",
    items: [
      { name: "Inventory", path: "/auth/inventories", icon: Warehouse },
      {
        name: "Purchase Orders",
        path: "/auth/purchase-orders",
        icon: ShoppingCart,
      },
      {
        name: "Purchase Returns",
        path: "/auth/purchase-returns",
        icon: ShoppingCart,
      },
      {
        name: "Goods Receive Notes",
        path: "/auth/goods-receive-notes",
        icon: Package,
      },
      { name: "Opening Stocks", path: "/auth/opening-stocks", icon: Package },
      {
        name: "Stock Transfers",
        path: "/auth/stock-transfers",
        icon: MoveHorizontal,
      },
      {
        name: "Stock Ledger",
        path: "/auth/stock-ledgers",
        icon: History,
      },
      {
        name: "Stock Balances",
        path: "/auth/stock-balances",
        icon: BarChart,
      },
    ],
  },
  {
    section: "Finance & Accounts",
    items: [
      { name: "Cashbooks", path: "/auth/cashbooks", icon: Wallet },
      {
        name: "Cashbook Transactions",
        path: "/auth/cashbook-transactions",
        icon: History,
      },
      {
        name: "Cashbook Transfers",
        path: "/auth/cashbook-transfers",
        icon: ArrowRightLeft,
      },
      {
        name: "Cashbook Adjustments",
        path: "/auth/cashbook-adjustments",
        icon: Sliders,
      },
      {
        name: "Cashbook Ledgers",
        path: "/auth/cashbook-ledgers",
        icon: BookOpen,
      },
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
