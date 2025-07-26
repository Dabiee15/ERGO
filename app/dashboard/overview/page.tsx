// app/(dashboard)/overview/page.tsx
"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Users, Award } from "lucide-react";
import MetricCard from "@/components/dashCom/MetricCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/dashCom/Card";
import { Badge } from "@/components/dashCom/Badge";

const OverviewPage = () => {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");

  // Mock data — replace with real API calls later
  const salesData = {
    day: { value: 3, change: +12.0, amount: 750000 },
    week: { value: 12, change: +8.2, amount: 3000000 },
    month: { value: 47, change: +12.5, amount: 11750000 },
  };

  const paymentsData = {
    day: { value: 620000, change: +5.3 },
    week: { value: 2480000, change: +15.3 },
    month: { value: 9840000, change: +18.7 },
  };

  const topAgent = {
    name: "Sarah Johnson",
    sales: 23,
    commission: 456000,
    avatar: "/placeholder.svg",
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("NGN", "₦");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-600">
          Welcome back! Here's your commission and sales summary.
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {["day", "week", "month"].map((range) => (
          <Badge
            key={range}
            variant={timeframe === range ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setTimeframe(range as "day" | "week" | "month")}
          >
            {range === "day"
              ? "Today"
              : range === "week"
              ? "This Week"
              : "This Month"}
          </Badge>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title={`Sales Made (${timeframe})`}
          value={salesData[timeframe].value}
          change={salesData[timeframe].change}
          icon={TrendingUp}
          subValue={formatNaira(salesData[timeframe].amount)}
        />

        <MetricCard
          title={`Payments Made Out (${timeframe})`}
          value={formatNaira(paymentsData[timeframe].value)}
          change={paymentsData[timeframe].change}
          icon={DollarSign}
        />

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle>Top Ranking Agent</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-lime-400 to-green-600 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {topAgent.name}
                </div>
                <p className="text-xs text-gray-500">
                  {topAgent.sales} sales • {formatNaira(topAgent.commission)}{" "}
                  commission
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Overview Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest commission updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b pb-2">
                <div>
                  <p className="font-medium text-gray-900">
                    Commission Payment
                  </p>
                  <p className="text-sm text-gray-500">
                    Property Sale - 123 Main St
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">
                    +{formatNaira(240000)}
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">New Sale Recorded</p>
                  <p className="text-sm text-gray-500">
                    Property Sale - 456 Oak Ave
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">Sale Completed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Your commission trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 font-medium">
                  Conversion Rate
                </span>
                <span className="text-green-600 font-bold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 font-medium">
                  Avg. Commission
                </span>
                <span className="font-bold">{formatNaira(209500)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 font-medium">
                  Monthly Goal
                </span>
                <span className="text-green-600 font-bold">78% Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
