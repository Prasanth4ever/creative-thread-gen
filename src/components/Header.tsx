import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

export function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header className="py-6 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center p-1.5">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary-foreground">
              {/* T-shirt shape */}
              <path 
                d="M20 7L16 3H8L4 7L6 9L8 8V20H16V8L18 9L20 7Z" 
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
              {/* Design brush stroke */}
              <path 
                d="M10 12L14 12M10 15L13 15" 
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Sparkle accent */}
              <circle cx="17" cy="5" r="1" fill="currentColor" className="animate-pulse"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold gradient-text">
              T-Shirt Designer
            </h1>
            <p className="text-xs text-muted-foreground">AI-Powered Design Studio</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={onSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
          {!user && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Ready to create
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
