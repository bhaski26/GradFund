import api from "./api";

export interface AIResponse {
    answer: string;
}

export interface AIQuestion {
    question: string;
}

export async function askAI(
    question: string
): Promise<AIResponse> {
    const response = await api.post<AIResponse>(
        "/ai/chat",
        { question }
    );

    return response.data;
}

export async function getAIAdvice(): Promise<AIResponse> {
    const response = await api.get<AIResponse>(
        "/ai/advice"
    );

    return response.data;
}