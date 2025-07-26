import {
  ArrowRight,
  CheckCircle,
  TrendingDown,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Clock,
    title: "Save 20+ Hours Per Week",
    description:
      "Eliminate manual commission calculations and payment processing. Your team can focus on closing deals instead of paperwork.",
    metric: "90% less manual work",
  },
  {
    icon: TrendingDown,
    title: "Reduce Errors by 99%",
    description:
      "Automated calculations and built-in validation ensure accuracy. No more costly mistakes or agent disputes.",
    metric: "99% accuracy rate",
  },
  {
    icon: Users,
    title: "Keep Agents Happy",
    description:
      "On-time payments and transparent commission tracking boost agent satisfaction and retention.",
    metric: "40% higher retention",
  },
];

const Benefits = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transform Your Real Estate Operations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the immediate impact Ergo has on your business efficiency,
              accuracy, and agent satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-lime-500 to-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                  {benefit.metric}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Ready to streamline your commission process?
                </h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">
                      Setup in under 30 minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">
                      White-glove onboarding included
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">24/7 customer support</span>
                  </div>
                </div>
                <Button variant="cta" size="xl" className="group">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    14 Days
                  </div>
                  <div className="text-gray-600 mb-4">Free Trial</div>
                  <div className="text-2xl font-semibold text-gray-900 mb-2">
                    $0
                  </div>
                  <div className="text-sm text-gray-600">
                    No credit card required
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Benefits };
