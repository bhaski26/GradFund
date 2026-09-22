import { Bot } from "lucide-react";

export default function AILoading() {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Bot size={16} />
            </div>

            <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
                <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    <span
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                        style={{ animationDelay: "120ms" }}
                    />
                    <span
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                        style={{ animationDelay: "240ms" }}
                    />
                </div>
            </div>
        </div>
    );
}