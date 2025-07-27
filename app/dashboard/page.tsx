"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  
  if (!user) return 'Loading...';
console.log(user)
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Welcome, {user?.companyName}!</h1>
      <p>Company: {user?.email || "N/A"}</p>
      <p>User ID: {user?.uid}</p>
      <button onClick={logout} className="bg-green-500 p-1 mt-4">logout</button>
    </div>
  );
};

export default Dashboard;
