from fastapi import FastAPI, File, UploadFile
from deepface import DeepFace
import shutil
import os

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok", "service": "facial-api"}

@app.post("/verify")
async def verify_img(enrolled_image: UploadFile = File(...), live_image: UploadFile = File(...)):
    path1 = f"temp_enrolled_{enrolled_image.filename}"
    path2 = f"temp_live_{live_image.filename}"
    try:
        with open(path1, "wb") as buffer:
            shutil.copyfileobj(enrolled_image.file, buffer)
        with open(path2, "wb") as buffer:
            shutil.copyfileobj(live_image.file, buffer)

        result = DeepFace.verify(
            img1_path=path1,
            img2_path=path2,
            model_name="Facenet",
            detector_backend="opencv",
            enforce_detection=True
        )
        return {
            "match":      bool(result["verified"]),
            "distance":   float(result["distance"]),
            "confidence": round(1.0 - float(result["distance"]), 4),
        }
    except Exception as e:
        return {"match": False, "distance": 1.0, "confidence": 0.0, "error": str(e)}
    finally:
        if os.path.exists(path1): os.remove(path1)
        if os.path.exists(path2): os.remove(path2)