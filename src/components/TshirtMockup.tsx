import { tshirtColors } from "@/data/designOptions";

interface TshirtMockupProps {
  tshirtColor: string;
  designImage: string | null;
  isGenerating: boolean;
}

export function TshirtMockup({ tshirtColor, designImage, isGenerating }: TshirtMockupProps) {
  const colorData = tshirtColors.find((c) => c.value === tshirtColor) || tshirtColors[0];
  const isLightShirt = tshirtColor === "white";

  return (
    <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
      {/* T-shirt shape */}
      <svg
        viewBox="0 0 300 380"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* T-shirt body */}
        <path
          d="M50 80 L20 140 L50 150 L50 360 L250 360 L250 150 L280 140 L250 80 L200 80 C200 80 190 40 150 40 C110 40 100 80 100 80 L50 80 Z"
          fill={colorData.hex}
          stroke={isLightShirt ? "#e0e0e0" : "#333"}
          strokeWidth="2"
        />
        
        {/* Collar */}
        <path
          d="M100 80 C100 80 110 100 150 100 C190 100 200 80 200 80"
          fill="none"
          stroke={isLightShirt ? "#d0d0d0" : "#444"}
          strokeWidth="2"
        />
        
        {/* Left sleeve shadow */}
        <path
          d="M50 80 L20 140 L50 150 L50 80"
          fill={isLightShirt ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.2)"}
        />
        
        {/* Right sleeve shadow */}
        <path
          d="M250 80 L280 140 L250 150 L250 80"
          fill={isLightShirt ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.2)"}
        />
      </svg>

      {/* Design area */}
      <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[45%] aspect-square flex items-center justify-center">
        {isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-accent rounded-full animate-spin animation-delay-150" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>
        ) : designImage ? (
          <img
            src={designImage}
            alt="T-shirt design"
            className="w-full h-full object-contain animate-scale-in"
          />
        ) : (
          <div className={`text-center p-4 rounded-lg border-2 border-dashed ${
            isLightShirt ? "border-gray-300 text-gray-400" : "border-gray-600 text-gray-500"
          }`}>
            <p className="text-sm font-medium">Your design will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
