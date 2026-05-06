from abc import ABC, abstractmethod
import os
from groq import Groq
import json
from ..text_utils import clean_ai_string

class BaseAgent(ABC):
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = os.getenv("GROQ_MODEL", "llama3-70b-8192")

    @abstractmethod
    async def process(self, input_data: str, context: dict = None) -> dict:
        """Process the input and return a structured dictionary."""
        pass

    def _call_llm(self, system_prompt: str, user_prompt: str, json_mode: bool = True) -> dict:
        try:
            # Groq requires 'json' to be in the prompt if response_format is json_object
            if json_mode and "json" not in system_prompt.lower():
                system_prompt += " Respond only in valid JSON format."
            
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=self.model,
                temperature=0.3,
                response_format={"type": "json_object"} if json_mode else None
            )
            content = response.choices[0].message.content
            if json_mode:
                try:
                    data = json.loads(content)
                    
                    # Recursively clean strings in the response but PRESERVE lists/dicts
                    def clean_recursive(val):
                        if isinstance(val, str):
                            return clean_ai_string(val)
                        if isinstance(val, list):
                            return [clean_recursive(i) for i in val]
                        if isinstance(val, dict):
                            return {k: clean_recursive(v) for k, v in val.items()}
                        return val

                    return clean_recursive(data)
                except (json.JSONDecodeError, TypeError):
                    return {"error": "Malformed JSON output", "raw": clean_ai_string(content)}
            return {"content": clean_ai_string(content)}
        except Exception as e:
            print(f"Error in agent {self.name}: {e}")
            return {"error": str(e)}
