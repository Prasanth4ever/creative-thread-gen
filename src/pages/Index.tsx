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
    
    // Simulate AI generation with a placeholder
    // In production, this would call an AI image generation API
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    // Using a generated design placeholder
    // This represents where the AI-generated design would appear
    const placeholderDesigns = [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop",
    ];
    
    setDesignImage(placeholderDesigns[Math.floor(Math.random() * placeholderDesigns.length)]);
    setIsGenerating(false);
    
    toast({
      title: "Design generated!",
      description: "Your T-shirt design has been created successfully.",
    });
  };

  const handleDownload = () => {
    if (designImage) {
      toast({
        title: "Download started",
        description: "Your design is being prepared for download.",
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
                Customize every aspect of your T-shirt design
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
                  See your design on the T-shirt
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
                <li>• Simple designs often have more impact</li>
                <li>• Consider the T-shirt color when choosing palette</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
