import type { FormData } from "@/app/page";

interface InputPanelProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const soilOptions = [
  { value: "", label: "Select soil type..." },
  { value: "Gambut", label: "Gambut (Peat)" },
  { value: "Liat", label: "Liat (Clay)" },
  { value: "Berpasir", label: "Berpasir (Sandy)" },
];

const weatherOptions = [
  { value: "", label: "Select weather..." },
  { value: "Hujan", label: "Hujan (Rainy)" },
  { value: "Kemarau", label: "Kemarau (Dry)" },
  { value: "Berawan", label: "Berawan (Cloudy)" },
  { value: "Cerah", label: "Cerah (Sunny)" },
];

export default function InputPanel({ formData, setFormData, onAnalyze, isAnalyzing }: InputPanelProps) {
  const isValid = formData.luasLahan && formData.modalAwal && formData.kondisiTanah && formData.cuacaDominan;

  const update = (key: keyof FormData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <section className="w-full border-b border-border bg-surface lg:w-[420px] lg:min-w-[380px] lg:border-b-0 lg:border-r overflow-y-auto" id="input-panel">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/15 text-accent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </span>
            <h2 className="text-lg font-bold text-foreground">Input Data</h2>
          </div>
          <p className="text-xs text-muted ml-8">Enter your agricultural parameters for AI analysis</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Luas Lahan */}
          <div>
            <label htmlFor="luas-lahan" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Luas Lahan (Hektar)
            </label>
            <div className="relative">
              <input
                id="luas-lahan"
                type="number"
                placeholder="e.g. 10"
                value={formData.luasLahan}
                onChange={(e) => update("luasLahan", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted">ha</span>
            </div>
          </div>

          {/* Modal Awal */}
          <div>
            <label htmlFor="modal-awal" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Modal Awal (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">Rp</span>
              <input
                id="modal-awal"
                type="number"
                placeholder="e.g. 500000000"
                value={formData.modalAwal}
                onChange={(e) => update("modalAwal", e.target.value)}
                className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-3 text-sm text-foreground placeholder-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* Kondisi Tanah */}
          <div>
            <label htmlFor="kondisi-tanah" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Kondisi Tanah
            </label>
            <select
              id="kondisi-tanah"
              value={formData.kondisiTanah}
              onChange={(e) => update("kondisiTanah", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 appearance-none cursor-pointer"
            >
              {soilOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Cuaca Dominan */}
          <div>
            <label htmlFor="cuaca-dominan" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Cuaca Dominan
            </label>
            <select
              id="cuaca-dominan"
              value={formData.cuacaDominan}
              onChange={(e) => update("cuacaDominan", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 appearance-none cursor-pointer"
            >
              {weatherOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          id="analyze-btn"
          onClick={onAnalyze}
          disabled={!isValid || isAnalyzing}
          className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent py-3.5 text-sm font-bold text-background transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Analyze Strategy
            </>
          )}
        </button>

        {/* Quick Stats */}
        {formData.luasLahan && formData.modalAwal && (
          <div className="mt-5 rounded-lg border border-border bg-background p-4 animate-fade-in-up">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-3">Quick Overview</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-surface-alt p-2.5">
                <p className="text-[10px] text-muted">Budget / Hectare</p>
                <p className="text-sm font-bold text-foreground">
                  {(parseFloat(formData.modalAwal) / parseFloat(formData.luasLahan) / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="rounded-md bg-surface-alt p-2.5">
                <p className="text-[10px] text-muted">Total Area</p>
                <p className="text-sm font-bold text-foreground">{formData.luasLahan} ha</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
