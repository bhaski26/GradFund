import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-950 text-white p-16">
        <h1 className="text-5xl font-bold mb-6">
          GradFund
        </h1>

        <p className="text-xl text-slate-300 text-center max-w-md">
          Your AI-powered personal finance operating system
          built exclusively for students.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-slate-50 p-8">
        {children}
      </div>
    </div>
  );
}