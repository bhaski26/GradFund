import { useEffect, useRef } from "react";

import type { ChatMessage } from "@/hooks/useAI";

import AIMessage from "./AIMessage";
import AILoading from "./AILoading";

interface AIChatProps {
    messages: ChatMessage[];
    loading: boolean;
}

export default function AIChat({
    messages,
    loading,
}: AIChatProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    return (
        <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto flex max-w-4xl flex-col gap-5">
                {messages.length === 0 && !loading && (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="max-w-md text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                <span className="text-xl">
                                    ✦
                                </span>
                            </div>

                            <h2 className="text-xl font-semibold text-slate-900">
                                Ask GradFund AI
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Get personalized insights about your
                                spending, savings, budget, and overall
                                financial habits.
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <AIMessage
                        key={`${message.role}-${index}`}
                        message={message}
                    />
                ))}

                {loading && <AILoading />}

                <div ref={bottomRef} />
            </div>
        </div>
    );
}