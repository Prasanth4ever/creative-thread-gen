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

    // Build prompt for a single realistic T-shirt product photograph
    const designPrompt = `Generate ONE single realistic T-shirt product photograph.

CRITICAL RULES - READ CAREFULLY:
- Generate exactly ONE T-shirt as a product photo
- The T-shirt IS the product, NOT a logo or icon
- Do NOT place a T-shirt image inside another T-shirt
- Do NOT create a T-shirt outline with a design inside it
- Do NOT nest, frame, or repeat the T-shirt shape
- NEVER show a T-shirt as a logo, icon, or symbol

PRODUCT PHOTOGRAPHY REQUIREMENTS:
- Photorealistic cotton fabric with visible texture
- Natural folds, wrinkles, and fabric draping
- Visible stitching on collar, sleeves, and hem
- Realistic round neck collar with ribbed texture
- Soft professional studio lighting
- Real e-commerce product photography look
- Front-facing single T-shirt view
- Clean dark or neutral gradient background
- Modern regular fit silhouette
- High resolution output

T-SHIRT COLOR: ${tshirtColor}

PRINTED DESIGN ON THE SHIRT:
The following design must be printed directly on the chest area of this T-shirt:
- Theme: ${theme}
- Main concept/text: "${mainIdea}"
- Target audience: ${targetAudience}
- Mood & style: ${mood}
- Art style: ${artStyle}
- Color palette: ${colorPalette}
- Typography: ${typography}

PRINT REQUIREMENTS:
- Design printed directly on the fabric chest area
- Print follows the natural fabric folds and curves
- Colors slightly muted like real screen-print ink on cotton
- No borders, no background box around the print
- No poster effect or sticker appearance
- Print integrates naturally with the fabric texture

ABSOLUTELY AVOID:
- T-shirt inside T-shirt
- Logo or icon of a T-shirt
- Outline or silhouette of T-shirt as design element
- Nested objects or picture-in-picture
- Mockup template appearance
- Flat vector graphics

OUTPUT: A single standalone T-shirt product photograph, like you would see on an e-commerce website.`;


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
