import { useState } from "react";
import { Play, Square, Globe, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConfigPanelProps {
  isRunning: boolean;
  onStart: (config: CrawlerConfig) => void;
  onStop: () => void;
}

export interface CrawlerConfig {
  seedUrl: string;
  maxDepth: number;
  sameDomainOnly: boolean;
}

export function ConfigPanel({ isRunning, onStart, onStop }: ConfigPanelProps) {
  const [seedUrl, setSeedUrl] = useState("");
  const [maxDepth, setMaxDepth] = useState(3);
  const [sameDomainOnly, setSameDomainOnly] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seedUrl.trim()) {
      onStart({ seedUrl: seedUrl.trim(), maxDepth, sameDomainOnly });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold font-mono text-foreground">
          Configuração do Crawler
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seed URL Input */}
        <div className="space-y-2">
          <Label htmlFor="seedUrl" className="text-sm font-mono text-muted-foreground">
            URL Alvo (Seed URL)
          </Label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="seedUrl"
              type="url"
              placeholder="https://exemplo.com"
              value={seedUrl}
              onChange={(e) => setSeedUrl(e.target.value)}
              className="pl-10 h-12 text-base"
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Config Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Max Depth */}
          <div className="space-y-2">
            <Label htmlFor="maxDepth" className="text-sm font-mono text-muted-foreground">
              Profundidade Máxima
            </Label>
            <Input
              id="maxDepth"
              type="number"
              min={1}
              max={10}
              value={maxDepth}
              onChange={(e) => setMaxDepth(parseInt(e.target.value) || 1)}
              className="h-12"
              disabled={isRunning}
            />
          </div>

          {/* Domain Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-mono text-muted-foreground">
              Escopo do Domínio
            </Label>
            <div className="flex items-center justify-between h-12 px-4 bg-muted rounded-md border border-border">
              <span className={`text-sm font-mono ${!sameDomainOnly ? 'text-accent' : 'text-muted-foreground'}`}>
                Incluir Subdomínios
              </span>
              <Switch
                checked={sameDomainOnly}
                onCheckedChange={setSameDomainOnly}
                disabled={isRunning}
              />
              <span className={`text-sm font-mono ${sameDomainOnly ? 'text-primary' : 'text-muted-foreground'}`}>
                Mesmo Domínio
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!isRunning ? (
            <Button
              type="submit"
              variant="cyber"
              size="xl"
              className="w-full"
              disabled={!seedUrl.trim()}
            >
              <Play className="w-5 h-5" />
              INICIAR EXTRAÇÃO
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="xl"
              className="w-full glow-destructive"
              onClick={onStop}
            >
              <Square className="w-5 h-5" />
              PARAR EXTRAÇÃO
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
