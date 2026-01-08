import { useState } from "react";
import { Header } from "@/components/Header";
import { DesignForm } from "@/components/DesignForm";
import { ExamplePrompts } from "@/components/ExamplePrompts";
import { TshirtMockup } from "@/components/TshirtMockup";
import { GeneratedPrompt } from "@/components/GeneratedPrompt";
import { DesignFormData } from "@/types/design";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const initialFormData: DesignFormData = {
  theme: "motivation",
  mainIdea: "",
  targetAudience: "general youth",
  mood: "bold",
  artStyle: "vector art",
  colorPalette: "black & white",
  typography: "bold sans-serif",
  tshirtColor: "black",
};

export default function Index() {
  const [formData, setFormData] = useState<DesignFormData>(initialFormData);
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleFormChange = (data: Partial<DesignFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleExampleSelect = (data: DesignFormData) => {
    setFormData(data);
    setDesignImage(null);
  };

  const handleGenerate = async () => {
    if (!formData.mainIdea.trim()) {
      toast({
        title: "Missing quote",
        description: "Please enter a main quote or idea for your design.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setDesignImage(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-tshirt-design', {
        body: formData
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to generate design");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.image) {
        setDesignImage(data.image);
        toast({
          title: "Design generated!",
          description: "Your 3D T-shirt design has been created successfully.",
        });
      } else {
        throw new Error("No image was returned");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (designImage) {
      // Create a download link for the base64 image
      const link = document.createElement('a');
      link.href = designImage;
      link.download = `tshirt-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your design is being downloaded.",
      });
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setDesignImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Form */}
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">
                Create Your Design
              </h2>
              <p className="text-muted-foreground">
                AI-powered 3D T-shirt design generation
              </p>
            </div>

            <ExamplePrompts onSelect={handleExampleSelect} />
            
            <div className="p-6 rounded-2xl bg-card border border-border card-shadow">
              <DesignForm
                formData={formData}
                onChange={handleFormChange}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
              
              <GeneratedPrompt formData={formData} />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  Live Preview
                </h2>
                <p className="text-muted-foreground">
                  See your 3D design on the T-shirt
                </p>
              </div>
              
              {designImage && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border card-shadow">
              <TshirtMockup
                tshirtColor={formData.tshirtColor}
                designImage={designImage}
                isGenerating={isGenerating}
              />
            </div>

            {/* Design Tips */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <h3 className="font-semibold text-sm mb-2">💡 Design Tips</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Keep text readable from a distance</li>
                <li>• Use contrasting colors for visibility</li>
                <li>• 3D effects work best with bold typography</li>
                <li>• Consider the T-shirt color when choosing palette</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
