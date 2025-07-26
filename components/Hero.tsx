"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-purple-50/20">
      <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-green-700 opacity-5"></div>
      <div className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4" />
            Trusted by 500+ Real Estate Teams
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Effortless Commission Payouts for{" "}
            <span className="bg-gradient-to-r from-lime-500 to-green-700 bg-clip-text text-transparent">
              Real Estate Teams
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Automate your entire commission workflow. From payment confirmation
            to earnings distribution, Ergo handles it all—securely, accurately,
            and on time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No Setup Fees
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              14-Day Free Trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Cancel Anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
