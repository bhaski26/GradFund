import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

import type { ChatMessage } from "@/hooks/useAI";

interface AIMessageProps {
    message: ChatMessage;
}

export default function AIMessage({
    message,
}: AIMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={`flex gap-3 ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Bot size={16} />
                </div>
            )}

            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isUser
                        ? "rounded-br-md bg-slate-900 text-white"
                        : "rounded-bl-md bg-slate-100 text-slate-800"
                }`}
            >
                {isUser ? (
                    message.content
                ) : (
                    <div className="prose prose-sm max-w-none prose-slate">
                        <ReactMarkdown>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white text-slate-600">
                    <User size={16} />
                </div>
            )}
        </div>
    );
}