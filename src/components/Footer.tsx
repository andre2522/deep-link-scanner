import { Download, FileJson, FileSpreadsheet, Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UrlResult } from "./ResultsTable";

interface FooterProps {
  queueCount: number;
  processedCount: number;
  errorCount: number;
  results: UrlResult[];
  isRunning: boolean;
}

export function Footer({
  queueCount,
  processedCount,
  errorCount,
  results,
  isRunning,
}: FooterProps) {
  const exportAsCSV = () => {
    if (results.length === 0) return;

    const headers = ["URL", "Status Code", "Parent URL", "Depth", "Timestamp"];
    const rows = results.map((r) => [
      r.url,
      r.statusCode?.toString() ?? "",
      r.parentUrl,
      r.depth.toString(),
      r.timestamp.toISOString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    downloadFile(csvContent, "spider-crawler-results.csv", "text/csv");
  };

  const exportAsJSON = () => {
    if (results.length === 0) return;

    const jsonContent = JSON.stringify(
      results.map((r) => ({
        url: r.url,
        statusCode: r.statusCode,
        parentUrl: r.parentUrl,
        depth: r.depth,
        timestamp: r.timestamp.toISOString(),
      })),
      null,
      2
    );

    downloadFile(jsonContent, "spider-crawler-results.json", "application/json");
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Stats */}
          <div className="flex items-center gap-6">
            {/* Queue */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-accent/10 rounded border border-accent/30">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono">Na Fila</p>
                <p className="text-lg font-bold font-mono text-accent">
                  {queueCount}
                </p>
              </div>
            </div>

            {/* Processed */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded border border-primary/30">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono">Processadas</p>
                <p className="text-lg font-bold font-mono text-primary">
                  {processedCount}
                </p>
              </div>
            </div>

            {/* Errors */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-destructive/10 rounded border border-destructive/30">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono">Erros</p>
                <p className="text-lg font-bold font-mono text-destructive">
                  {errorCount}
                </p>
              </div>
            </div>

            {/* Running Indicator */}
            {isRunning && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded border border-primary/30">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs font-mono text-primary">CRAWLING...</span>
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="terminal"
              size="sm"
              onClick={exportAsCSV}
              disabled={results.length === 0}
              className="gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span> CSV
            </Button>
            <Button
              variant="terminal"
              size="sm"
              onClick={exportAsJSON}
              disabled={results.length === 0}
              className="gap-2"
            >
              <FileJson className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span> JSON
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
