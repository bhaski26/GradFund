import { Bot, Sparkles } from "lucide-react";

interface AIHeaderProps {
    onClear: () => void;
}

export default function AIHeader({
    onClear,
}: AIHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b bg-white px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <Bot size={20} />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-slate-900">
                            GradFund AI
                        </h1>

                        <Sparkles
                            size={16}
                            className="text-slate-500"
                        />
                    </div>

                    <p className="text-sm text-slate-500">
                        Your personal financial coach
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onClear}
                className="rounded-lg border px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            >
                Clear chat
            </button>
        </div>
    );
}