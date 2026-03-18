"use client";

import Link from "next/link";

export default function DialogExamples() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Link
        href="/dashboard"
        className="text-primary hover:underline text-sm font-medium"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
