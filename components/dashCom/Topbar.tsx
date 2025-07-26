// components/Topbar.tsx
"use client";

import { Menu } from "lucide-react";

interface TopbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ setSidebarOpen }) => {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>
    </div>
  );
};
