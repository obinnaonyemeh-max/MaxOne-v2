import { Megaphone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { resolveCallScript } from "@/data/callScriptTemplates"

interface CallScriptRendererProps {
  subcategoryId: string
  categoryId: string
  answers: Record<string, string>
  onAnswerChange: (questionId: string, value: string) => void
}

export function CallScriptRenderer({
  subcategoryId,
  categoryId,
  answers,
  onAnswerChange,
}: CallScriptRendererProps) {
  const template = resolveCallScript(subcategoryId, categoryId)

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-status-danger" />
        <h3
          className="font-semibold text-sidebar-item-active uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.4px" }}
        >
          Incident Call Script
        </h3>
      </div>

      <div className="mt-4 space-y-3">
        {template.questions.map((q) => (
          <div
            key={q.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start gap-2 mb-3">
              <Megaphone className="h-4 w-4 text-breadcrumb-root shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-sidebar-item-active">
                {q.question}
                {q.required && (
                  <span className="text-status-danger ml-0.5">*</span>
                )}
              </span>
            </div>

            {q.fieldType === "radio" && q.options ? (
              <RadioGroup
                value={answers[q.id] ?? ""}
                onValueChange={(value) => onAnswerChange(q.id, value)}
                className="flex flex-row flex-wrap gap-4 ml-6"
              >
                {q.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <RadioGroupItem value={option} />
                    <span className="text-sm font-medium text-sidebar-item-active">
                      {option}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            ) : (
              <div className="ml-6">
                <Input
                  value={answers[q.id] ?? ""}
                  onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="h-9 bg-[#F8F8F8]"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
