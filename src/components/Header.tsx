import { Shirt } from "lucide-react";

export function Header() {
  return (
    <header className="py-6 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
            <Shirt className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold gradient-text">
              T-Shirt Designer
            </h1>
            <p className="text-xs text-muted-foreground">AI-Powered Design Studio</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Ready to create
        </div>
      </div>
    </header>
  );
}
