from .llm_service import llm_service

class ToolService:
    @staticmethod
    async def execute_tool_chat(tool_id: str, message: str) -> str:
        """
        Executes a simulated or actual tool logic based on the tool_id.
        """
        if tool_id == "paraphraser":
            return llm_service.paraphrase(message, "Casual") # Default to casual for chat
        
        elif tool_id == "ai_detector":
            res = llm_service.ai_detection(message)
            return f"AI Score: {res.get('score', 0)}\nExplanation: {res.get('explanation', 'No explanation provided.')}"
        
        elif tool_id == "scholar":
            # For scholarship tool, we can provide a quick research summary
            return f"Scholar Node: Analyzing '{message}'... I recommend searching for recent literature on this topic using the Deep Research pipeline for better results."
        
        else:
            # Generic tool execution fallback
            return f"The tool '{tool_id}' received your input: '{message}'. Processing logic is being initialized."

tool_service = ToolService()
