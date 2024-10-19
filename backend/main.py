from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel 
from chatapi import chatapi
from starlette.middleware.cors import CORSMiddleware
from typing import Optional
from traceback import format_exc


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 追記により追加
    allow_methods=["*"],      # 追記により追加
    allow_headers=["*"]       # 追記により追加
)


# リクエストボディのデータ構造を定義
class ChatRequest(BaseModel):
    input_text: str
    base64_image: Optional[str] = None
    max_tokens: int = 300
    
@app.exception_handler(RequestValidationError)
async def handler(request:Request, exc:RequestValidationError):
    # print(exc)
    return JSONResponse(content={}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

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
        error_message = format_exc()  # 詳細なスタックトレースを取得
        print(f"Error occurred: {error_message}")
        raise HTTPException(status_code=500, detail=str(e))