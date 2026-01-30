import { useState, useCallback, useRef } from "react";
import { LogEntry } from "@/components/LogPanel";
import { UrlResult } from "@/components/ResultsTable";
import { CrawlerConfig } from "@/components/ConfigPanel";

interface CrawlerState {
  isConnected: boolean;
  isRunning: boolean;
  logs: LogEntry[];
  results: UrlResult[];
  queueCount: number;
  processedCount: number;
  errorCount: number;
}

export function useCrawler() {
  const [state, setState] = useState<CrawlerState>({
    isConnected: false, // Will be true when connected to backend
    isRunning: false,
    logs: [],
    results: [],
    queueCount: 0,
    processedCount: 0,
    errorCount: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback(
    (type: LogEntry["type"], message: string) => {
      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type,
        message,
      };
      setState((prev) => ({
        ...prev,
        logs: [...prev.logs, newLog],
      }));
    },
    []
  );

  const clearLogs = useCallback(() => {
    setState((prev) => ({
      ...prev,
      logs: [],
    }));
  }, []);

  // Simulation for demo purposes - replace with actual WebSocket/API calls
  const simulateCrawl = useCallback(
    (config: CrawlerConfig) => {
      const sampleUrls = [
        "/about",
        "/contact",
        "/products",
        "/blog",
        "/blog/post-1",
        "/blog/post-2",
        "/services",
        "/pricing",
        "/faq",
        "/terms",
        "/privacy",
        "/careers",
        "/team",
        "/docs",
        "/api",
      ];

      let index = 0;
      let queue = 15;
      let processed = 0;
      let errors = 0;

      addLog("info", `Iniciando crawl em ${config.seedUrl}`);
      addLog("info", `Profundidade máxima: ${config.maxDepth}`);
      addLog(
        "info",
        `Modo: ${config.sameDomainOnly ? "Mesmo domínio apenas" : "Incluindo subdomínios"}`
      );

      simulationRef.current = setInterval(() => {
        if (index >= sampleUrls.length) {
          addLog("success", "Extração concluída!");
          setState((prev) => ({
            ...prev,
            isRunning: false,
            queueCount: 0,
          }));
          if (simulationRef.current) {
            clearInterval(simulationRef.current);
          }
          return;
        }

        const urlPath = sampleUrls[index];
        const fullUrl = new URL(urlPath, config.seedUrl).href;
        const statusCodes = [200, 200, 200, 200, 301, 404, 500];
        const statusCode =
          statusCodes[Math.floor(Math.random() * statusCodes.length)];
        const isError = statusCode >= 400;

        if (isError) {
          errors++;
          addLog("error", `Erro ${statusCode}: ${fullUrl}`);
        } else {
          addLog("success", `Encontrado: ${fullUrl} [${statusCode}]`);
        }

        const newResult: UrlResult = {
          id: crypto.randomUUID(),
          url: fullUrl,
          statusCode,
          parentUrl: index === 0 ? config.seedUrl : sampleUrls[Math.max(0, index - 1)],
          depth: Math.min(Math.floor(index / 4) + 1, config.maxDepth),
          timestamp: new Date(),
        };

        queue = Math.max(0, queue - 1 + Math.floor(Math.random() * 2));
        processed++;
        index++;

        setState((prev) => ({
          ...prev,
          results: [...prev.results, newResult],
          queueCount: queue,
          processedCount: processed,
          errorCount: errors,
        }));
      }, 800);
    },
    [addLog]
  );

  const startCrawl = useCallback(
    (config: CrawlerConfig) => {
      setState((prev) => ({
        ...prev,
        isRunning: true,
        results: [],
        queueCount: 0,
        processedCount: 0,
        errorCount: 0,
      }));

      // TODO: Replace with actual WebSocket/API connection
      // For now, simulate crawling
      simulateCrawl(config);
    },
    [simulateCrawl]
  );

  const stopCrawl = useCallback(() => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    addLog("warning", "Extração interrompida pelo usuário");
    setState((prev) => ({
      ...prev,
      isRunning: false,
    }));
  }, [addLog]);

  // TODO: Implement actual WebSocket connection
  // const connectWebSocket = useCallback((url: string) => {
  //   wsRef.current = new WebSocket(url);
  //   wsRef.current.onopen = () => {
  //     setState(prev => ({ ...prev, isConnected: true }));
  //     addLog('success', 'Conectado ao backend');
  //   };
  //   wsRef.current.onclose = () => {
  //     setState(prev => ({ ...prev, isConnected: false }));
  //     addLog('error', 'Desconectado do backend');
  //   };
  //   wsRef.current.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     // Handle incoming messages
  //   };
  // }, [addLog]);

  return {
    ...state,
    startCrawl,
    stopCrawl,
    clearLogs,
    addLog,
  };
}
