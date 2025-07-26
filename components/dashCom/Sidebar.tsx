// components/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, BarChart3, Settings, X } from "lucide-react";
import React from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Overview", path: "/dashboard/overview", icon: Home },
    { label: "Payouts", path: "/dashboard/payout", icon: BarChart3 },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`
    w-64 h-full md:h-100 bg-white border-r shadow-sm z-30
    transform transition-transform duration-300 ease-in-out
    fixed md:relative
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(({ label, path, icon: Icon }) => {
              const active = pathname === path;
              return (
                <li key={label}>
                  <button
                    onClick={() => router.push(path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      active
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
