
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import uuid
from contextlib import asynccontextmanager
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver
from tts import text_to_wav 
import io


class GeminiLangGraphApp:
    def __init__(self):
        load_dotenv()
        self._set_api_key()
        self.conn = sqlite3.connect("checkpoints.sqlite", check_same_thread=False)
        self.memory = SqliteSaver(self.conn)
        self.model = self._create_model()
        self.app = self._build_workflow()

    def _set_api_key(self):
        if "GOOGLE_API_KEY" not in os.environ:
            # For production, you should set this as an environment variable
            # os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter your Google AI API key: ")
            raise ValueError("GOOGLE_API_KEY environment variable must be set")

    def _create_model(self):
        return ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2
        )

    def _build_workflow(self):
        workflow = StateGraph(state_schema=MessagesState)

        def call_model(state: MessagesState):
            response = self.model.invoke(state["messages"])
            return {"messages": response}

        workflow.add_node("model", call_model)
        workflow.add_edge(START, "model")

        return workflow.compile(checkpointer=self.memory)

    def ask(self, query: str, thread_id: str) -> str:
        config = {"configurable": {"thread_id": thread_id}}
        input_messages = [HumanMessage(query)]
        output = self.app.invoke({"messages": input_messages}, config)
        return output["messages"][-1].content


# Global variable to store the chat app instance
chat_app = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global chat_app
    try:
        chat_app = GeminiLangGraphApp()
        print("GeminiLangGraphApp initialized successfully")
    except Exception as e:
        print(f"Failed to initialize GeminiLangGraphApp: {e}")
        raise
    
    yield
    
    # Shutdown
    if chat_app and hasattr(chat_app, 'conn'):
        chat_app.conn.close()
        print("Database connection closed")


# Initialize FastAPI app
app = FastAPI(
    title="Gemini LangGraph Chat API",
    description="A FastAPI server for the GeminiLangGraphApp with conversation memory",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class ChatRequest(BaseModel):
    query: str
    thread_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    thread_id: str

class HealthResponse(BaseModel):
    status: str
    message: str


# Routes
@app.get("/", response_model=dict)
async def root():
    return {
        "message": "Gemini LangGraph Chat API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/chat",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    global chat_app
    if chat_app is None:
        raise HTTPException(status_code=503, detail="Chat app not initialized")
    
    return HealthResponse(
        status="healthy",
        message="Gemini LangGraph Chat API is running"
    )


# @app.post("/chat", response_model=ChatResponse)
# async def chat(request: ChatRequest):
#     global chat_app
    
#     if chat_app is None:
#         raise HTTPException(status_code=503, detail="Chat app not initialized")
    
#     try:
#         # Generate a thread_id if not provided
#         thread_id = request.thread_id or str(uuid.uuid4())
        
#         # Get response from the chat app
#         response = chat_app.ask(request.query, thread_id)
#         text_to_wav(response)
        
#         return ChatResponse(
#             response=response,
#             thread_id=thread_id
#         )
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")
import base64
from fastapi.responses import JSONResponse

from tts_python import text_to_wav_gtts
@app.post("/chat")
async def chat(request: ChatRequest):
    global chat_app

    if chat_app is None:
        raise HTTPException(status_code=503, detail="Chat app not initialized")

    try:
        thread_id = request.thread_id or str(uuid.uuid4())
        response_text = chat_app.ask(request.query, thread_id)
        print("response text from model == ", response_text)

        # wav_path = text_to_wav(response_text)
        wav_path = text_to_wav_gtts(response_text)

        with open(wav_path, "rb") as f:
            audio_bytes = f.read()
        print("converted to audio file")
        

        audio_b64 = base64.b64encode(audio_bytes).decode()

        return JSONResponse({
            "thread_id": thread_id,
            "text": response_text,
            "audio": audio_b64,
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/threads/{thread_id}/history")
async def get_thread_history(thread_id: str):
    """Get conversation history for a specific thread"""
    global chat_app
    
    if chat_app is None:
        raise HTTPException(status_code=503, detail="Chat app not initialized")
    
    try:
        # This is a basic implementation - you might want to enhance this
        # to return the actual conversation history from the checkpointer
        return {
            "thread_id": thread_id,
            "message": "History endpoint - implementation depends on your specific needs"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")


# Additional utility endpoints
@app.delete("/threads/{thread_id}")
async def delete_thread(thread_id: str):
    """Delete a conversation thread"""
    global chat_app
    
    if chat_app is None:
        raise HTTPException(status_code=503, detail="Chat app not initialized")
    
    try:
        # Implementation would depend on how you want to handle thread deletion
        # This might involve clearing the checkpointer state for this thread
        return {"message": f"Thread {thread_id} deletion requested"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting thread: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",  # Replace "main" with your filename if different
        host="0.0.0.0",
        port=8000,
        reload=False,  # Set to False in production
        log_level="info"
    )