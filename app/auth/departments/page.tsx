"use client";

import { columns, Department } from "@/components/departments/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { useRouter } from "next/navigation";

const apiResponse: { data: Department[] } = {
  data: [
    {
      id: 2,
      code: "SDP",
      name: "Sale Department",
      status: "inactive",
      created_at: "2026-03-18 04:58:31",
      updated_at: "2026-03-18 04:59:54",
      branch: {
        id: 1,
        prefix: "MDY",
        name: "Mandalay Branch",
        location: "Mandalay, 77x65",
      },
    },
  ],
};

export default function DepartmentPage() {
  const router = useRouter();

  const handleSearch = (val: string) => {
    console.log("Searching for:", val);
  };

  const handleAddNew = () => {
    router.push("/auth/departments/add");
  };

  return (
    <div className="space-y-6">
      <BaseFilter
        onSearch={handleSearch}
        placeholder="Search departments..."
        onAddClick={handleAddNew}
        addLabel="Add Department"
      />
      <DataTable columns={columns} data={apiResponse.data} />
    </div>
  );
}
