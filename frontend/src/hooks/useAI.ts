import { useState } from "react";

import {
    askAI,
    getAIAdvice,
} from "@/services/ai";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export function useAI() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function sendMessage(question: string) {
        if (!question.trim() || loading) {
            return;
        }

        const trimmedQuestion = question.trim();

        const userMessage: ChatMessage = {
            role: "user",
            content: trimmedQuestion,
        };

        setMessages((previous) => [
            ...previous,
            userMessage,
        ]);

        setLoading(true);
        setError("");

        try {
            const response = await askAI(trimmedQuestion);

            const assistantMessage: ChatMessage = {
                role: "assistant",
                content: response.answer,
            };

            setMessages((previous) => [
                ...previous,
                assistantMessage,
            ]);
        } catch (err: any) {
            setError(
                err.response?.data?.detail ??
                "Unable to reach GradFund AI."
            );
        } finally {
            setLoading(false);
        }
    }

    async function loadInitialAdvice() {
        if (loading) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await getAIAdvice();

            setMessages([
                {
                    role: "assistant",
                    content: response.answer,
                },
            ]);
        } catch (err: any) {
            setError(
                err.response?.data?.detail ??
                "Unable to load your financial insight."
            );
        } finally {
            setLoading(false);
        }
    }

    function clearChat() {
        setMessages([]);
        setError("");
    }

    return {
        messages,
        loading,
        error,
        sendMessage,
        loadInitialAdvice,
        clearChat,
    };
}