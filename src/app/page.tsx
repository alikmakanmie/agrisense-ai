"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import AIPanel from "@/components/AIPanel";
import HistoryPanel, { HistoryItem } from "@/components/HistoryPanel";
import type { AnalysisResponse } from "@/app/api/analyze/route";

export interface FormData {
  luasLahan: string;
  modalAwal: string;
  kondisiTanah: string;
  cuacaDominan: string;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error" | "processing";
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    luasLahan: "",
    modalAwal: "",
    kondisiTanah: "",
    cuacaDominan: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Navigation & History State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("agrisense_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("agrisense_history", JSON.stringify(history));
    }
  }, [history, isMounted]);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs((prev) => [...prev, { timestamp, message, type }]);
  };

  const handleAnalyze = async () => {
    if (!formData.luasLahan || !formData.modalAwal || !formData.kondisiTanah || !formData.cuacaDominan) return;
    setIsAnalyzing(true);
    setResult(null);
    setLogs([]);
    setActiveTab("dashboard");

    addLog("Memulai AgriSense AI Engine...", "processing");

    await delay(400);
    addLog(`Parameter: ${formData.luasLahan} ha, Rp ${parseInt(formData.modalAwal).toLocaleString("id-ID")}`, "info");

    await delay(300);
    addLog(`Tanah: ${formData.kondisiTanah} | Cuaca: ${formData.cuacaDominan}`, "info");

    await delay(500);
    addLog("Menghubungkan ke Groq AI API...", "processing");

    await delay(300);
    addLog("Model: llama-3.3-70b-versatile", "info");

    await delay(200);
    addLog("Mengirim data ke server AI...", "processing");

    const startTime = Date.now();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          luasLahan: parseFloat(formData.luasLahan),
          modalAwal: parseFloat(formData.modalAwal),
          kondisiTanah: formData.kondisiTanah,
          cuacaDominan: formData.cuacaDominan,
        }),
      });
      const elapsed = Date.now() - startTime;
      const data: AnalysisResponse = await res.json();

      if (data.success && data.meta) {
        addLog(`✓ Respons diterima dalam ${elapsed}ms`, "success");
        addLog(`Token digunakan: ${data.meta.tokensUsed} (prompt: ${data.meta.promptTokens}, completion: ${data.meta.completionTokens})`, "success");
        addLog(`Rekomendasi: ${data.data?.recommendations?.length || 0} strategi dihasilkan`, "success");
        addLog("Analisis selesai — menampilkan hasil", "success");
        
        // Save to history
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleString("id-ID", { 
            day: "numeric", month: "short", year: "numeric", 
            hour: "2-digit", minute: "2-digit"
          }),
          formData: { ...formData },
          result: data
        };
        setHistory(prev => [newItem, ...prev]);
      } else {
        addLog(`✗ Error: ${data.error || "Gagal menganalisis"}`, "error");
      }

      setResult(data);
    } catch {
      addLog("✗ Koneksi gagal. Periksa jaringan Anda.", "error");
      setResult({ success: false, error: "Koneksi gagal. Silakan coba lagi." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setFormData(item.formData);
    setResult(item.result);
    setLogs([{
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      message: `Memuat laporan riwayat dari ${item.date}`,
      type: "info"
    }]);
    setActiveTab("dashboard");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background relative selection:bg-accent/30 selection:text-accent-hover">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none translate-y-1/2" />

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formData={formData}
        setFormData={setFormData}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden relative z-10 backdrop-blur-sm">
        {/* Mobile Header */}
        <header className="flex items-center gap-3 border-b border-border/50 bg-surface/80 backdrop-blur-md px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-muted hover:text-foreground" aria-label="Open menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="font-semibold text-sm">AgriSense AI</span>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex flex-1 overflow-hidden flex-col p-4 lg:p-6">
          <div className="flex-1 rounded-2xl border border-border/50 bg-surface/40 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
            {activeTab === "history" ? (
              <HistoryPanel history={history} onView={handleViewHistoryItem} />
            ) : (
              <AIPanel isAnalyzing={isAnalyzing} result={result} logs={logs} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
