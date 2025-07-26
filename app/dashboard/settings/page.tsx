"use client";
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Users,
  Building2,
  Percent,
  Shield,
  AlertTriangle,
  Upload,
  FileText,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: "active" | "suspended" | "terminated";
  totalEarnings: number;
}

interface CompanySettings {
  commissionPercentage: number;
}

const AgenticSettingsPanel = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    commissionPercentage: 15,
  });

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Sarah Mitchell",
      email: "sarah.mitchell@company.com",
      joinDate: "2024-01-15",
      status: "active",
      totalEarnings: 12450.0,
    },
    {
      id: "2",
      name: "Marcus Chen",
      email: "marcus.chen@company.com",
      joinDate: "2024-02-20",
      status: "active",
      totalEarnings: 8930.5,
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@company.com",
      joinDate: "2024-03-10",
      status: "suspended",
      totalEarnings: 5620.75,
    },
  ]);

  const [newAgent, setNewAgent] = useState({ name: "", email: "" });
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const handleSettingsChange = (
    field: keyof CompanySettings,
    value: string | number
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const addAgent = () => {
    if (newAgent.name && newAgent.email) {
      const agent: Agent = {
        id: Date.now().toString(),
        name: newAgent.name,
        email: newAgent.email,
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
        totalEarnings: 0,
      };
      setAgents((prev) => [...prev, agent]);
      setNewAgent({ name: "", email: "" });
      setShowAddAgent(false);
    }
  };

  const removeAgent = (id: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
  };

  const toggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              status: agent.status === "active" ? "suspended" : "active",
            }
          : agent
      )
    );
  };

  const handleImportAgents = () => {
    // This would typically navigate to a new page or open a modal
    // For demonstration, we'll show an alert
    alert(
      "Redirecting to import page where you can upload your agents file..."
    );
    // In a real Next.js app, you would use:
    // router.push('/import-agents')
    setShowAddOptions(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-600 bg-emerald-100";
      case "suspended":
        return "text-yellow-600 bg-yellow-100";
      case "terminated":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-gray-200">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                System Settings
              </h1>
              <p className="text-gray-600">
                Configure your agentic accounting system
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Commission Configuration */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="backdrop-blur-xl bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 hover:bg-gray-100 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Commission Configuration
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Commission Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.commissionPercentage}
                      onChange={(e) =>
                        handleSettingsChange(
                          "commissionPercentage",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-green-500">
                    {settings.commissionPercentage}%
                  </div>
                  <div className="text-xs text-gray-500">Current Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4 sm:space-y-6">
            <div className="backdrop-blur-xl bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                System Overview
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">
                    Total Agents
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    {agents.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">
                    Active Agents
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                    {agents.filter((a) => a.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">
                    Commission Rate
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-green-700">
                    {settings.commissionPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Management */}
        <div className="mt-6 sm:mt-8">
          <div className="backdrop-blur-xl bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Agent Management
                </h2>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowAddOptions(!showAddOptions)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add Agent
                </button>

                {showAddOptions && (
                  <div className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowAddAgent(true);
                          setShowAddOptions(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">
                            Add Single Agent
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Manually add one agent
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={handleImportAgents}
                        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">
                            Import Agents File
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Upload CSV/Excel file of agents
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showAddAgent && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    Add Single Agent
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Agent Name"
                    value={newAgent.name}
                    onChange={(e) =>
                      setNewAgent((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm sm:text-base"
                  />
                  <input
                    type="email"
                    placeholder="Agent Email"
                    value={newAgent.email}
                    onChange={(e) =>
                      setNewAgent((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm sm:text-base"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addAgent}
                      className="flex-1 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddAgent(false)}
                      className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-gray-900 font-medium text-sm sm:text-base truncate">
                        {agent.name}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm truncate">
                        {agent.email}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          Joined: {agent.joinDate}
                        </span>
                        <span className="text-xs text-gray-400 hidden sm:inline">
                          •
                        </span>
                        <span className="text-xs text-green-600">
                          ${agent.totalEarnings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 justify-end sm:justify-start">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        agent.status
                      )}`}
                    >
                      {agent.status}
                    </span>
                    <button
                      onClick={() => toggleAgentStatus(agent.id)}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={
                        agent.status === "active"
                          ? "Suspend Agent"
                          : "Activate Agent"
                      }
                    >
                      {agent.status === "active" ? (
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </button>
                    <button
                      onClick={() => removeAgent(agent.id)}
                      className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Remove Agent"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25 text-sm sm:text-base">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgenticSettingsPanel;
