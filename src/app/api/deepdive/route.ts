import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface DeepDiveRequest {
  recommendationTitle: string;
  recommendationDesc: string;
  context: {
    luasLahan: number;
    modalAwal: number;
    kondisiTanah: string;
    cuacaDominan: string;
  };
  language: "id" | "en";
}

export interface DeepDiveResponse {
  success: boolean;
  data?: {
    steps: {
      title: string;
      description: string;
    }[];
    costEstimation: string;
    proTip: string;
  };
  error?: string;
}

function buildSystemPrompt(lang: "id" | "en"): string {
  if (lang === "en") {
    return `You are a veteran agronomy consultant. The user wants a "Deep Dive" technical guide for a specific agricultural recommendation you previously gave them.
Provide actionable, step-by-step instructions.

You MUST respond ONLY with valid JSON (no markdown, no code fences) with the following structure:
{
  "steps": [
    { "title": "Step Name", "description": "Detailed actionable instruction" }
  ],
  "costEstimation": "A realistic estimation of the cost to implement this specific recommendation based on their initial capital.",
  "proTip": "One advanced, secret tip from an expert agronomist."
}

All text MUST be in English. Provide exactly 3-5 steps.`;
  }

  return `Kamu adalah konsultan agronomi veteran. Pengguna ingin panduan teknis mendalam ("Deep Dive") untuk rekomendasi pertanian spesifik yang kamu berikan sebelumnya.
Berikan panduan langkah demi langkah yang dapat langsung dipraktikkan.

Kamu HARUS merespons HANYA dengan JSON valid (tanpa markdown, tanpa code fences) dengan struktur berikut:
{
  "steps": [
    { "title": "Nama Langkah", "description": "Instruksi detail yang bisa ditindaklanjuti" }
  ],
  "costEstimation": "Estimasi biaya realistis untuk menjalankan rekomendasi ini, disesuaikan dengan Modal Awal mereka.",
  "proTip": "Satu tips rahasia tingkat lanjut dari pakar agronomi."
}

Semua teks WAJIB dalam Bahasa Indonesia. Berikan tepat 3-5 langkah.`;
}

function buildUserPrompt(data: DeepDiveRequest): string {
  if (data.language === "en") {
    return `Context:
- Land Area: ${data.context.luasLahan} hectares
- Initial Capital: IDR ${data.context.modalAwal.toLocaleString("id-ID")}
- Soil Condition: ${data.context.kondisiTanah}
- Dominant Weather: ${data.context.cuacaDominan}

Recommendation to Deep Dive:
Title: ${data.recommendationTitle}
Description: ${data.recommendationDesc}

Provide the technical implementation guide in English.`;
  }

  return `Konteks:
- Luas Lahan: ${data.context.luasLahan} hektar
- Modal Awal: Rp ${data.context.modalAwal.toLocaleString("id-ID")}
- Kondisi Tanah: ${data.context.kondisiTanah}
- Cuaca Dominan: ${data.context.cuacaDominan}

Rekomendasi yang Ingin Didalami (Deep Dive):
Judul: ${data.recommendationTitle}
Deskripsi: ${data.recommendationDesc}

Berikan panduan implementasi teknis dalam Bahasa Indonesia.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: DeepDiveRequest = await request.json();

    if (!body.recommendationTitle || !body.context) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const lang = body.language || "id";
    const systemPrompt = buildSystemPrompt(lang);
    const userPrompt = buildUserPrompt(body);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_completion_tokens: 800,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from Groq");
    }

    const parsedData = JSON.parse(content);

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Deep Dive Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mendapatkan panduan teknis. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
