import { DesignFormData } from "@/types/design";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GeneratedPromptProps {
  formData: DesignFormData;
}

export function GeneratedPrompt({ formData }: GeneratedPromptProps) {
  const [copied, setCopied] = useState(false);

  const generatePromptText = () => {
    return `Create a high-quality T-shirt design.
Theme: ${formData.theme}
Main quote: "${formData.mainIdea}"
Target audience: ${formData.targetAudience}
Style: ${formData.mood}
Art style: ${formData.artStyle}
Colors: ${formData.colorPalette}
Typography: ${formData.typography}
Centered layout, transparent background, print-ready, no mockups.
Design should look good on ${formData.tshirtColor} T-shirts.`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatePromptText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!formData.mainIdea.trim()) return null;

  return (
    <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">Generated Prompt</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed">
        {generatePromptText()}
      </pre>
    </div>
  );
}
