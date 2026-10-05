import os
import json
from google import genai
from google.genai import types
from app.config import settings

def get_gemini_client():
    """Initialize and return the Google GenAI client."""
    # Note: Ensure LLM_API_KEY is set in settings or GEMINI_API_KEY in environment
    api_key = settings.LLM_API_KEY or os.environ.get("GEMINI_API_KEY")
    return genai.Client(api_key=api_key)

async def generate_rag_response(question: str, context_docs: list[dict]) -> dict:
    """
    Generate an AI response based on retrieved documents.
    Returns the answer and the citations used.
    """
    client = get_gemini_client()
    
    # Format context
    context_text = ""
    for idx, doc in enumerate(context_docs):
        context_text += f"\n--- Source {idx+1}: {doc['title']} (Page {doc.get('page', 'N/A')}) ---\n"
        context_text += f"{doc['content']}\n"
    
    prompt = f"""
    You are an expert enterprise AI assistant for Coal India Limited (CIL) and its subsidiaries (like SECL, NCL, etc.).
    You have been asked the following question:
    <question>
    {question}
    </question>
    
    Please answer the question using ONLY the provided context documents below.
    If the context does not contain the answer, explicitly state that you do not have enough information.
    
    Context Documents:
    <context>
    {context_text}
    </context>
    
    Format your response in Markdown. You should cite your sources using the source numbers (e.g. [Source 1]).
    Be professional, concise, and accurate.
    """
    
    # We use gemini-2.5-flash as the default fast reasoning model for RAG
    model = settings.LLM_MODEL or "gemini-2.5-flash"
    
    try:
        # In a real async environment we might use run_in_executor or the async client if available
        # The new SDK provides client.aio for async operations
        response = await client.aio.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
            )
        )
        answer = response.text
    except Exception as e:
        answer = f"Error generating response: {str(e)}"
        
    # Return the structured response
    return {
        "question": question,
        "answer": answer,
        "sources": context_docs
    }

async def extract_entities(text: str) -> list[dict]:
    """
    Extract entities (Mines, Seams, Locations, etc.) from document text.
    """
    client = get_gemini_client()
    
    prompt = f"""
    Extract key geological and mining entities from the following text.
    Return ONLY a JSON array of objects with 'name', 'type', and 'confidence' (0.0 to 1.0).
    Entity types should be: 'Mine', 'Coal Seam', 'Borehole', 'Location', 'Organization', or 'Metric'.
    
    Text:
    {text[:5000]}  # limit text length for extraction
    """
    
    model = settings.LLM_MODEL or "gemini-2.5-flash"
    
    try:
        response = await client.aio.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type="application/json",
            )
        )
        return json.loads(response.text)
    except Exception:
        return []
