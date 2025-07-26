"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="relative w-full lg:w-1/2 bg-gradient-to-br from-green-100 via-green-200 to-green-50 flex items-center justify-center p-8 lg:p-10 overflow-hidden">
        <div className="z-10 text-center lg:text-left max-w-md space-y-6">
          <div className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-lg px-4 py-2 rounded-2xl shadow-lg">
            <Sparkles className="text-green-500 w-6 h-6" />
            <h2 className="text-xl font-bold text-green-900">
              Welcome to ERGO
            </h2>
          </div>
          <p className="text-gray-700 text-center text-lg">AI</p>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 text-center mb-6">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <Label htmlFor="companyName" className="text-gray-700 text-sm">
                Company Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="ERGO"
                  required
                  className="pl-10 h-12 bg-white/60 text-gray-800 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500/30 transition-all w-full"
                />
              </div>
            </div>
            {/* Email */}

            <div>
              <Label htmlFor="email" className="text-gray-700 text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="pl-10 h-12 bg-white/60 text-gray-800 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500/30 transition-all w-full"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-700 text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 h-12 bg-white/60 text-gray-800 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500/30 transition-all w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white hover:text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing up...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-600 hover:underline font-medium"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
