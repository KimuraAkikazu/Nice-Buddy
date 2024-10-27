# models.py
from pydantic import BaseModel
from typing import Optional, List, Union

class TextContent(BaseModel):
    type: str = "text"
    text: str

class ImageUrl(BaseModel):
    url: str

class ImageContent(BaseModel):
    type: str = "image_url"
    image_url: ImageUrl

class Message(BaseModel):
    role: str
    content: Union[str, List[Union[TextContent, ImageContent]]]

class ChatRequest(BaseModel):
    input_messages: List[Message]
    language: str
    base64_image: Optional[str] = None
    max_tokens: int = 300
    voicemode: str
