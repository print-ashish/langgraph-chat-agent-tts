# Chat + Text-to-Speech (TTS) Integration

This project demonstrates a simple integration between a React frontend and a FastAPI backend to implement a chat system that responds with both text and audio (WAV) generated from text-to-speech.

---

## Features

- Send user query to backend chat endpoint
- Backend returns chatbot reply **text** plus **audio** (WAV) encoded in base64
- Frontend parses JSON response, displays chatbot text, and plays TTS audio
- Audio playback controls: play and stop
- Thread ID support for chat sessions

---

## Backend (FastAPI)

- Exposes a `/chat` POST endpoint
- Accepts JSON payload with:
  - `query`: user input string
  - Optional `thread_id`: session identifier
- Returns JSON with:
  - `thread_id`
  - `text`: chatbot reply
  - `audio`: base64-encoded WAV audio of the reply

### Example Backend Endpoint

```python
@app.post("/chat")
async def chat(request: ChatRequest):
    # Process chat query and generate WAV audio
    # Return JSON with text and base64 audio
