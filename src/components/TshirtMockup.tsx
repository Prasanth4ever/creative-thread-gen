import { tshirtColors, bodySizes } from "@/data/designOptions";

interface TshirtMockupProps {
  tshirtColor: string;
  designImage: string | null;
  isGenerating: boolean;
  bodySize?: string;
}

export function TshirtMockup({ tshirtColor, designImage, isGenerating, bodySize = "L" }: TshirtMockupProps) {
  const colorData = tshirtColors.find((c) => c.value === tshirtColor) || tshirtColors[0];
  const sizeData = bodySizes.find((s) => s.value === bodySize) || bodySizes[2];
  
  const isLightShirt = tshirtColor === "white";

  // If we have a generated image, show it directly as the full product photo
  if (designImage && !isGenerating) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full max-w-md flex items-center justify-center">
          <img
            src={designImage}
            alt="Generated T-shirt product"
            className="w-full h-auto max-h-[420px] object-contain rounded-lg animate-scale-in"
            style={{
              filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.35))"
            }}
          />
        </div>
        
        {/* Info badges */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground border border-border">
            <span 
              className="w-3 h-3 rounded-full border border-border/50"
              style={{ backgroundColor: colorData.hex }}
            />
            {colorData.label}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground border border-border">
            <span className="font-semibold text-foreground">{sizeData.label}</span>
            <span className="text-xs">({sizeData.description})</span>
          </span>
        </div>
      </div>
    );
  }

  // Show placeholder or loading state with SVG mockup
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div 
        className="relative transition-all duration-300 flex items-center justify-center"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "320px",
        }}
      >
        <svg
          viewBox="0 0 400 480"
          className="w-full h-auto max-h-[350px]"
          style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.25))" }}
        >
          <defs>
            <linearGradient id="bodyShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.08)" />
              <stop offset="20%" stopColor="rgba(0,0,0,0)" />
              <stop offset="80%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
            </linearGradient>

            <linearGradient id="leftSleeveGrad" x1="100%" y1="0%" x2="0%" y2="50%">
              <stop offset="0%" stopColor={colorData.hex} />
              <stop offset="100%" stopColor={isLightShirt ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.15)"} />
            </linearGradient>

            <linearGradient id="rightSleeveGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor={colorData.hex} />
              <stop offset="100%" stopColor={isLightShirt ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.15)"} />
            </linearGradient>

            <radialGradient id="collarShadow" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.2)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Left Sleeve */}
          <path
            d="M55 95 L5 160 C5 160 10 175 30 180 L75 135 L75 95 C65 90 55 95 55 95 Z"
            fill={colorData.hex}
          />
          <path
            d="M55 95 L5 160 C5 160 10 175 30 180 L75 135 L75 95 C65 90 55 95 55 95 Z"
            fill="url(#leftSleeveGrad)"
          />

          {/* Right Sleeve */}
          <path
            d="M345 95 L395 160 C395 160 390 175 370 180 L325 135 L325 95 C335 90 345 95 345 95 Z"
            fill={colorData.hex}
          />
          <path
            d="M345 95 L395 160 C395 160 390 175 370 180 L325 135 L325 95 C335 90 345 95 345 95 Z"
            fill="url(#rightSleeveGrad)"
          />

          {/* Main Body */}
          <path
            d="M75 95 L75 450 C75 460 85 470 100 470 L300 470 C315 470 325 460 325 450 L325 95 C325 95 290 75 200 75 C110 75 75 95 75 95 Z"
            fill={colorData.hex}
          />
          <path
            d="M75 95 L75 450 C75 460 85 470 100 470 L300 470 C315 470 325 460 325 450 L325 95 C325 95 290 75 200 75 C110 75 75 95 75 95 Z"
            fill="url(#bodyShade)"
          />

          {/* Shoulder seams */}
          <path
            d="M75 95 C110 75 150 70 200 70 C250 70 290 75 325 95"
            fill="none"
            stroke={isLightShirt ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
            strokeWidth="1.5"
          />

          {/* Round Neck Collar */}
          <ellipse cx="200" cy="78" rx="50" ry="22" fill={colorData.hex} />
          <ellipse cx="200" cy="80" rx="38" ry="16" fill={isLightShirt ? "#f0f0f0" : "#0a0a0a"} />
          <ellipse cx="200" cy="82" rx="36" ry="14" fill="url(#collarShadow)" />
          <ellipse
            cx="200" cy="78" rx="50" ry="22"
            fill="none"
            stroke={isLightShirt ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"}
            strokeWidth="3"
          />

          {/* Bottom hem */}
          <path
            d="M100 465 C150 472 250 472 300 465"
            fill="none"
            stroke={isLightShirt ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)"}
            strokeWidth="2"
          />
        </svg>

        {/* Design placement area - loading or placeholder */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            top: "26%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50%",
            height: "38%",
          }}
        >
          {isGenerating ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <div 
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-accent rounded-full animate-spin" 
                  style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} 
                />
              </div>
            </div>
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isLightShirt 
                ? "border-gray-300/60 text-gray-400" 
                : "border-white/20 text-white/40"
            }`}>
              <div className="text-4xl mb-2 opacity-60">✨</div>
              <p className="text-xs font-medium text-center px-4">Your design<br/>will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Info badges */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground border border-border">
          <span 
            className="w-3 h-3 rounded-full border border-border/50"
            style={{ backgroundColor: colorData.hex }}
          />
          {colorData.label}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground border border-border">
          <span className="font-semibold text-foreground">{sizeData.label}</span>
          <span className="text-xs">({sizeData.description})</span>
        </span>
      </div>
    </div>
  );
}
