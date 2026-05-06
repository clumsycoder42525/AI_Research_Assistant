from .base_agent import BaseAgent
import json

class SlideAgent(BaseAgent):
    def __init__(self):
        super().__init__("Slide Architect", "You are an expert presentation designer that structures research into clear, impactful PowerPoint slides.")

    async def process(self, research_data: dict, context: dict = None) -> dict:
        """
        Takes processed research (abstract, insights, bibliography) and turns it into a slide deck JSON.
        """
        system_prompt = f"""You are the {self.role}. 
Your goal is to structure the provided research data into a professional PowerPoint deck (5-8 slides).

YOU MUST RETURN A JSON OBJECT WITH A SINGLE KEY "slides" WHICH IS A LIST OF SLIDE OBJECTS.
Example:
{
  "slides": [
    {"title": "Research Overview", "content": ["Point A", "Point B"], "type": "title"},
    {"title": "Key Findings", "content": ["Fact 1", "Fact 2"], "type": "content"}
  ]
}

Data to use:
- Topic: {research_data.get('topic', 'Academic Research')}
- Abstract: {research_data.get('abstract')}
- Key Insights: {research_data.get('key_insights')}
- Conclusion: {research_data.get('final_summary')}
- Bibliography: {research_data.get('citations')}

Return ONLY the structured JSON. No preamble, no markdown code blocks.
"""
        user_prompt = "Generate a slide deck structure for this research."
        
        return self._call_llm(system_prompt, user_prompt)
