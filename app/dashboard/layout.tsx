"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashCom/Sidebar";
import { Topbar } from "@/components/dashCom/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black h-screen bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
