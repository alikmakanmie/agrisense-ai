import Image from "next/image";
import type { FormData } from "@/app/page";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  language: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
}

const navIcons = {
  dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
  history: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
};

const soilOptions = [
  { value: "Gambut", label: { id: "Gambut (Peat)", en: "Peat (Gambut)" } },
  { value: "Liat", label: { id: "Liat (Clay)", en: "Clay (Liat)" } },
  { value: "Berpasir", label: { id: "Berpasir (Sandy)", en: "Sandy (Berpasir)" } },
];

const weatherOptions = [
  { value: "Hujan", label: { id: "Hujan (Rainy)", en: "Rainy (Hujan)" } },
  { value: "Kemarau", label: { id: "Kemarau (Dry)", en: "Dry (Kemarau)" } },
  { value: "Berawan", label: { id: "Berawan (Cloudy)", en: "Cloudy (Berawan)" } },
  { value: "Cerah", label: { id: "Cerah (Sunny)", en: "Sunny (Cerah)" } },
];

export default function Sidebar({ 
  isOpen, onClose, activeTab, onTabChange, 
  formData, setFormData, onAnalyze, isAnalyzing,
  language, setLanguage
}: SidebarProps) {
  
  const isValid = formData.luasLahan && formData.modalAwal && formData.kondisiTanah && formData.cuacaDominan;

  const update = (key: keyof FormData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      update("modalAwal", "");
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(rawValue, 10));
    update("modalAwal", formatted);
  };

  const t = {
    id: {
      dashboard: "Dasbor",
      history: "Riwayat",
      inputData: "Input Data",
      luasLahan: "Luas Lahan (Hektar)",
      modalAwal: "Modal Awal (IDR)",
      kondisiTanah: "Kondisi Tanah",
      cuacaDominan: "Cuaca Dominan",
      analyze: "Analisis Strategi",
      processing: "Memproses...",
      placeholderLuas: "Contoh: 10",
      placeholderModal: "Contoh: 500.000.000",
      soilSelect: "Pilih kondisi tanah...",
      weatherSelect: "Pilih cuaca..."
    },
    en: {
      dashboard: "Dashboard",
      history: "History",
      inputData: "Data Input",
      luasLahan: "Land Area (Hectares)",
      modalAwal: "Initial Capital (IDR)",
      kondisiTanah: "Soil Condition",
      cuacaDominan: "Dominant Weather",
      analyze: "Analyze Strategy",
      processing: "Processing...",
      placeholderLuas: "e.g. 10",
      placeholderModal: "e.g. 500.000.000",
      soilSelect: "Select soil type...",
      weatherSelect: "Select weather..."
    }
  }[language];

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[340px] flex-col border-r border-border/50 bg-surface/80 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand & Language Toggle */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover shadow-[0_0_20px_rgba(34,197,94,0.3)] text-background">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">AgriSense AI</h1>
              <p className="text-[11px] font-medium text-accent">Strategy Agent v2.0</p>
            </div>
          </div>
          
          {/* Language Toggle */}
          <div className="flex bg-surface-alt/80 p-0.5 rounded-lg border border-border/50 shadow-inner">
            <button 
              onClick={() => setLanguage("id")} 
              className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${language === "id" ? "bg-accent text-background shadow-md" : "text-muted hover:text-foreground"}`}
            >
              ID
            </button>
            <button 
              onClick={() => setLanguage("en")} 
              className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${language === "en" ? "bg-accent text-background shadow-md" : "text-muted hover:text-foreground"}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-6">
          
          {/* Consultant Card */}
          <div className="mx-5 mt-6 mb-6 rounded-2xl border border-border/50 bg-surface-alt/50 p-4 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-accent/30 shadow-lg">
                <Image src="/consultant-avatar.png" alt="AI Consultant" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Dr. Agro</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="text-[10px] font-medium text-muted uppercase tracking-wide">Online • Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-3 mb-6 space-y-1 shrink-0">
            <button 
              onClick={() => { onTabChange("dashboard"); if(window.innerWidth < 1024) onClose(); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${activeTab === "dashboard" ? "bg-accent/15 text-accent shadow-inner" : "text-muted hover:bg-surface-alt hover:text-foreground"}`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={navIcons.dashboard}/></svg>
              {t.dashboard}
            </button>
            <button 
              onClick={() => { onTabChange("history"); if(window.innerWidth < 1024) onClose(); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${activeTab === "history" ? "bg-accent/15 text-accent shadow-inner" : "text-muted hover:bg-surface-alt hover:text-foreground"}`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={navIcons.history}/></svg>
              {t.history}
            </button>
          </nav>

          {/* Form Input Section - Only show when dashboard is active */}
          <div className={`px-5 transition-opacity duration-300 ${activeTab === 'dashboard' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{t.inputData}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="space-y-4">
              {/* Luas Lahan */}
              <div>
                <label htmlFor="luas-lahan" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted">
                  {t.luasLahan}
                </label>
                <div className="relative group">
                  <input
                    id="luas-lahan"
                    type="number"
                    placeholder={t.placeholderLuas}
                    value={formData.luasLahan}
                    onChange={(e) => update("luasLahan", e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground placeholder-muted/50 transition-all group-hover:border-accent/30 focus:border-accent focus:bg-background focus:outline-none focus:ring-4 focus:ring-accent/10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted group-hover:text-foreground/70 transition-colors">ha</span>
                </div>
              </div>

              {/* Modal Awal */}
              <div>
                <label htmlFor="modal-awal" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted">
                  {t.modalAwal}
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted group-hover:text-foreground/70 transition-colors">Rp</span>
                  <input
                    id="modal-awal"
                    type="text"
                    inputMode="numeric"
                    placeholder={t.placeholderModal}
                    value={formData.modalAwal}
                    onChange={handleModalChange}
                    className="w-full rounded-xl border border-border/50 bg-background/50 pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted/50 transition-all group-hover:border-accent/30 focus:border-accent focus:bg-background focus:outline-none focus:ring-4 focus:ring-accent/10"
                  />
                </div>
              </div>

              {/* Kondisi Tanah */}
              <div>
                <label htmlFor="kondisi-tanah" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted">
                  {t.kondisiTanah}
                </label>
                <select
                  id="kondisi-tanah"
                  value={formData.kondisiTanah}
                  onChange={(e) => update("kondisiTanah", e.target.value)}
                  className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground transition-all hover:border-accent/30 focus:border-accent focus:bg-background focus:outline-none focus:ring-4 focus:ring-accent/10 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface">{t.soilSelect}</option>
                  {soilOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-surface">{opt.label[language]}</option>
                  ))}
                </select>
              </div>

              {/* Cuaca Dominan */}
              <div>
                <label htmlFor="cuaca-dominan" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted">
                  {t.cuacaDominan}
                </label>
                <select
                  id="cuaca-dominan"
                  value={formData.cuacaDominan}
                  onChange={(e) => update("cuacaDominan", e.target.value)}
                  className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground transition-all hover:border-accent/30 focus:border-accent focus:bg-background focus:outline-none focus:ring-4 focus:ring-accent/10 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface">{t.weatherSelect}</option>
                  {weatherOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-surface">{opt.label[language]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              id="analyze-btn"
              onClick={() => {
                onAnalyze();
                if(window.innerWidth < 1024) onClose();
              }}
              disabled={!isValid || isAnalyzing}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-hover py-4 text-sm font-bold text-background transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 relative z-10" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  <span className="relative z-10">{t.processing}</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="relative z-10"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                  <span className="relative z-10 tracking-wide">{t.analyze}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 px-6 py-4 shrink-0 bg-surface/50 backdrop-blur-md">
          <p className="text-[10px] font-medium text-muted/60 text-center">Powered by alikmakanmie • 2025</p>
        </div>
      </aside>
    </>
  );
}
