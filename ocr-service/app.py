from io import BytesIO

from fastapi import FastAPI, File, Form, UploadFile
from PIL import Image, ImageOps

app = FastAPI(title="BookSnaps OCR", version="0.1.0")

try:
    from paddleocr import PaddleOCR

    ocr = PaddleOCR(use_angle_cls=True, lang="latin")
except Exception:  # pragma: no cover
    ocr = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ocr")
async def run_ocr(
    image: UploadFile = File(...),
    language: str = Form("pt,en"),
):
    content = await image.read()
    prepared = preprocess_image(content)

    if ocr is None:
        return {
            "text": "PaddleOCR is not available in this environment yet.",
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
    output = BytesIO()
    image.save(output, format="JPEG", quality=92, optimize=True)
    output.seek(0)
    return output.getvalue()
