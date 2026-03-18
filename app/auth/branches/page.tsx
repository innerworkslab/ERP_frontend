"use client";

import { Branch, columns } from "@/components/branches/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { useRouter } from "next/navigation";

const apiResponse = {
  data: [
    {
      id: 2,
      prefix: "YGN",
      name: "YANGON Branch",
      location: "YANGON, 19 street",
      status: "inactive",
      created_by: { name: "Super Admin", email: "superadmin@example.com" },
      created_at: "2026-03-18 04:02:01",
    },
  ],
};

export default function BranchPage() {
  const router = useRouter();

  const handleSearch = (val: string) => {
    console.log("Searching for:", val);
  };

  const handleAddNew = () => {
    router.push("/auth/branches/add");
  };
  return (
    <div className="space-y-6">
      <BaseFilter
        onSearch={handleSearch}
        placeholder="Search branches..."
        onAddClick={handleAddNew}
        addLabel="Add Branch"
      ></BaseFilter>
      <DataTable<Branch, unknown> columns={columns} data={apiResponse.data} />
    </div>
  );
}
