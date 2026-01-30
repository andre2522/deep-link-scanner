import { Header } from "@/components/Header";
import { ConfigPanel } from "@/components/ConfigPanel";
import { LogPanel } from "@/components/LogPanel";
import { ResultsTable } from "@/components/ResultsTable";
import { Footer } from "@/components/Footer";
import { useCrawler } from "@/hooks/useCrawler";

const Index = () => {
  const {
    isConnected,
    isRunning,
    logs,
    results,
    queueCount,
    processedCount,
    errorCount,
    startCrawl,
    stopCrawl,
    clearLogs,
  } = useCrawler();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isConnected={isConnected} />

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Configuration Panel */}
        <ConfigPanel
          isRunning={isRunning}
          onStart={startCrawl}
          onStop={stopCrawl}
        />

        {/* Split View: Logs & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
          <LogPanel logs={logs} onClear={clearLogs} />
          <ResultsTable results={results} />
        </div>
      </main>

      <Footer
        queueCount={queueCount}
        processedCount={processedCount}
        errorCount={errorCount}
        results={results}
        isRunning={isRunning}
      />
    </div>
  );
};

export default Index;
