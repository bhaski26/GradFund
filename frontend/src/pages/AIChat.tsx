import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect } from "react";

import AIHeader from "@/components/ai/AIHeader";
import AIChat from "@/components/ai/AIChat";
import AIInput from "@/components/ai/AIInput";

import { useAI } from "@/hooks/useAI";

export default function AI() {
    const {
        messages,
        loading,
        error,
        sendMessage,
        loadInitialAdvice,
        clearChat,
    } = useAI();

    useEffect(() => {
        loadInitialAdvice();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
                <AIHeader onClear={clearChat} />

                <AIChat
                    messages={messages}
                    loading={loading}
                />

                {error && (
                    <div className="border-t bg-red-50 px-6 py-3 text-center text-sm text-red-600">
                        {error}
                    </div>
                )}

                <AIInput
                    onSend={sendMessage}
                    loading={loading}
                />
            </div>
        </DashboardLayout>
    );
}