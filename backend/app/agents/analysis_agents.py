from .base_agent import BaseAgent

class SummarizerAgent(BaseAgent):
    def __init__(self):
        super().__init__("Summarizer", "You are an expert academic summarizer that synthesizes complex findings into structured abstracts.")

    async def process(self, previous_output: dict, context: dict = None) -> dict:
        findings = previous_output.get("findings", [])
        topic_context = previous_output.get("context", "")
        mode = context.get("mode", "deep") if context else "deep"
        
        length_constraint = "Ensure the abstract is concise, 2-paragraph max." if mode == "quick" else "Create a cohesive, 200-word academic summary."
        
        system_prompt = f"""You are the {self.role}. 
Your goal is to take the raw findings from the Literature Finder and create a cohesive, academic summary and key insights.
{length_constraint}

Return a structured JSON with:
- "abstract": A formal abstract of the topic (stick to length constraints).
- "literature_review": A narrative review of the findings.
- "key_insights": A list of the most important takeaways.
"""
        user_prompt = f"Findings to summarize:\n{findings}\n\nContext:\n{topic_context}"
        
        return self._call_llm(system_prompt, user_prompt)

class AnalysisAgent(BaseAgent):
    def __init__(self):
        super().__init__("Critical Analyzer", "You are a critical academic reviewer that identifies strengths, weaknesses, and limitations in research.")

    async def process(self, previous_output: dict, context: dict = None) -> dict:
        abstract = previous_output.get("abstract", "")
        review = previous_output.get("literature_review", "")
        mode = context.get("mode", "deep") if context else "deep"
        
        debate_instruction = ""
        if mode == "debate":
            debate_instruction = "IMPORTANT: Focus heavily on 'pro_arguments' and 'con_arguments'. Contrast opposing viewpoints clearly."

        system_prompt = f"""You are the {self.role}. 
Analyze the summarized research and identify:
- "strengths": What are the strongest points or proven facts?
- "limitations": What are the missing links or weak points in current knowledge?
- "pro_arguments": Critical arguments in favor of the topic's main theories (Favour).
- "con_arguments": Critical arguments against the topic's main theories (Against).

{debate_instruction}
Ensure "pro_arguments" and "con_arguments" are academically grounded, distinct from each other, and formatted as clear, concise points.
"""
        user_prompt = f"Research to analyze:\n{abstract}\n\nReview:\n{review}"
        
        return self._call_llm(system_prompt, user_prompt)
