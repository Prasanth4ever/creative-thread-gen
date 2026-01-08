import { tshirtColors } from "@/data/designOptions";

interface TshirtMockupProps {
  tshirtColor: string;
  designImage: string | null;
  isGenerating: boolean;
}

export function TshirtMockup({ tshirtColor, designImage, isGenerating }: TshirtMockupProps) {
  const colorData = tshirtColors.find((c) => c.value === tshirtColor) || tshirtColors[0];

  // Get color filter for tinting the white base shirt
  const getColorFilter = () => {
    switch (tshirtColor) {
      case "white":
        return "none";
      case "black":
        return "brightness(0.15) saturate(0)";
      case "navy":
        return "brightness(0.3) saturate(1.2) hue-rotate(200deg)";
      case "charcoal":
        return "brightness(0.35) saturate(0)";
      case "maroon":
        return "brightness(0.4) saturate(1.5) hue-rotate(-30deg)";
      default:
        return "none";
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Realistic T-shirt container */}
      <div className="relative aspect-[4/5] w-full">
        {/* T-shirt base shape with realistic form */}
        <svg
          viewBox="0 0 400 500"
          className="w-full h-full"
          style={{ filter: getColorFilter() }}
        >
          <defs>
            {/* Gradient for fabric texture */}
            <linearGradient id="fabricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f8f8f8" />
              <stop offset="100%" stopColor="#f0f0f0" />
            </linearGradient>
            
            {/* Shadow gradient for depth */}
            <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
            </linearGradient>

            {/* Left sleeve shadow */}
            <linearGradient id="leftSleeveShadow" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
            </linearGradient>

            {/* Right sleeve shadow */}
            <linearGradient id="rightSleeveShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
            </linearGradient>
          </defs>

          {/* Main T-shirt body */}
          <path
            d="M80 90 
               L20 150 
               L35 165 
               L70 130
               L70 450 
               C70 465 85 480 100 480
               L300 480 
               C315 480 330 465 330 450
               L330 130
               L365 165
               L380 150
               L320 90
               C320 90 290 70 280 60
               C260 42 240 35 200 35
               C160 35 140 42 120 60
               C110 70 80 90 80 90
               Z"
            fill="url(#fabricGradient)"
          />

          {/* Left sleeve */}
          <path
            d="M80 90 L20 150 L35 165 L70 130 L70 100 C70 95 75 92 80 90 Z"
            fill="url(#leftSleeveShadow)"
          />

          {/* Right sleeve */}
          <path
            d="M320 90 L380 150 L365 165 L330 130 L330 100 C330 95 325 92 320 90 Z"
            fill="url(#rightSleeveShadow)"
          />

          {/* Collar */}
          <path
            d="M120 60 
               C140 42 160 35 200 35
               C240 35 260 42 280 60
               C280 60 260 80 200 80
               C140 80 120 60 120 60
               Z"
            fill="none"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="2"
          />

          {/* Inner collar shadow */}
          <ellipse
            cx="200"
            cy="58"
            rx="55"
            ry="18"
            fill="rgba(0,0,0,0.08)"
          />

          {/* Subtle body contour lines */}
          <path
            d="M100 200 Q95 300 100 400"
            fill="none"
            stroke="rgba(0,0,0,0.03)"
            strokeWidth="3"
          />
          <path
            d="M300 200 Q305 300 300 400"
            fill="none"
            stroke="rgba(0,0,0,0.03)"
            strokeWidth="3"
          />

          {/* Bottom hem shadow */}
          <path
            d="M100 475 C150 482 250 482 300 475"
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="2"
          />
        </svg>

        {/* Colored overlay for the shirt */}
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-90 pointer-events-none"
          style={{ 
            backgroundColor: tshirtColor === "white" ? "transparent" : colorData.hex,
            clipPath: "polygon(20% 18%, 5% 30%, 8.75% 33%, 17.5% 26%, 17.5% 96%, 82.5% 96%, 82.5% 26%, 91.25% 33%, 95% 30%, 80% 18%, 70% 12%, 50% 7%, 30% 12%)"
          }}
        />

        {/* Design area - positioned on chest */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            top: "28%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "45%",
            height: "35%",
          }}
        >
          {isGenerating ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <div 
                  className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-accent rounded-full animate-spin" 
                  style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} 
                />
              </div>
            </div>
          ) : designImage ? (
            <img
              src={designImage}
              alt="T-shirt design"
              className="max-w-full max-h-full object-contain animate-scale-in drop-shadow-lg"
              style={{
                filter: tshirtColor === "white" ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              }}
            />
          ) : (
            <div className={`text-center p-6 rounded-xl border-2 border-dashed transition-colors ${
              tshirtColor === "white" 
                ? "border-gray-300 text-gray-400 bg-gray-50/50" 
                : "border-white/30 text-white/60 bg-white/5"
            }`}>
              <div className="text-3xl mb-2">👕</div>
              <p className="text-sm font-medium">Your design will appear here</p>
            </div>
          )}
        </div>

        {/* Subtle fabric texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Shadow beneath shirt */}
      <div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: colorData.hex === "#ffffff" ? "#000" : colorData.hex }}
      />

      {/* Color label */}
      <div className="text-center mt-6">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground">
          <span 
            className="w-3 h-3 rounded-full border border-border"
            style={{ backgroundColor: colorData.hex }}
          />
          {colorData.label} T-Shirt
        </span>
      </div>
    </div>
  );
}
