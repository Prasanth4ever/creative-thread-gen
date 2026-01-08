import { DesignFormData } from "@/types/design";
import {
  themes,
  audiences,
  moods,
  artStyles,
  colorPalettes,
  typographyStyles,
  tshirtColors,
  bodySizes,
} from "@/data/designOptions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface DesignFormProps {
  formData: DesignFormData;
  onChange: (data: Partial<DesignFormData>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function DesignForm({
  formData,
  onChange,
  onGenerate,
  isGenerating,
}: DesignFormProps) {
  return (
    <div className="space-y-6">
      {/* Main Idea / Quote */}
      <div className="space-y-2">
        <Label htmlFor="mainIdea" className="text-sm font-medium text-foreground">
          Main Quote or Idea
        </Label>
        <Textarea
          id="mainIdea"
          placeholder="Enter your quote or design concept..."
          value={formData.mainIdea}
          onChange={(e) => onChange({ mainIdea: e.target.value })}
          className="min-h-[80px] bg-secondary border-border focus:border-primary resize-none"
        />
      </div>

      {/* Two column grid for selects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Theme */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Theme</Label>
          <Select
            value={formData.theme}
            onValueChange={(value) => onChange({ theme: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme} value={theme} className="capitalize">
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Target Audience</Label>
          <Select
            value={formData.targetAudience}
            onValueChange={(value) => onChange({ targetAudience: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              {audiences.map((audience) => (
                <SelectItem key={audience} value={audience} className="capitalize">
                  {audience}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mood & Style */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Mood & Style</Label>
          <Select
            value={formData.mood}
            onValueChange={(value) => onChange({ mood: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              {moods.map((mood) => (
                <SelectItem key={mood} value={mood} className="capitalize">
                  {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Art Style */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Art Style</Label>
          <Select
            value={formData.artStyle}
            onValueChange={(value) => onChange({ artStyle: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select art style" />
            </SelectTrigger>
            <SelectContent>
              {artStyles.map((style) => (
                <SelectItem key={style} value={style} className="capitalize">
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Color Palette</Label>
          <Select
            value={formData.colorPalette}
            onValueChange={(value) => onChange({ colorPalette: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select colors" />
            </SelectTrigger>
            <SelectContent>
              {colorPalettes.map((palette) => (
                <SelectItem key={palette} value={palette} className="capitalize">
                  {palette}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Typography */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Typography</Label>
          <Select
            value={formData.typography}
            onValueChange={(value) => onChange({ typography: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select typography" />
            </SelectTrigger>
            <SelectContent>
              {typographyStyles.map((typo) => (
                <SelectItem key={typo} value={typo} className="capitalize">
                  {typo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* T-shirt Color & Body Size Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* T-shirt Color */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">T-Shirt Color</Label>
          <div className="flex gap-3">
            {tshirtColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onChange({ tshirtColor: color.value })}
                className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                  formData.tshirtColor === color.value
                    ? "border-primary scale-110 shadow-lg ring-2 ring-primary/30"
                    : "border-border hover:border-muted-foreground"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Body Size */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Body Size</Label>
          <div className="flex gap-2">
            {bodySizes.map((size) => (
              <button
                key={size.value}
                onClick={() => onChange({ bodySize: size.value })}
                className={`min-w-[44px] h-10 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  formData.bodySize === size.value
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
                }`}
                title={size.description}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        variant="gradient"
        size="xl"
        className="w-full mt-6"
        onClick={onGenerate}
        disabled={isGenerating || !formData.mainIdea.trim()}
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" />
            Generating Design...
          </>
        ) : (
          <>
            <Sparkles />
            Generate Design
          </>
        )}
      </Button>
    </div>
  );
}
