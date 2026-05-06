from .base_agent import BaseAgent

class RefinerAgent(BaseAgent):
    def __init__(self):
        super().__init__("Final Refiner", "You are a senior academic editor dedicated to sharpening research reports, ensuring they are concise, formal, and insightful.")

    async def process(self, previous_output: dict, context: dict = None) -> dict:
        abstract = previous_output.get("abstract", "")
        insights = previous_output.get("key_insights", "")
        gaps = previous_output.get("research_gaps", "")
        pro = previous_output.get("pro_arguments", "")
        con = previous_output.get("con_arguments", "")
        mode = context.get("mode", "deep") if context else "deep"

        mode_instruction = ""
        if mode == "quick":
            mode_instruction = "Keep all outputs extremely concise (2 paragraphs max for abstract, 50 words max for summary)."
        elif mode == "debate":
            mode_instruction = "IMPORTANT: Focus on making the 'Favour' (Pro) and 'Against' (Con) arguments sharp, balanced, and intellectually rigorous."

        system_prompt = f"""You are the {self.role}. 
Your goal is to refine the final research report.
1. Remove any repetitive sentences.
2. Sharpen the academic tone.
3. Ensure the transition between sections is smooth.
4. Improve the clarity of the research gaps.
{mode_instruction}

Return a structured JSON with:
- "polished_abstract": The refined abstract.
- "refined_insights": The sharpened key insights.
- "refined_pro": The sharpened 'Favour' arguments.
- "refined_con": The sharpened 'Against' arguments.
- "sharp_gaps": The clarified research gaps.
- "final_summary": A one-paragraph executive summary.
"""
        user_prompt = f"Original Abstract:\n{abstract}\n\nKey Insights:\n{insights}\n\nFavour Arguments:\n{pro}\n\nAgainst Arguments:\n{con}\n\nResearch Gaps:\n{gaps}"
        
        return self._call_llm(system_prompt, user_prompt)
