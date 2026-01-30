import { ExternalLink, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface UrlResult {
  id: string;
  url: string;
  statusCode: number | null;
  parentUrl: string;
  depth: number;
  timestamp: Date;
}

interface ResultsTableProps {
  results: UrlResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getStatusColor = (status: number | null) => {
    if (status === null) return "text-muted-foreground bg-muted";
    if (status >= 200 && status < 300) return "text-primary bg-primary/10 border-primary/30";
    if (status >= 300 && status < 400) return "text-accent bg-accent/10 border-accent/30";
    if (status >= 400 && status < 500) return "text-warning bg-warning/10 border-warning/30";
    return "text-destructive bg-destructive/10 border-destructive/30";
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-card border border-border rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold font-mono text-foreground">
            URLs Extraídas
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            ({results.length} encontradas)
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        {results.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-sm">
            Nenhuma URL extraída ainda
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-mono text-xs text-muted-foreground w-20">
                  STATUS
                </TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">
                  URL
                </TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">
                  PARENT URL
                </TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground w-20 text-center">
                  DEPTH
                </TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground w-20">
                  AÇÕES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  className="border-border hover:bg-muted/50 animate-fade-in"
                >
                  <TableCell>
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${getStatusColor(
                        result.statusCode
                      )}`}
                    >
                      {result.statusCode ?? "---"}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground" title={result.url}>
                        {truncateUrl(result.url)}
                      </span>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {truncateUrl(result.parentUrl, 40)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-muted text-xs font-mono text-muted-foreground">
                      {result.depth}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(result.url, result.id)}
                    >
                      {copiedId === result.id ? (
                        <Check className="w-3 h-3 text-primary" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
