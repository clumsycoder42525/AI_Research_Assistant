from .base_agent import BaseAgent

class IdeaAgent(BaseAgent):
    def __init__(self):
        super().__init__("Idea Generator", "You are a creative research consultant that identifies research gaps and suggests future directions.")

    async def process(self, previous_output: dict, context: dict = None) -> dict:
        limitations = previous_output.get("limitations", "")
        
        system_prompt = f"""You are the {self.role}. 
Based on the identified limitations of current research, suggest:
- "research_gaps": Specific areas that need more investigation.
- "future_directions": Emerging trends or future study ideas.
- "innovation_ideas": Disruptive or novel ideas related to this topic.
"""
        user_prompt = f"Topic Limitations:\n{limitations}"
        
        return self._call_llm(system_prompt, user_prompt)

class CitationAgent(BaseAgent):
    def __init__(self):
        super().__init__("Citation Expert", "You are an expert in academic formatting and citations.")

    async def process(self, references: list, context: dict = None) -> dict:
        system_prompt = f"""You are the {self.role}. 
Convert the provided Wikipedia references into formal citations in APA, MLA, and IEEE formats.
Return a structured JSON with:
- "apa": List of APA citations.
- "mla": List of MLA citations.
- "ieee": List of IEEE citations.
"""
        user_prompt = f"References to format:\n{references}"
        
        return self._call_llm(system_prompt, user_prompt)
