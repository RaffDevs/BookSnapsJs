from io import BytesIO

from fastapi import FastAPI, File, Form, UploadFile
import numpy as np
from PIL import Image, ImageOps

app = FastAPI(title="BookSnaps OCR", version="0.1.0")
ocr_error = None

try:
    from paddleocr import PaddleOCR

    ocr = PaddleOCR(use_angle_cls=True, lang="pt")
except Exception as exc:  # pragma: no cover
    ocr = None
    ocr_error = str(exc)


@app.get("/health")
def health():
    return {
        "status": "ok" if ocr is not None else "degraded",
        "ocr_available": ocr is not None,
        "ocr_error": ocr_error,
    }


@app.post("/ocr")
async def run_ocr(
    image: UploadFile = File(...),
    language: str = Form("pt"),
):
    content = await image.read()
    prepared = preprocess_image(content)

    if ocr is None:
        return {
            "text": f"PaddleOCR is not available in this environment yet. {ocr_error or ''}".strip(),
            "blocks": [],
            "language": language,
        }

    result = ocr.predict(prepared)
    blocks = []
    text_parts = []

    for page in result:
        for line in page.get("rec_texts", []):
            text_parts.append(line)

        points = page.get("rec_polys", [])
        confidences = page.get("rec_scores", [])
        texts = page.get("rec_texts", [])
        for index, text in enumerate(texts):
            blocks.append(
                {
                    "text": text,
                    "confidence": float(confidences[index]) if index < len(confidences) else 0.0,
                    "box": points[index].tolist() if index < len(points) else [],
                }
            )

    return {
        "text": " ".join(text_parts).strip(),
        "blocks": blocks,
        "language": language,
    }


def preprocess_image(content: bytes):
    image = Image.open(BytesIO(content)).convert("RGB")
    image = ImageOps.exif_transpose(image)
    image = ImageOps.autocontrast(image)
    return np.array(image)
