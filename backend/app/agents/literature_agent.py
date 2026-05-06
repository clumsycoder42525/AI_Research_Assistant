from .base_agent import BaseAgent
from ..services.wiki_service import wiki_service
import json

class LiteratureFinderAgent(BaseAgent):
    def __init__(self):
        super().__init__("Literature Finder", "You are an expert researcher that finds and extracts core facts from Wikipedia.")

    async def process(self, topic: str, context: dict = None) -> dict:
        print(f"[{self.name}] Searching literature for: {topic}")
        wiki_results = wiki_service.search(topic, num_results=5)
        
        sources_text = ""
        for i, ref in enumerate(wiki_results):
            sources_text += f"\n[Source {i+1}: {ref['title']}]\n{ref['snippet']}\n"

        system_prompt = f"""You are the {self.role}. 
Your goal is to extract the most relevant academic and factual data from the provided Wikipedia snippets.
Return a structured JSON with:
- "findings": A list of key factual findings discovered.
- "context": A summary of the historical and current state of this topic.
- "raw_sources": The list of sources provided to you.
"""
        user_prompt = f"Topic: {topic}\n\nWikipedia Data:\n{sources_text}"
        
        result = self._call_llm(system_prompt, user_prompt)
        # Combine with original refs
        result["references"] = wiki_results
        return result
