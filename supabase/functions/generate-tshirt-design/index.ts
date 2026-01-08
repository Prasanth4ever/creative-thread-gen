import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please sign in to generate designs' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Invalid token:", claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid token - Please sign in again' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const { theme, mainIdea, targetAudience, mood, artStyle, colorPalette, typography, tshirtColor } = await req.json();

    // Valid dropdown values (must match frontend options)
    const validThemes = ['motivation', 'anime', 'streetwear', 'sarcasm', 'fitness', 'gaming', 'minimalist', 'vintage', 'tech', 'nature'];
    const validAudiences = ['college students', 'gym lovers', 'programmers', 'general youth', 'gamers', 'artists', 'entrepreneurs'];
    const validMoods = ['minimalist', 'bold', 'aesthetic', 'funny', 'dark', 'vintage', 'playful', 'edgy'];
    const validArtStyles = ['flat illustration', 'line art', 'vector art', 'cartoon', 'cyberpunk', 'retro', 'abstract'];
    const validColorPalettes = ['black & white', 'pastel', 'neon', 'monochrome', 'earth tones', 'black, white, red', 'white and yellow', 'blue gradient'];
    const validTypography = ['handwritten', 'graffiti', 'bold sans-serif', 'retro font', 'rounded playful', 'modern minimal', 'gothic'];
    const validTshirtColors = ['black', 'white', 'navy', 'charcoal', 'maroon'];

    // Validate mainIdea
    if (!mainIdea || typeof mainIdea !== 'string' || mainIdea.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Main idea is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mainIdea.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Main idea is too long (max 500 characters)' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate dropdown fields against allowlists
    if (theme && !validThemes.includes(theme)) {
      console.warn("Invalid theme value received:", theme);
      return new Response(
        JSON.stringify({ error: 'Invalid theme selected' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (targetAudience && !validAudiences.includes(targetAudience)) {
      console.warn("Invalid audience value received:", targetAudience);
      return new Response(
        JSON.stringify({ error: 'Invalid target audience selected' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mood && !validMoods.includes(mood)) {
      console.warn("Invalid mood value received:", mood);
      return new Response(
        JSON.stringify({ error: 'Invalid mood selected' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (artStyle && !validArtStyles.includes(artStyle)) {
      console.warn("Invalid art style value received:", artStyle);
      return new Response(
        JSON.stringify({ error: 'Invalid art style selected' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (colorPalette && !validColorPalettes.includes(colorPalette)) {
      console.warn("Invalid color palette value received:", colorPalette);
      return new Response(
        JSON.stringify({ error: 'Invalid color palette selected' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typography && !validTypography.includes(typography)) {
      console.warn("Invalid typography value received:", typography);
      return new Response(
        JSON.stringify({ error: 'Invalid typography selected' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (tshirtColor && !validTshirtColors.includes(tshirtColor)) {
      console.warn("Invalid t-shirt color value received:", tshirtColor);
      return new Response(
        JSON.stringify({ error: 'Invalid t-shirt color selected' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("Configuration error");
    }

    // Enhanced sanitization for prompt construction
    const sanitize = (str: string | undefined) => 
      (str || '')
        .replace(/[<>"'`\\]/g, '')
        .replace(/[\r\n]+/g, ' ')
        .trim()
        .slice(0, 100);

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

T-SHIRT COLOR: ${sanitize(tshirtColor)}

PRINTED DESIGN ON THE SHIRT:
The following design must be printed directly on the chest area of this T-shirt:
- Theme: ${sanitize(theme)}
- Main concept/text: "${sanitize(mainIdea)}"
- Target audience: ${sanitize(targetAudience)}
- Mood & style: ${sanitize(mood)}
- Art style: ${sanitize(artStyle)}
- Color palette: ${sanitize(colorPalette)}
- Typography: ${sanitize(typography)}

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


    console.log("Generating T-shirt design for user:", userId);

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
    console.log("AI response received successfully for user:", userId);

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
    console.error("[Internal] Error generating T-shirt design:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Unable to generate design. Please try again.' 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
