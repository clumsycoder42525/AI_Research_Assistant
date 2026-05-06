import os
import json
from groq import Groq
from .wiki_service import wiki_service
from ..text_utils import clean_ai_string

# Pull from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
        self.default_model = os.getenv("GROQ_MODEL", "llama3-8b-8192")

    def chat_completion_with_refs(self, messages, query, model=None):
        """Chat with Wikipedia-sourced context and return response + references."""
        if not self.client:
            raise ValueError("GROQ_API_KEY is not configured.")
        
        # Search Wikipedia for context
        wiki_results = wiki_service.search(query, num_results=3)
        
        # Build context from Wikipedia
        wiki_context = ""
        references = []
        for i, ref in enumerate(wiki_results):
            wiki_context += f"\n[Source {i+1}: {ref['title']}]\n{ref['snippet']}\n"
            references.append({
                "title": ref["title"],
                "url": ref["url"],
                "snippet": ref["snippet"]
            })
        
        system_msg = f"""You are Vedanta AI, an advanced research copilot. Use the following Wikipedia sources to ground your answer with real facts. 
Always cite your sources inline using [1], [2], [3] notation when referencing information from the sources below.
If the sources don't cover the topic well, still answer using your knowledge but note which parts are from sources vs your own knowledge.

--- WIKIPEDIA SOURCES ---
{wiki_context}
--- END SOURCES ---

Provide a thorough, well-structured answer in Markdown format."""

        augmented_messages = [{"role": "system", "content": system_msg}] + messages

        try:
            response = self.client.chat.completions.create(
                messages=augmented_messages,
                model=model or self.default_model,
                temperature=0.7,
            )
            return {
                "content": clean_ai_string(response.choices[0].message.content),
                "references": references
            }
        except Exception as e:
            print(f"Groq API Error: {e}")
            return {
                "content": "Error communicating with LLM.",
                "references": []
            }

    def chat_completion(self, messages, model=None):
        """Simple chat without references (backward compat)."""
        if not self.client:
            raise ValueError("GROQ_API_KEY is not configured.")
        try:
            response = self.client.chat.completions.create(
                messages=messages,
                model=model or self.default_model,
                temperature=0.7,
            )
            return clean_ai_string(response.choices[0].message.content)
        except Exception as e:
            print(f"Groq API Error: {e}")
            return "Error communicating with LLM."

    def generate_report(self, prompt, model=None):
        if not self.client:
            raise ValueError("GROQ_API_KEY is not configured.")
        
        # Get Wikipedia references  
        wiki_results = wiki_service.search(prompt, num_results=5)
        wiki_context = ""
        real_citations = []
        for i, ref in enumerate(wiki_results):
            wiki_context += f"\n[Source {i+1}: {ref['title']}]\n{ref['snippet']}\n"
            real_citations.append(f"Wikipedia: \"{ref['title']}\" - {ref['url']}")
            
        system_prompt = f"""You are an elite AI Research Assistant. Generate highly structured, detailed research reports.
Use these real Wikipedia sources to ground your response:

--- WIKIPEDIA SOURCES ---
{wiki_context}
--- END SOURCES ---

Return your response in purely valid JSON format containing exactly these keys:
- "summary": A high-level overview using the sources above.
- "key_points": A bulleted markdown list of the most critical facts or findings. Cite sources with [1], [2] etc.
- "applications": Practical applications, implications, or examples.
- "conclusion": Final thoughts or synthesis.
- "citations": Use EXACTLY the citations list I provide below, do NOT invent new ones.
- "depth_level": "Advanced"
Output ONLY valid JSON."""
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Generate a research report on: {prompt}\n\nUse these citations: {json.dumps(real_citations)}"}
                ],
                model=model or self.default_model,
                temperature=0.4,
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            try:
                result = json.loads(content)
            except json.JSONDecodeError as je:
                print(f"Groq JSON Decode Error: {je}")
                # Fallback: try to find JSON in the string if it's wrapped in markers
                if "{" in content and "}" in content:
                    start = content.find("{")
                    end = content.rfind("}") + 1
                    result = json.loads(content[start:end])
                else:
                    raise je
            
            # Defensive check: Ensure text fields are strings and handle potential key variations
            text_fields = {
                "summary": ["summary", "abstract", "overview"],
                "key_points": ["key_points", "keyPoints", "highlights", "findings"],
                "applications": ["applications", "use_cases", "implications"],
                "conclusion": ["conclusion", "summary_end", "final_thoughts"]
            }
            
            clean_result = {}
            for target_key, aliases in text_fields.items():
                val = None
                for alias in aliases:
                    if alias in result:
                        val = result[alias]
                        break
                
                if val is None:
                    val = ""
                
                if isinstance(val, list):
                    # Join list items into a formatted markdown string
                    val = "\n".join([f"- {str(item)}" if not str(item).strip().startswith("-") else str(item) for item in val])
                elif not isinstance(val, str):
                    val = str(val) if val is not None else ""
                
                clean_result[target_key] = val
            
            # Ensure real citations are used and handled as a list of strings
            raw_citations = result.get("citations", [])
            if not raw_citations or not isinstance(raw_citations, list):
                clean_result["citations"] = real_citations
            else:
                clean_result["citations"] = [clean_ai_string(c) for c in raw_citations]
                
            clean_result["depth_level"] = result.get("depth_level", "Advanced")
            
            # Final validation pass: ensure all fields are cleaned strings
            for k, v in clean_result.items():
                if k != "citations":
                    clean_result[k] = clean_ai_string(v)
            
            return clean_result

        except Exception as e:
            print(f"Groq Report Generation Error: {e}")
            import traceback
            traceback.print_exc()
            return {
                "summary": "Failed to generate report due to an internal error.",
                "key_points": "The system encountered an error while processing the research data.",
                "applications": "N/A",
                "conclusion": "Please try again later or with a different query.",
                "citations": real_citations,
                "depth_level": "Basic"
            }

    def paraphrase(self, text, tone="Casual", model=None):
        if not self.client:
            raise ValueError("GROQ_API_KEY is not configured.")
        sys_prompt = f"You are an expert copywriter. Paraphrase the user's text to improve flow, clarity, and engagement. Use a {tone} tone. Keep the core meaning intact. Output ONLY the paraphrased text, no intro or outro."
        return self.chat_completion([
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": text}
        ], model)

    def ai_detection(self, text, model=None):
        if not self.client:
            raise ValueError("GROQ_API_KEY is not configured.")
        sys_prompt = """Analyze the provided text to determine the probability it was written by an AI. 
Focus on perplexity, burstiness, and phrasing patterns.
Always return purely valid JSON with the following keys:
- "score": A float between 0.0 (100% Human) and 1.0 (100% AI).
- "explanation": A 1-2 sentence detailed explanation of why you gave this score."""
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": text}
                ],
                model=model or self.default_model,
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            data = json.loads(response.choices[0].message.content)
            return {"score": data.get("score"), "explanation": data.get("explanation")}
        except Exception as e:
            print(f"Detection Error: {e}")
            return {"score": 0.5, "explanation": "Failed to analyze."}

# Instantiate singleton
llm_service = LLMService()
