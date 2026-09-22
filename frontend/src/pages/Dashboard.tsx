import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import SavingsRateCard from "@/components/dashboard/SavingsRateCard";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import DashboardError from "@/components/dashboard/DashboardError";

import {
    Wallet,
    Receipt,
    PiggyBank,
    HeartPulse,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {

    const {

        data,

        loading,

        error,

    } = useDashboard();

    if (loading) {

        return <DashboardSkeleton />;

    }

    if (error) {

        return (

            <DashboardError

                onRetry={() => window.location.reload()}
            />

        );
        
    }

    if (!data) {

        return null;
    }
    
    return (

        <DashboardLayout>

            <DashboardHeader

            financialStatus={
            data.financial_status
            }

            savingsRate={
                data.savings_rate
            }
            
            />

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

                <MetricCard
                    title="Income"
                    value={`₹${data.total_income.toLocaleString()}`}
                    icon={<Wallet />}
                    iconBgClass="bg-emerald-100"
                    iconColorClass="text-emerald-600"
                />

                <MetricCard
                    title="Expenses"
                    value={`₹${data.total_expenses.toLocaleString()}`}
                    icon={<Receipt />}
                    iconBgClass="bg-orange-100"
                    iconColorClass="text-orange-600"
                />

                <MetricCard
                    title="Savings"
                    value={`₹${data.net_savings.toLocaleString()}`}
                    icon={<PiggyBank />}
                    iconBgClass="bg-indigo-100"
                    iconColorClass="text-indigo-600"
                />

                <MetricCard
                    title="Health Score"
                    value={`${data.health_score}%`}
                    icon={<HeartPulse />}
                    iconBgClass="bg-rose-100"
                    iconColorClass="text-rose-600"
                />

            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">

                <BudgetProgress
                    monthlyLimit={data.monthly_limit}
                    remainingBudget={data.remaining_budget}
                    usagePercentage={data.usage_percentage}
                />

                <SavingsRateCard
                    savingsRate={data.savings_rate}
                    financialStatus={data.financial_status}
                />

            </div>

            <div className="mt-8">

                <AIInsightCard
                    message={data.message}
                />

            </div>

        </DashboardLayout>

    );

}