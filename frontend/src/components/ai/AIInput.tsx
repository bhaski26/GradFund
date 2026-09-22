import {
    FormEvent,
    useState,
} from "react";

import {
    Send,
} from "lucide-react";

interface AIInputProps {
    onSend: (question: string) => Promise<void>;
    loading: boolean;
}

export default function AIInput({
    onSend,
    loading,
}: AIInputProps) {
    const [question, setQuestion] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!question.trim() || loading) {
            return;
        }

        const currentQuestion = question;

        setQuestion("");

        await onSend(currentQuestion);
    }

    return (
        <div className="border-t bg-white px-6 py-4">
            <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-4xl items-end gap-3"
            >
                <textarea
                    value={question}
                    onChange={(event) =>
                        setQuestion(event.target.value)
                    }
                    onKeyDown={(event) => {
                        if (
                            event.key === "Enter" &&
                            !event.shiftKey
                        ) {
                            event.preventDefault();

                            if (!loading) {
                                event.currentTarget.form?.requestSubmit();
                            }
                        }
                    }}
                    placeholder="Ask about your finances..."
                    rows={1}
                    disabled={loading}
                    className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                />

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !question.trim()
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Send size={18} />
                </button>
            </form>

            <p className="mx-auto mt-2 max-w-4xl text-xs text-slate-400">
                Press Enter to send · Shift + Enter for a new line
            </p>
        </div>
    );
}