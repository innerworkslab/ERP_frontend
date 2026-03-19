import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/NavHeader";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-transparent">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
