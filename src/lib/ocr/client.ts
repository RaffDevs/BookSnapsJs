import type { OcrResult } from "@/lib/types";
import { env } from "@/lib/server/env";

export async function extractTextWithOcr(
  file: File,
  language: string,
): Promise<OcrResult> {
  if (!env.ocrServiceUrl) {
    return {
      text: "OCR service not configured. This is placeholder text generated in local/demo mode.",
      blocks: [],
      language,
    };
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("language", language);

  const response = await fetch(`${env.ocrServiceUrl}/ocr`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Falha ao processar OCR no servico dedicado.");
  }

  return (await response.json()) as OcrResult;
}
