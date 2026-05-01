import type { AnalysisResponse } from "@/app/api/analyze/route";
import type { LogEntry } from "@/app/page";
import { useEffect, useRef } from "react";

interface AIPanelProps {
  isAnalyzing: boolean;
  result: AnalysisResponse | null;
  logs: LogEntry[];
}

const logTypeStyles = {
  info: "text-blue-400",
  success: "text-accent",
  error: "text-red-400",
  processing: "text-amber-400",
};

const logTypeIcons = {
  info: "●",
  success: "✓",
  error: "✗",
  processing: "◌",
};

function ActivityLog({ logs, isAnalyzing }: { logs: LogEntry[]; isAnalyzing: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className="border-t border-border/50 bg-surface-alt/30 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-surface/40">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/>
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-muted">Activity Log</span>
        </div>
        {isAnalyzing && (
          <span className="flex items-center gap-2 bg-amber-400/10 px-2 py-1 rounded-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400">LIVE</span>
          </span>
        )}
      </div>
      <div ref={scrollRef} className="max-h-48 overflow-y-auto px-6 py-4 font-mono text-xs space-y-2 custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDuration: "0.2s" }}>
            <span className="text-muted/50 shrink-0 w-16">{log.timestamp}</span>
            <span className={`shrink-0 mt-0.5 ${logTypeStyles[log.type]}`}>{logTypeIcons[log.type]}</span>
            <span className={`${logTypeStyles[log.type]} break-all font-medium`}>{log.message}</span>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex items-center gap-3 mt-4">
            <span className="text-muted/50 w-16" />
            <span className="text-amber-400 animate-pulse mt-0.5">◌</span>
            <span className="text-amber-400 font-medium">Menunggu respons AI<span className="animate-pulse">...</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

function ScanningAnimation() {
  const lines = [
    "Menginisialisasi AgriSense AI engine...",
    "Memuat database komposisi tanah...",
    "Menganalisis matriks pola iklim...",
    "Mencocokkan model hasil panen...",
    "Mengevaluasi proyeksi keuangan...",
    "Menghasilkan rekomendasi strategis...",
  ];

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="relative rounded-2xl border border-accent/20 bg-accent/5 p-8 overflow-hidden backdrop-blur-sm shadow-[0_0_50px_rgba(34,197,94,0.1)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan shadow-[0_0_10px_#22c55e]" />

          <div className="flex items-center gap-4 mb-8">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-accent animate-pulse" />
              <span className="h-3 w-3 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.3s" }} />
              <span className="h-3 w-3 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.6s" }} />
            </div>
            <span className="text-sm font-mono font-bold tracking-widest text-accent">MEMPROSES DATA</span>
          </div>

          <div className="space-y-4 font-mono text-sm">
            {lines.map((line, i) => (
              <div key={i} className="flex items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 0.4}s` }}>
                <span className="text-accent">▸</span>
                <span className="text-foreground/80">{line}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 h-2 rounded-full bg-surface-alt/50 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent/40 via-accent to-accent/40 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <div className="absolute inset-0 bg-accent/10 blur-xl rounded-full animate-pulse" />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" className="relative z-10">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Siap Menganalisis</h3>
        <p className="text-base text-muted/80 leading-relaxed">
          Pilih parameter pada panel di sebelah kiri, kemudian klik <br/> <span className="font-bold text-accent inline-flex items-center gap-1 mt-2 bg-accent/10 px-2 py-0.5 rounded-md">Analyze Strategy</span> <br/> untuk mendapatkan rekomendasi AI.
        </p>
      </div>
    </div>
  );
}

const priorityStyles = {
  high: "bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
  low: "bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
};

const priorityLabels = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

function ResultView({ result }: { result: AnalysisResponse }) {
  if (!result.success || !result.data) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 max-w-md text-center backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-base text-red-400 font-bold">{result.error || "Analisis gagal."}</p>
        </div>
      </div>
    );
  }

  const { data, meta } = result;

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <span className="text-sm font-mono font-bold text-accent uppercase tracking-widest">Analisis Selesai</span>
        </div>
        
        {/* AI Source Badge */}
        {meta && (
          <div className="rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 to-transparent px-4 py-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-accent uppercase tracking-wider">Dihasilkan oleh Groq AI</p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-muted">
                <span>⏱️ {meta.responseTimeMs}ms</span>
                <span>•</span>
                <span>🎯 {meta.tokensUsed} tokens</span>
                <span>•</span>
                <span>🤖 {meta.model}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-border/60 bg-surface/50 backdrop-blur-md p-6 shadow-lg animate-fade-in-up stagger-1 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-blue-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Ringkasan Eksekutif
        </h3>
        <p className="text-base leading-relaxed text-foreground/90 font-medium">{data.summary}</p>
      </div>

      {/* Recommendations */}
      <div className="animate-fade-in-up stagger-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Rekomendasi Strategis
        </h3>
        <div className="grid gap-4">
          {data.recommendations.map((rec, i) => (
            <div key={i} className="group rounded-2xl border border-border/60 bg-surface/40 backdrop-blur-sm p-6 hover:border-accent/40 hover:bg-surface/80 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h4 className="text-base font-bold text-foreground group-hover:text-accent transition-colors">{rec.title}</h4>
                <span className={`shrink-0 rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${priorityStyles[rec.priority]}`}>
                  {priorityLabels[rec.priority]}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted group-hover:text-foreground/80 transition-colors">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROI & Risk Grid */}
      <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up stagger-3">
        <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent backdrop-blur-md p-6 shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            Estimasi ROI
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90 font-medium">{data.estimatedROI}</p>
        </div>
        <div className="rounded-2xl border border-warning/20 bg-gradient-to-br from-warning/5 to-transparent backdrop-blur-md p-6 shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-widest text-warning mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            Penilaian Risiko
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90 font-medium">{data.riskAssessment}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-info/20 bg-gradient-to-br from-info/5 to-transparent backdrop-blur-md p-6 shadow-lg animate-fade-in-up stagger-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-info mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Timeline Implementasi
        </h3>
        <p className="text-sm leading-relaxed text-foreground/90 font-medium">{data.timeline}</p>
      </div>
    </div>
  );
}

export default function AIPanel({ isAnalyzing, result, logs }: AIPanelProps) {
  return (
    <section className="flex flex-1 flex-col overflow-hidden w-full h-full" id="ai-panel">
      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col">
          {isAnalyzing ? <ScanningAnimation /> : result ? <ResultView result={result} /> : <EmptyState />}
        </div>
        
        {/* Activity Log - always visible when there are logs */}
        <ActivityLog logs={logs} isAnalyzing={isAnalyzing} />
      </div>
    </section>
  );
}
