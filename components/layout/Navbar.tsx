import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="px-8 py-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Dashboard</p>
        <h2 className="text-3xl font-semibold mt-1">Placeholders</h2>
        <p className="text-sm text-gray-500 mt-1">
          Create and manage your chart data.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="w-10 h-10 rounded-full bg-muted" />
      </div>
    </header>
  );
}
