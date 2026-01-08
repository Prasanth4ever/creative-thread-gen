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

    // Build a detailed prompt for 3D T-shirt design generation
    const designPrompt = `Create a high-quality, professional T-shirt design with 3D visual elements and depth.

DESIGN SPECIFICATIONS:
- Theme: ${theme}
- Main text/concept: "${mainIdea}"
- Target audience: ${targetAudience}
- Mood & style: ${mood}
- Art style: ${artStyle} with 3D effects, depth, and dimensionality
- Color palette: ${colorPalette}
- Typography: ${typography} style with 3D embossed or raised effect

TECHNICAL REQUIREMENTS:
- Create a centered, print-ready design
- Add 3D depth, shadows, and dimensional effects to make elements pop
- Use clean vector-style artwork with professional 3D rendering
- Design should look striking on a ${tshirtColor} T-shirt
- Include subtle gradients and lighting to enhance the 3D effect
- Make text appear raised or embossed with realistic shadows
- No background - transparent/isolated design only
- Visually striking and trendy design
- Keep it readable from a distance
- Ultra high resolution, print-ready quality

The design should have depth and dimension, looking like it could leap off the shirt. Use professional 3D rendering techniques like drop shadows, highlights, bevels, and perspective to create a premium look.`;

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
