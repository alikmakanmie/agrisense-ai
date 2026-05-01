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

function buildSystemPrompt(): string {
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

Berikan 4-6 rekomendasi. Pertimbangkan praktik pertanian Indonesia, varietas tanaman lokal, dan pola iklim regional. Semua teks WAJIB dalam Bahasa Indonesia.`;
}

function buildUserPrompt(data: AnalysisRequest): string {
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

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(body);

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
