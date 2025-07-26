"use client";

import {
  Calculator,
  Shield,
  TrendingUp,
  Zap,
  Users,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Automated Payment Processing",
    description:
      "Confirm incoming payments and trigger commission calculations automatically, eliminating manual tracking.",
  },
  {
    icon: Calculator,
    title: "Smart Commission Calculations",
    description:
      "Handle complex commission structures, splits, and bonuses with precision. Set it once, let it run forever.",
  },
  {
    icon: Users,
    title: "Instant Agent Distributions",
    description:
      "Pay your agents on time, every time. Automated distributions keep everyone happy and motivated.",
  },
  {
    icon: Shield,
    title: "Built-in Accounting",
    description:
      "Complete financial tracking and reporting. Stay compliant with integrated accounting features.",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description:
      "Get insights into commission trends, agent performance, and financial metrics with powerful analytics.",
  },
  {
    icon: Clock,
    title: "Time-Saving Automation",
    description:
      "Reduce manual work by 90%. Save hours every week and eliminate human errors in commission processing.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Commission Management
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From payment confirmation to final distribution, Ergo handles your
            entire commission workflow with precision and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group hover:-translate-y-1"
            >
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <feature.icon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Features };
