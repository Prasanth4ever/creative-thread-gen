import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, mainIdea, targetAudience, mood, artStyle, colorPalette, typography, tshirtColor } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a detailed prompt for standalone design artwork (no t-shirt)
    const designPrompt = `Create a standalone T-shirt print design artwork ONLY - NO T-SHIRT in the image.

CRITICAL - WHAT TO GENERATE:
- Generate ONLY the design/artwork itself
- This is the graphic that will be printed on a t-shirt
- NO t-shirt, NO fabric, NO clothing in the image
- Just the isolated design on a clean transparent or solid background

DESIGN SPECIFICATIONS:
- Theme: ${theme}
- Main concept/text: "${mainIdea}"
- Target audience: ${targetAudience}
- Mood & style: ${mood}
- Art style: ${artStyle}
- Color palette: ${colorPalette}
- Typography: ${typography}

DESIGN REQUIREMENTS:
- Bold, centered composition
- Professional graphic design quality
- Clean edges suitable for printing
- High contrast and readable from a distance
- Balanced layout with strong visual hierarchy
- Typography should be bold and impactful
- Colors optimized for ${tshirtColor} t-shirt background

TECHNICAL SPECS:
- Square or slightly vertical aspect ratio
- Clean background (transparent, white, or solid color)
- High resolution, print-ready quality
- No borders, frames, or mockup elements
- Isolated artwork only

DO NOT include any t-shirt, fabric, clothing, mannequin, or mockup. Generate ONLY the graphic design artwork that would be printed on a shirt.`;


    console.log("Generating T-shirt design with prompt:", designPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: designPrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received successfully");

    // Extract the generated image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content;

    if (!imageUrl) {
      console.error("No image generated in response:", JSON.stringify(data));
      throw new Error("No image was generated. Please try again.");
    }

    return new Response(
      JSON.stringify({ 
        image: imageUrl,
        description: textContent || "T-shirt design generated successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating T-shirt design:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate design" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
