import json

import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

API_KEY = "" #Генерирайте API ключ и го поставете тука!
# reader = easyocr.Reader(['en', 'bg'])
# client = genai.Client(api_key=API_KEY)
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-lite")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # или ["*"] за всички
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "OCR FastAPI is running"}


@app.post("/ocr")
async def perform_ocr(file: UploadFile = File(...)):
    contents = await file.read()
    response = model.generate_content(
        contents=[
            {
                "parts": [
                    {
                        "mime_type": "image/jpeg",
                        "data": contents,
                    },
                    {
                        "text": f"Искам да ми даваш информация за книгата под формата на JSON. Искам да генерираш параметрите (title, author, genre, year, summary (искам подробна, но не много дълга информация за книгата която е на български)), като имаш предвид тази информация от книгата на снимката. Искам да ми връщаш само JSON, без значение дали си намерил нещо или не."
                    }
                ]
            }
        ]
    )

    answer_text = response.text.strip()

    if answer_text.startswith("```json"):
        answer_text = answer_text.replace("```json", "").replace("```", "").strip()

    try:
        json_data = json.loads(answer_text)
        return json_data
    except json.JSONDecodeError:
        return {"error": "Invalid JSON in response", "raw_text": answer_text}

    # contents = await file.read()
    # img = np.array(Image.open(io.BytesIO(contents)))
    # results = reader.readtext(img)
    # text = ' '.join([res[1] for res in results])
    #
    # response = client.models.generate_content(
    #     model="gemini-2.0-flash",
    #     contents=f"Искам да ми даваш информация за книгата под формата на JSON. Искам да генерираш параметрите (title, author, genre, year, summary (искам подробна, но не много дълга информация за книгата която е на български)), като имаш предвид тази информация за книгата {text}. Искам да ми връщаш само JSON, без значение дали си намерил нещо или не.",
    # )
    #
    # answer_text = response.text.strip()
    #
    # if answer_text.startswith("```json"):
    #     answer_text = answer_text.replace("```json", "").replace("```", "").strip()
    #
    # try:
    #     json_data = json.loads(answer_text)
    #     return json_data
    # except json.JSONDecodeError:
    #     return {"error": "Invalid JSON in response", "raw_text": answer_text}
