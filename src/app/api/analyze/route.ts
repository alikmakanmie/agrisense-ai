import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AnalysisRequest {
  luasLahan: number;
  modalAwal: number;
  kondisiTanah: string;
  cuacaDominan: string;
  language: "id" | "en";
}

export interface AnalysisResponse {
  success: boolean;
  data?: {
    summary: string;
    recommendations: {
      title: string;
      description: string;
      priority: "high" | "medium" | "low";
    }[];
    estimatedROI: string;
    riskAssessment: string;
    timeline: string;
  };
  meta?: {
    model: string;
    tokensUsed: number;
    responseTimeMs: number;
    timestamp: string;
    promptTokens: number;
    completionTokens: number;
  };
  error?: string;
}

function buildSystemPrompt(lang: "id" | "en"): string {
  if (lang === "en") {
    return `You are a veteran agronomy consultant with 30+ years of experience in agriculture.
You are an expert in strategic agricultural planning, soil management, and crop optimization.
Your task is to analyze land conditions, budget, soil type, and weather patterns to provide
data-driven and actionable agricultural strategies.

IMPORTANT: All responses MUST be in English.

You MUST respond ONLY with valid JSON (no markdown, no code fences) with the following structure:
{
  "summary": "Concise analysis summary (2-3 sentences)",
  "recommendations": [
    { "title": "Short title", "description": "Detailed description", "priority": "high|medium|low" }
  ],
  "estimatedROI": "Estimated ROI and payback timeline",
  "riskAssessment": "Key risks and mitigation strategies",
  "timeline": "Recommended implementation timeline"
}

CRITICAL LOGIC RULES:
1. Weather Context: Align recommendations strictly with the weather. If "Rainy" (Hujan), focus on drainage, flood prevention, and fungal diseases. DO NOT recommend drought mitigation. If "Dry" (Kemarau), focus on irrigation and drought resistance.
2. Financial Reality Check: Critically evaluate the ratio of Initial Capital to Land Area. If the capital is extremely low (e.g., < 5,000,000 IDR per hectare), DO NOT assume they can farm the entire area conventionally. Recommend starting with a small fraction of the land, low-cost crops, or zero-budget farming. Be realistic about land clearing and operational costs.

Provide 4-6 recommendations. Consider regional climate patterns and best practices. All text MUST be in English.`;
  }

  return `Kamu adalah seorang konsultan agronomi veteran dengan pengalaman 30+ tahun di bidang pertanian Indonesia.
Kamu ahli dalam perencanaan strategis pertanian, pengelolaan tanah, dan optimalisasi tanaman.
Tugasmu adalah menganalisis kondisi lahan, anggaran, jenis tanah, dan pola cuaca untuk memberikan 
strategi pertanian yang berbasis data dan dapat ditindaklanjuti.

PENTING: Seluruh respons HARUS dalam Bahasa Indonesia.

Kamu HARUS merespons HANYA dengan JSON valid (tanpa markdown, tanpa code fences) dengan struktur berikut:
{
  "summary": "Ringkasan analisis yang padat (2-3 kalimat, dalam Bahasa Indonesia)",
  "recommendations": [
    { "title": "Judul singkat dalam Bahasa Indonesia", "description": "Deskripsi detail dalam Bahasa Indonesia", "priority": "high|medium|low" }
  ],
  "estimatedROI": "Perkiraan ROI dan timeline pengembalian investasi (dalam Bahasa Indonesia)",
  "riskAssessment": "Risiko utama dan strategi mitigasi (dalam Bahasa Indonesia)",
  "timeline": "Timeline implementasi yang direkomendasikan (dalam Bahasa Indonesia)"
}

ATURAN LOGIKA KRITIS:
1. Konteks Cuaca: Sesuaikan rekomendasi dengan cuaca. Jika "Hujan", fokus pada drainase, pencegahan banjir, dan penyakit jamur. JANGAN merekomendasikan mitigasi kekeringan. Jika "Kemarau", fokus pada irigasi dan tanaman tahan kering.
2. Realitas Finansial: Evaluasi rasio Modal Awal terhadap Luas Lahan secara kritis. Jika modal sangat minim (misal di bawah Rp 5.000.000 per hektar), JANGAN berasumsi seluruh lahan bisa digarap. Sarankan untuk menggarap sebagian kecil lahan saja, memilih komoditas biaya rendah, atau mencari modal tambahan. Bersikaplah realistis mengenai biaya pembukaan lahan dan operasional.

Berikan 4-6 rekomendasi. Pertimbangkan praktik pertanian Indonesia, varietas tanaman lokal, dan pola iklim regional. Semua teks WAJIB dalam Bahasa Indonesia.`;
}

function buildUserPrompt(data: AnalysisRequest): string {
  if (data.language === "en") {
    return `Analyze the following agricultural business scenario:

- Land Area: ${data.luasLahan} hectares
- Initial Capital: IDR ${data.modalAwal.toLocaleString("id-ID")}
- Soil Condition: ${data.kondisiTanah}
- Dominant Weather: ${data.cuacaDominan}

Provide a comprehensive agribusiness strategy including crop recommendations,
resource allocation, risk assessment, and ROI estimation. Answer in English.`;
  }

  return `Analisis skenario bisnis pertanian berikut:

- Luas Lahan: ${data.luasLahan} hektar
- Modal Awal: Rp ${data.modalAwal.toLocaleString("id-ID")}
- Kondisi Tanah: ${data.kondisiTanah}
- Cuaca Dominan: ${data.cuacaDominan}

Berikan strategi agribisnis yang komprehensif mencakup rekomendasi tanaman, 
alokasi sumber daya, penilaian risiko, dan perkiraan ROI. Jawab dalam Bahasa Indonesia.`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: AnalysisRequest = await request.json();

    if (
      !body.luasLahan ||
      !body.modalAwal ||
      !body.kondisiTanah ||
      !body.cuacaDominan
    ) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const lang = body.language || "id";
    const systemPrompt = buildSystemPrompt(lang);
    const userPrompt = buildUserPrompt({ ...body, language: lang });

    console.log("\n══════════════════════════════════════════════");
    console.log("🌿 AgriSense AI — Groq API Request");
    console.log("══════════════════════════════════════════════");
    console.log(`⏰ Timestamp  : ${new Date().toISOString()}`);
    console.log(`📐 Luas Lahan : ${body.luasLahan} ha`);
    console.log(`💰 Modal Awal : Rp ${body.modalAwal.toLocaleString("id-ID")}`);
    console.log(`🏔️  Tanah      : ${body.kondisiTanah}`);
    console.log(`🌤️  Cuaca      : ${body.cuacaDominan}`);
    console.log(`🤖 Model      : llama-3.3-70b-versatile`);
    console.log("──────────────────────────────────────────────");
    console.log("📡 Sending request to Groq API...");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const responseTimeMs = Date.now() - startTime;
    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const aiResponse = JSON.parse(content);

    const promptTokens = chatCompletion.usage?.prompt_tokens || 0;
    const completionTokens = chatCompletion.usage?.completion_tokens || 0;
    const totalTokens = chatCompletion.usage?.total_tokens || 0;

    console.log("✅ Groq API responded successfully!");
    console.log(`⏱️  Response Time  : ${responseTimeMs}ms`);
    console.log(`📊 Prompt Tokens  : ${promptTokens}`);
    console.log(`📊 Completion     : ${completionTokens}`);
    console.log(`📊 Total Tokens   : ${totalTokens}`);
    console.log(`📋 Recommendations: ${aiResponse.recommendations?.length || 0} items`);
    console.log("----------------------------------------------");
    console.log("RAW OUTPUT DARI GROQ AI:");
    console.log(content);
    console.log("══════════════════════════════════════════════\n");

    return NextResponse.json({
      success: true,
      data: aiResponse,
      meta: {
        model: "llama-3.3-70b-versatile",
        tokensUsed: totalTokens,
        responseTimeMs,
        timestamp: new Date().toISOString(),
        promptTokens,
        completionTokens,
      },
    });
  } catch (err) {
    const responseTimeMs = Date.now() - startTime;
    console.error("\n❌ ══════════════════════════════════════════");
    console.error("❌ AgriSense AI — Groq API ERROR");
    console.error("❌ ══════════════════════════════════════════");
    console.error(`⏱️  Failed after: ${responseTimeMs}ms`);
    console.error("Error:", err);
    console.error("══════════════════════════════════════════\n");

    return NextResponse.json(
      { success: false, error: "Analisis gagal. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
