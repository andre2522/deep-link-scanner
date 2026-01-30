import { Bug, Wifi, WifiOff } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
}

export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/30">
            <Bug className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-glow text-primary tracking-tight">
              SPIDER CRAWLER
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Deep URL Extractor v1.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border border-border">
            {isConnected ? (
              <>
                <div className="status-dot status-dot-connected" />
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-primary">ONLINE</span>
              </>
            ) : (
              <>
                <div className="status-dot status-dot-disconnected" />
                <WifiOff className="w-4 h-4 text-destructive" />
                <span className="text-xs font-mono text-destructive">OFFLINE</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
