"use client";
import React, { useState, useMemo, ChangeEvent } from "react";
import {
  Plus,
  Edit3,
  Save,
  Download,
  Eye,
  Trash2,
  Filter,
  Calendar,
  X,
  ChevronDown,
  Phone,
  Mail,
  User,
  MapPin,
  ArrowLeft,
  Upload,
  FileImage,
  FileSpreadsheet,
  FileText, // Use FileText for Word files
  FileArchive,
  CheckCircle2,
} from "lucide-react";

// Types
interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateJoined: string;
  lastActivity: string;
  status: "active" | "inactive" | "pending" | "suspended";
  totalPayments: number;
  commission: number;
  region: string;
  category: "premium" | "standard" | "basic" | "vip";
  department: string;
  performanceRating: number;
}

interface AgentFormData {
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending" | "suspended";
  commission: number;
  region: string;
  category: "premium" | "standard" | "basic" | "vip";
  department: string;
}

interface DateFilter {
  type: "all" | "today" | "week" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
}

type ImportFileType = "excel" | "word" | "image" | "exe" | null;

const AgentRecordsSystem: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "AGT001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      dateJoined: "2024-01-15",
      lastActivity: "2024-07-26",
      status: "active",
      totalPayments: 125000,
      commission: 2.5,
      region: "North America",
      category: "premium",
      department: "Sales",
      performanceRating: 4.8,
    },
    {
      id: "AGT002",
      name: "Michael Chen",
      email: "michael.chen@company.com",
      phone: "+1 (555) 234-5678",
      dateJoined: "2024-02-20",
      lastActivity: "2024-07-25",
      status: "active",
      totalPayments: 98500,
      commission: 2.8,
      region: "Asia Pacific",
      category: "standard",
      department: "Operations",
      performanceRating: 4.5,
    },
    {
      id: "AGT003",
      name: "Emma Rodriguez",
      email: "emma.rodriguez@company.com",
      phone: "+1 (555) 345-6789",
      dateJoined: "2024-03-10",
      lastActivity: "2024-07-20",
      status: "pending",
      totalPayments: 0,
      commission: 2.0,
      region: "Latin America",
      category: "basic",
      department: "Support",
      performanceRating: 3.8,
    },
    {
      id: "AGT004",
      name: "David Kim",
      email: "david.kim@company.com",
      phone: "+1 (555) 456-7890",
      dateJoined: "2023-11-05",
      lastActivity: "2024-07-27",
      status: "active",
      totalPayments: 189000,
      commission: 3.2,
      region: "Asia Pacific",
      category: "vip",
      department: "Sales",
      performanceRating: 4.9,
    },
    {
      id: "AGT005",
      name: "Lisa Anderson",
      email: "lisa.anderson@company.com",
      phone: "+1 (555) 567-8901",
      dateJoined: "2024-06-12",
      lastActivity: "2024-07-15",
      status: "suspended",
      totalPayments: 45000,
      commission: 1.8,
      region: "Europe",
      category: "standard",
      department: "Marketing",
      performanceRating: 3.2,
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>({ type: "all" });
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFileType, setImportFileType] = useState<ImportFileType>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    email: "",
    phone: "",
    status: "pending",
    commission: 2.0,
    region: "",
    category: "standard",
    department: "",
  });

  // Get unique values for filters
  const uniqueCategories = useMemo(
    () => [...new Set(agents.map((agent) => agent.category))],
    [agents]
  );
  const uniqueRegions = useMemo(
    () => [...new Set(agents.map((agent) => agent.region))],
    [agents]
  );
  const uniqueDepartments = useMemo(
    () => [...new Set(agents.map((agent) => agent.department))],
    [agents]
  );

  // Advanced filtering
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesStatus =
        statusFilter === "all" || agent.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || agent.category === categoryFilter;
      const matchesRegion =
        regionFilter === "all" || agent.region === regionFilter;
      const matchesDepartment =
        departmentFilter === "all" || agent.department === departmentFilter;

      let matchesDate = true;
      if (dateFilter.type !== "all") {
        const agentDate = new Date(agent.dateJoined);
        const today = new Date();

        switch (dateFilter.type) {
          case "today":
            matchesDate = agentDate.toDateString() === today.toDateString();
            break;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = agentDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(
              today.getFullYear(),
              today.getMonth() - 1,
              today.getDate()
            );
            matchesDate = agentDate >= monthAgo;
            break;
          case "quarter":
            const quarterAgo = new Date(
              today.getFullYear(),
              today.getMonth() - 3,
              today.getDate()
            );
            matchesDate = agentDate >= quarterAgo;
            break;
          case "year":
            const yearAgo = new Date(
              today.getFullYear() - 1,
              today.getMonth(),
              today.getDate()
            );
            matchesDate = agentDate >= yearAgo;
            break;
          case "custom":
            if (dateFilter.startDate && dateFilter.endDate) {
              const startDate = new Date(dateFilter.startDate);
              const endDate = new Date(dateFilter.endDate);
              matchesDate = agentDate >= startDate && agentDate <= endDate;
            }
            break;
        }
      }

      return (
        matchesStatus &&
        matchesCategory &&
        matchesRegion &&
        matchesDepartment &&
        matchesDate
      );
    });
  }, [
    agents,
    statusFilter,
    categoryFilter,
    regionFilter,
    departmentFilter,
    dateFilter,
  ]);

  const handleAddAgent = () => {
    if (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.region &&
      formData.department
    ) {
      const newAgent: Agent = {
        id: `AGT${String(agents.length + 1).padStart(3, "0")}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateJoined: new Date().toISOString().split("T")[0],
        lastActivity: new Date().toISOString().split("T")[0],
        status: formData.status,
        totalPayments: 0,
        commission: formData.commission,
        region: formData.region,
        category: formData.category,
        department: formData.department,
        performanceRating: 3.0,
      };
      setAgents([...agents, newAgent]);
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "pending",
        commission: 2.0,
        region: "",
        category: "standard",
        department: "",
      });
      setShowAddForm(false);
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      status: agent.status,
      commission: agent.commission,
      region: agent.region,
      category: agent.category,
      department: agent.department,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedAgent) {
      const updatedAgents = agents.map((agent) =>
        agent.id === selectedAgent.id ? { ...agent, ...formData } : agent
      );
      setAgents(updatedAgents);
      setIsEditing(false);
      setSelectedAgent(null);
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Date Joined",
        "Last Activity",
        "Status",
        "Category",
        "Department",
        "Region",
        "Total Payments",
        "Commission",
        "Performance",
      ],
      ...filteredAgents.map((agent) => [
        agent.id,
        agent.name,
        agent.email,
        agent.phone,
        agent.dateJoined,
        agent.lastActivity,
        agent.status,
        agent.category,
        agent.department,
        agent.region,
        agent.totalPayments.toString(),
        agent.commission.toString(),
        agent.performanceRating.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-records-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setRegionFilter("all");
    setDepartmentFilter("all");
    setDateFilter({ type: "all" });
  };

  const handleBackToList = () => {
    setSelectedAgent(null);
    setIsEditing(false);
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-600 border-gray-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-600 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vip":
        return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
      case "premium":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "standard":
        return "bg-teal-500/20 text-teal-600 border-teal-500/30";
      case "basic":
        return "bg-slate-500/20 text-slate-600 border-slate-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30";
    }
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (categoryFilter !== "all") count++;
    if (regionFilter !== "all") count++;
    if (departmentFilter !== "all") count++;
    if (dateFilter.type !== "all") count++;
    return count;
  }, [
    statusFilter,
    categoryFilter,
    regionFilter,
    departmentFilter,
    dateFilter,
  ]);

  // Import Logic (fake)
  const handleImportType = (type: ImportFileType) => {
    setImportFileType(type);
  };

  // Simulate reading and importing data from a file
  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTimeout(() => {
      setAgents((prev) => [
        ...prev,
        {
          id: `AGT${String(prev.length + 1).padStart(3, "0")}`,
          name: "Imported Agent",
          email: "imported@company.com",
          phone: "+1 (555) 000-0000",
          dateJoined: new Date().toISOString().split("T")[0],
          lastActivity: new Date().toISOString().split("T")[0],
          status: "active",
          totalPayments: 0,
          commission: 2.5,
          region: "Imported Region",
          category: "standard",
          department: "Imported Dept",
          performanceRating: 3.5,
        },
      ]);
      setImportSuccess(true);
      setTimeout(() => {
        setShowImportModal(false);
        setImportFileType(null);
        setImportSuccess(false);
      }, 1500);
    }, 1300);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Agents Records
          </h1>
          <div className="mt-2 text-sm text-gray-500">
            Showing {filteredAgents.length} of {agents.length} agents
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                active
              </span>
            )}
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-2xl p-6 mb-6 shadow-lg">
          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-500 transition-colors appearance-none shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-500 transition-colors appearance-none shadow-sm"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Region Filter */}
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-500 transition-colors appearance-none shadow-sm"
              >
                <option value="all">All Regions</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-500 transition-colors appearance-none shadow-sm"
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter.type}
                onChange={(e) => {
                  const type = e.target.value as DateFilter["type"];
                  setDateFilter({ type });
                  if (type === "custom") setShowDatePicker(true);
                }}
                className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-500 transition-colors appearance-none shadow-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
              className="px-4 py-3 bg-white border border-green-200 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>

          {/* Custom Date Range Picker */}
          {showDatePicker && dateFilter.type === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
              <input
                type="date"
                value={dateFilter.startDate || ""}
                onChange={(e) =>
                  setDateFilter((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="px-4 py-2 bg-white border border-green-200 rounded-lg text-gray-700 focus:outline-none focus:border-green-500"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateFilter.endDate || ""}
                onChange={(e) =>
                  setDateFilter((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="px-4 py-2 bg-white border border-green-200 rounded-lg text-gray-700 focus:outline-none focus:border-green-500"
                placeholder="End Date"
              />
              <button
                onClick={() => setShowDatePicker(false)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              {filteredAgents.length} agent
              {filteredAgents.length !== 1 ? "s" : ""} found
            </div>
            <div className="flex gap-2 flex-row">
              {/* Add & Import Buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Agent
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="ml-2 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  title="Import"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </button>
              </div>
              <button
                onClick={handleExport}
                disabled={filteredAgents.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Download className="w-5 h-5" />
                Export ({filteredAgents.length})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-green-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-50 to-green-50">
                <tr>
                  <th className="text-left p-4 text-gray-700 font-semibold border-b border-green-200">
                    Agent ID
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold border-b border-green-200">
                    Name & Contact
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold border-b border-green-200">
                    Department
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold border-b border-green-200">
                    Dates
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold border-b border-green-200">
                    Status
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold border-b border-green-200">
                    Category
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold border-b border-green-200">
                    Performance
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold border-b border-green-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <Filter className="w-12 h-12 text-gray-300" />
                        <div>
                          <div className="text-lg font-medium mb-1">
                            No agents found
                          </div>
                          <div className="text-sm">
                            Try adjusting your filters
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="border-b border-green-100 hover:bg-green-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-emerald-600 font-mono font-semibold">
                          {agent.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {agent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="text-gray-800 font-medium">
                              {agent.name}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Mail className="w-3 h-3" />
                              {agent.email}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Phone className="w-3 h-3" />
                              {agent.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-800 font-medium">
                          {agent.department}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <MapPin className="w-3 h-3" />
                          {agent.region}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-700 text-sm">
                          <div className="mb-1">
                            <span className="text-gray-500">Joined:</span>{" "}
                            {new Date(agent.dateJoined).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="text-gray-500">Active:</span>{" "}
                            {new Date(agent.lastActivity).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            agent.status
                          )}`}
                        >
                          {agent.status.charAt(0).toUpperCase() +
                            agent.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                            agent.category
                          )}`}
                        >
                          {agent.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-800">
                          <div className="font-semibold">
                            ${agent.totalPayments.toLocaleString()}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {agent.commission}% • ⭐{agent.performanceRating}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedAgent(agent)}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditAgent(agent)}
                            className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-lg transition-colors"
                            title="Edit Agent"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(showAddForm || isEditing) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-green-200 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="text-gray-600 w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? "Edit Agent" : "Add New Agent"}
                </h2>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Region"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "active"
                        | "inactive"
                        | "pending"
                        | "suspended",
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-500 transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as
                        | "premium"
                        | "standard"
                        | "basic"
                        | "vip",
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-500 transition-colors"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
                <input
                  type="number"
                  placeholder="Commission %"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.commission}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={isEditing ? handleSaveEdit : handleAddAgent}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300"
                >
                  <Save className="w-5 h-5" />
                  {isEditing ? "Save Changes" : "Add Agent"}
                </button>
                <button
                  onClick={handleBackToList}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IMPORT MODAL */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-blue-200 p-8 w-full max-w-md shadow-2xl flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Upload className="w-6 h-6" /> Import Agent Data
              </h2>
              <p className="mb-6 text-gray-500 text-center">
                Choose a file type to import agent(s) data.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <button
                  className={`flex flex-col items-center p-4 rounded-xl border-2 ${
                    importFileType === "excel"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 bg-gray-50"
                  } hover:bg-emerald-50 transition`}
                  onClick={() => handleImportType("excel")}
                >
                  <FileSpreadsheet className="w-8 h-8 text-emerald-700" />
                  <span className="text-sm mt-2 font-medium">Excel</span>
                </button>
                <button
                  className={`flex flex-col items-center p-4 rounded-xl border-2 ${
                    importFileType === "word"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  } hover:bg-blue-50 transition`}
                  onClick={() => handleImportType("word")}
                >
                  <FileText className="w-8 h-8 text-blue-700" />
                  <span className="text-sm mt-2 font-medium">Word</span>
                </button>
                <button
                  className={`flex flex-col items-center p-4 rounded-xl border-2 ${
                    importFileType === "image"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-gray-50"
                  } hover:bg-purple-50 transition`}
                  onClick={() => handleImportType("image")}
                >
                  <FileImage className="w-8 h-8 text-purple-700" />
                  <span className="text-sm mt-2 font-medium">PNG</span>
                </button>
                <button
                  className={`flex flex-col items-center p-4 rounded-xl border-2 ${
                    importFileType === "exe"
                      ? "border-gray-800 bg-gray-100"
                      : "border-gray-200 bg-gray-50"
                  } hover:bg-gray-100 transition`}
                  onClick={() => handleImportType("exe")}
                >
                  <FileArchive className="w-8 h-8 text-gray-700" />
                  <span className="text-sm mt-2 font-medium">EXE</span>
                </button>
              </div>
              {importFileType && (
                <div className="w-full flex flex-col items-center mb-4">
                  <label
                    htmlFor="import-file-input"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl cursor-pointer"
                  >
                    <Upload className="w-5 h-5" />
                    {importFileType === "excel" && "Upload Excel File"}
                    {importFileType === "word" && "Upload Word File"}
                    {importFileType === "image" && "Upload PNG File"}
                    {importFileType === "exe" && "Upload EXE File"}
                  </label>
                  <input
                    id="import-file-input"
                    type="file"
                    accept={
                      importFileType === "excel"
                        ? ".xlsx,.xls,.csv"
                        : importFileType === "word"
                        ? ".doc,.docx"
                        : importFileType === "image"
                        ? ".png"
                        : importFileType === "exe"
                        ? ".exe"
                        : undefined
                    }
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </div>
              )}
              {importSuccess && (
                <div className="flex items-center gap-2 mt-2 text-green-700 font-semibold bg-green-50 px-4 py-2 rounded-lg border border-green-200 transition">
                  <CheckCircle2 className="w-5 h-5" />
                  Loaded successfully
                </div>
              )}
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFileType(null);
                  setImportSuccess(false);
                }}
                className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* View Modal */}
        {selectedAgent && !isEditing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-green-200 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="text-gray-600 w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                  Agent Details
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-green-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedAgent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedAgent.name}
                    </h3>
                    <p className="text-gray-600">{selectedAgent.id}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        selectedAgent.category
                      )}`}
                    >
                      {selectedAgent.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-gray-500 text-sm mb-1">
                      Contact Information
                    </div>
                    <div className="text-gray-800 mb-2">
                      {selectedAgent.email}
                    </div>
                    <div className="text-gray-800">{selectedAgent.phone}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-gray-500 text-sm mb-1">
                        Department
                      </div>
                      <div className="text-gray-800">
                        {selectedAgent.department}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-gray-500 text-sm mb-1">Region</div>
                      <div className="text-gray-800">
                        {selectedAgent.region}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-gray-500 text-sm mb-1">Status</div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedAgent.status
                        )}`}
                      >
                        {selectedAgent.status.charAt(0).toUpperCase() +
                          selectedAgent.status.slice(1)}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-gray-500 text-sm mb-1">
                        Performance
                      </div>
                      <div className="text-gray-800 font-semibold">
                        ⭐ {selectedAgent.performanceRating}/5.0
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-gray-500 text-sm mb-1">
                        Total Payments
                      </div>
                      <div className="text-gray-800 font-semibold">
                        ${selectedAgent.totalPayments.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-gray-500 text-sm mb-1">
                        Commission Rate
                      </div>
                      <div className="text-gray-800 font-semibold">
                        {selectedAgent.commission}%
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-gray-500 text-sm mb-1">
                        Date Joined
                      </div>
                      <div className="text-gray-800">
                        {new Date(
                          selectedAgent.dateJoined
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-gray-500 text-sm mb-1">
                        Last Activity
                      </div>
                      <div className="text-gray-800">
                        {new Date(
                          selectedAgent.lastActivity
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentRecordsSystem;
