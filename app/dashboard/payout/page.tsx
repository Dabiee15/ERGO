"use client";

import { ReactNode, FC, useState } from "react";
import {
  DollarSign,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type AgentStatus = "pending" | "review" | "approved";

interface SaleDetail {
  property: string;
  amount: number;
  commission: number;
  date: string;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  avatar: string;
  totalSales: number;
  totalCommission: number;
  pendingCommission: number;
  status: AgentStatus;
  lastSale: string;
  joinDate: string;
  performance: number;
  salesDetails: SaleDetail[];
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface ButtonProps {
  children: ReactNode;
  variant?: "default" | "outline" | "destructive" | "ghost" | "hero";
  size?: "default" | "sm";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ToastProps {
  message: string;
  type: "success" | "info";
  onClose: () => void;
}

// Mock data for agents in payout queue
const mockAgents = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "/placeholder.svg",
    totalSales: 8,
    totalCommission: 12450.0,
    pendingCommission: 12450.0,
    status: "pending", // ✅ must be a literal string that matches AgentStatus
    lastSale: "2024-01-15",
    joinDate: "2023-06-12",
    performance: 94,
    salesDetails: [
      {
        property: "123 Main St",
        amount: 450000,
        commission: 4500,
        date: "2024-01-15",
      },
      {
        property: "456 Oak Ave",
        amount: 320000,
        commission: 3200,
        date: "2024-01-12",
      },
      {
        property: "789 Pine Rd",
        amount: 495000,
        commission: 4750,
        date: "2024-01-10",
      },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatar: "/placeholder.svg",
    totalSales: 12,
    totalCommission: 18750.0,
    pendingCommission: 8250.0,
    status: "review",
    lastSale: "2024-01-14",
    joinDate: "2023-03-20",
    performance: 88,
    salesDetails: [
      {
        property: "321 Elm St",
        amount: 280000,
        commission: 2800,
        date: "2024-01-14",
      },
      {
        property: "654 Maple Dr",
        amount: 545000,
        commission: 5450,
        date: "2024-01-11",
      },
    ],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    avatar: "/placeholder.svg",
    totalSales: 6,
    totalCommission: 9850.0,
    pendingCommission: 9850.0,
    status: "pending",
    lastSale: "2024-01-13",
    joinDate: "2023-09-05",
    performance: 92,
    salesDetails: [
      {
        property: "987 Cedar Ln",
        amount: 385000,
        commission: 3850,
        date: "2024-01-13",
      },
      {
        property: "147 Birch Ave",
        amount: 600000,
        commission: 6000,
        date: "2024-01-09",
      },
    ],
  },
  {
    id: 4,
    name: "David Wilson",
    email: "d.wilson@example.com",
    avatar: "/placeholder.svg",
    totalSales: 15,
    totalCommission: 22100.0,
    pendingCommission: 5400.0,
    status: "approved",
    lastSale: "2024-01-16",
    joinDate: "2022-11-15",
    performance: 96,
    salesDetails: [
      {
        property: "258 Willow St",
        amount: 425000,
        commission: 4250,
        date: "2024-01-16",
      },
      {
        property: "369 Spruce Dr",
        amount: 115000,
        commission: 1150,
        date: "2024-01-14",
      },
    ],
  },
];

// Custom components to replace shadcn/ui
// Components
const Card: FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader: FC<CardProps> = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardContent: FC<CardProps> = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardTitle: FC<CardProps> = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription: FC<CardProps> = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

const Button: FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  onClick,
  disabled,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    hero: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge: FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "bg-gray-900 text-white",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const Toast: FC<ToastProps> = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-4 py-2 rounded-md shadow-lg ${
          type === "success"
            ? "bg-green-500 text-white"
            : "bg-blue-500 text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

const PayoutPage = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  const itemsPerPage = 5;

  const filteredAgents = mockAgents.filter(
    (agent) => statusFilter === "all" || agent.status === statusFilter
  );

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusBadge = (status: Agent["status"]) => {
    const statusConfig: Record<
      Agent["status"],
      { variant: BadgeProps["variant"]; icon: typeof Clock; text: string }
    > = {
      pending: { variant: "secondary", icon: Clock, text: "Pending" },
      review: { variant: "outline", icon: AlertCircle, text: "Under Review" },
      approved: { variant: "default", icon: CheckCircle, text: "Approved" },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const handleAction = (
    action: "approve" | "reject" | "process",
    agentId: number
  ) => {
    const agent = mockAgents.find((a) => a.id === agentId);
    if (!agent) return;

    switch (action) {
      case "approve":
        showToast(
          `${
            agent.name
          }'s commission of $${agent.pendingCommission.toLocaleString()} has been approved for payment.`
        );
        break;
      case "reject":
        showToast(
          `${agent.name}'s payout has been rejected and moved to review.`
        );
        break;
      case "process":
        showToast(
          `Initiating payment of $${agent.pendingCommission.toLocaleString()} to ${
            agent.name
          }.`
        );
        break;
    }
  };

  const openAgentModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  };

  const totalPendingAmount = filteredAgents.reduce(
    (sum, agent) => sum + agent.pendingCommission,
    0
  );
  const totalAgents = filteredAgents.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agent Payouts
          </h1>
          <p className="text-gray-600">
            Manage commission payments for your sales agents
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pending
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalPendingAmount.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Agents in Queue
              </CardTitle>
              <User className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAgents}</div>
              <p className="text-xs text-gray-600">
                {mockAgents.filter((a) => a.status === "pending").length}{" "}
                pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Commission
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {totalAgents > 0
                  ? Math.round(
                      totalPendingAmount / totalAgents
                    ).toLocaleString()
                  : 0}
              </div>
              <p className="text-xs text-gray-600">Per agent this cycle</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Payout Queue</CardTitle>
                <CardDescription>
                  Review and process agent commission payments
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                {(["all", "pending", "review", "approved"] as const).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Agents Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAgents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {agent.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {agent.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {agent.totalSales}
                            </div>
                            <div className="text-sm text-gray-500">
                              Last: {agent.lastSale}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            ${agent.totalCommission.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-green-600">
                            ${agent.pendingCommission.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(agent.status as AgentStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                style={{ width: `${agent.performance}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {agent.performance}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                openAgentModal({
                                  ...agent,
                                  status: agent.status as AgentStatus,
                                })
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {agent.status === "pending" && (
                              <>
                                {/* <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAction("approve", agent.id)
                                  }
                                >
                                  Approve
                                </Button> */}
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleAction("reject", agent.id)
                                  }
                                >
                                  Cancel
                                </Button>
                              </>
                            )}

                            {agent.status === "approved" && (
                              <Button
                                variant="hero"
                                size="sm"
                                onClick={() =>
                                  handleAction("process", agent.id)
                                }
                              >
                                Process Payment
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent Details Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedAgent && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedAgent.name} - Sales Details
                </h2>
                <p className="text-sm text-gray-600">
                  Review detailed sales information and commission breakdown
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedAgent.totalSales}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Commission
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${selectedAgent.pendingCommission.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Sales</h4>
                <div className="space-y-3">
                  {selectedAgent.salesDetails.map((sale, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {sale.property}
                        </p>
                        <p className="text-sm text-gray-500">{sale.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${sale.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600">
                          +${sale.commission.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PayoutPage;
