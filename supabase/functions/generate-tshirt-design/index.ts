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

    // Build a detailed prompt for realistic photographed T-shirt product image
    const designPrompt = `Generate a highly realistic T-shirt product photograph, NOT a flat mockup or illustration.

PRODUCT PHOTOGRAPHY REQUIREMENTS:
- Real photographed cotton fabric with natural folds, wrinkles, and fabric texture
- Visible stitching details on collar, sleeves, and hem
- Realistic round neck collar shape with ribbed texture
- Soft cotton fabric with matte finish appearance
- Natural fabric creases and draping
- Studio product photography lighting with soft shadows
- Clean dark or neutral gradient background
- Camera angle: straight front view with slight 3D perspective
- Professional e-commerce product photo quality
- High resolution with realistic shadows and highlights

T-SHIRT SPECIFICATIONS:
- T-shirt color: ${tshirtColor}
- Fit: modern regular fit
- Style: classic crew neck

PRINTED DESIGN ON SHIRT:
- Theme: ${theme}
- Main concept/text: "${mainIdea}"
- Target audience: ${targetAudience}
- Mood & style: ${mood}
- Art style: ${artStyle}
- Color palette: ${colorPalette}
- Typography: ${typography}

CRITICAL PRINT RULES:
- Design must be printed directly on the fabric using realistic screen-print/DTG printing style
- Print should slightly blend with the fabric texture
- Print should follow and curve naturally with the fabric folds
- Colors should be slightly muted to match real ink on fabric
- NO poster-like or sticker-like appearance
- NO sharp rectangular edges around the design
- NO floating poster effect
- NO flat vector mockup look
- Design should look like it was actually printed on real cotton

DESIGN PLACEMENT:
- Bold, centered on the chest area
- Well balanced and clearly readable
- Typography looks professionally screen-printed
- Design integrates naturally with the shirt fabric

Generate a photorealistic product image that looks like an actual e-commerce product photo taken in a professional studio.`;

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
