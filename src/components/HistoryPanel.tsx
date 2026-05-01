import type { AnalysisResponse } from "@/app/api/analyze/route";
import type { FormData } from "@/app/page";

export interface HistoryItem {
  id: string;
  date: string;
  formData: FormData;
  result: AnalysisResponse;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  language: "id" | "en";
}

export default function HistoryPanel({ history, onView, language }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden w-full h-full">
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-alt/50 border border-border/50 shadow-xl">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-muted relative z-10" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {language === "en" ? "No History Yet" : "Belum Ada Riwayat"}
            </h3>
            <p className="text-base text-muted/80 leading-relaxed">
              {language === "en" ? "You haven't performed any analysis. Return to the Dashboard tab to start your first land analysis." : "Anda belum melakukan analisis apapun. Kembali ke tab Dashboard untuk memulai analisis lahan pertama Anda."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden w-full h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-surface/40 backdrop-blur-md px-8 py-5 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {language === "en" ? "Analysis History" : "Riwayat Analisis"}
            </h2>
            <p className="text-[11px] font-medium text-muted">
              {language === "en" ? "Access saved AI reports" : "Akses laporan AI yang telah tersimpan"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
            {history.length} {language === "en" ? "Reports" : "Laporan"}
          </span>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-0">
        <div className="mx-auto max-w-5xl space-y-5">
          {history.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-border/50 bg-surface/50 p-6 hover:bg-surface/80 hover:border-accent/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => onView(item)}
            >
              {/* Highlight Gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                    {language === "en" ? "Analysis Report" : "Laporan Analisis"} • {item.formData.luasLahan} ha
                  </h3>
                  <span className="rounded-full bg-surface-alt/80 px-2.5 py-1 text-[10px] font-mono text-muted">{item.date}</span>
                </div>
                
                <div className="flex flex-wrap gap-2.5 mt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 text-[11px] font-medium text-muted shadow-sm">
                    {language === "en" ? "Soil" : "Tanah"}: <span className="text-foreground font-bold">{item.formData.kondisiTanah}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 text-[11px] font-medium text-muted shadow-sm">
                    {language === "en" ? "Weather" : "Cuaca"}: <span className="text-foreground font-bold">{item.formData.cuacaDominan}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 text-[11px] font-medium text-muted shadow-sm">
                    {language === "en" ? "Capital" : "Modal"}: <span className="text-foreground font-bold">Rp {item.formData.modalAwal}</span>
                  </span>
                </div>
              </div>
              
              <div className="shrink-0 flex items-center gap-5 w-full sm:w-auto relative z-10 border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-6">
                {item.result.meta && (
                  <div className="hidden sm:block text-right">
                    <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Model</p>
                    <p className="text-[11px] text-foreground font-mono">{item.result.meta.model}</p>
                    <p className="text-[10px] text-accent mt-1">{item.result.data?.recommendations.length || 0} {language === "en" ? "Recommendations" : "Rekomendasi"}</p>
                  </div>
                )}
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-accent text-background transition-all duration-300 px-5 py-2.5 text-sm font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 w-full sm:w-auto">
                  {language === "en" ? "View Details" : "Lihat Detail"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
