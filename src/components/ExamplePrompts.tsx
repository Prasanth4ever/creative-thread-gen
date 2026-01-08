import { examplePrompts } from "@/data/designOptions";
import { DesignFormData } from "@/types/design";

interface ExamplePromptsProps {
  onSelect: (data: DesignFormData) => void;
}

export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Quick start with examples:</p>
      <div className="flex flex-wrap gap-2">
        {examplePrompts.map((example) => (
          <button
            key={example.id}
            onClick={() => onSelect(example.data)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-muted border border-border hover:border-primary/50 transition-all duration-200 text-sm font-medium"
          >
            <span>{example.icon}</span>
            <span>{example.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
