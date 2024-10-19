from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
from chatapi import chatapi

app = FastAPI()

# リクエストボディのデータ構造を定義
class ChatRequest(BaseModel):
    input_text: str
    base64_image: str = None  # オプションとして扱う
    max_tokens: int = 300

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/chat")
def use_chatapi(request: ChatRequest):
    try:
        # リクエストボディから値を取得してchatapiに渡す
        response = chatapi(
            input_text=request.input_text, 
            base64_image=request.base64_image, 
            max_tokens=request.max_tokens
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))