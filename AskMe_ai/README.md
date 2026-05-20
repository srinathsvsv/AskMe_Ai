# Simple Groq FastAPI

## 1) Install dependencies

```bash
pip install -r requirements.txt
```

## 2) Run API

```bash
py main.py
```

API runs at `http://127.0.0.1:8000`.

## 3) Test endpoint

```bash
curl -X POST http://127.0.0.1:8000/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "user", "content": "hi"}
    ]
  }'
```

You can also pass a model in request body:

```json
{
  "model": "llama-3.1-8b-instant",
  "messages": [{"role": "user", "content": "hi"}]
}
```
