from fastapi import APIRouter, HTTPException
from httpx import AsyncClient, HTTPStatusError
from pydantic import BaseModel

from app.core.config import settings


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    model: str | None = None
    messages: list[ChatMessage]


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("")
async def chat(payload: ChatRequest):
    try:
        print(f"Forwarding chat request to {settings.AI_SERVICE_URL}/chat")
        print(f"Payload: {payload.model_dump(exclude_none=True)}")
        
        async with AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{settings.AI_SERVICE_URL}/chat",
                json=payload.model_dump(exclude_none=True)
            )
            response.raise_for_status()
            return response.json()
    except HTTPStatusError as exc:
        print(f"HTTP Error: {exc.response.status_code} - {exc.response.text}")
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=exc.response.text
        ) from exc
    except Exception as exc:
        print(f"Connection Error: {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Unable to reach AI service: {type(exc).__name__}: {str(exc)}"
        ) from exc
