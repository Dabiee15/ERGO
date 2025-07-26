// components/MetricCard.tsx
import React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  prefix?: string;
  subValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  prefix = "",
  subValue,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {prefix}
          {value}
          {subValue && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({subValue})
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          <span
            className={`inline-flex items-center ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="mr-1 h-3 w-3" />
            {change > 0 ? "+" : ""}
            {change}%
          </span>{" "}
          from last period
        </p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
