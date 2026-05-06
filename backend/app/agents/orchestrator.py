from .literature_agent import LiteratureFinderAgent
from .analysis_agents import SummarizerAgent, AnalysisAgent
from .innovation_agents import IdeaAgent, CitationAgent
from .refiner_agent import RefinerAgent
import asyncio

class ResearchOrchestrator:
    def __init__(self):
        self.finder = LiteratureFinderAgent()
        self.summarizer = SummarizerAgent()
        self.analyzer = AnalysisAgent()
        self.idea_gen = IdeaAgent()
        self.citation_expert = CitationAgent()
        self.refiner = RefinerAgent()

    async def run_deep_research(self, topic: str, mode: str = "deep"):
        """
        Runs a sequential multi-agent pipeline for research.
        Each agent consumes the output of the previous one and adjusts behavior based on mode.
        """
        results = {
            "topic": topic,
            "mode": mode,
            "status": "Initializing research node...",
            "steps": []
        }

        context = {"mode": mode, "topic": topic}

        # Step 1: Literature Finding
        results["status"] = "Literature Finder: Searching Wikipedia..."
        lit_findings = await self.finder.process(topic, context=context)
        results["steps"].append({"agent": "Literature Finder", "data": lit_findings})
        
        # Step 2: Summarization
        results["status"] = "Summarizer: Synthesizing abstract..."
        summary = await self.summarizer.process(lit_findings, context=context)
        results["steps"].append({"agent": "Summarizer", "data": summary})

        # Step 3: Critical Analysis
        results["status"] = "Analyzer: Evaluating facts and limitations..."
        analysis = await self.analyzer.process(summary, context=context)
        results["steps"].append({"agent": "Critical Analyzer", "data": analysis})

        # Step 4: Idea Generation
        results["status"] = "Idea Generator: Finding research gaps..."
        ideas = await self.idea_gen.process(analysis, context=context)
        results["steps"].append({"agent": "Idea Generator", "data": ideas})

        # Step 5: Citation Formatting
        results["status"] = "Citation Expert: Formatting references..."
        citations = await self.citation_expert.process(lit_findings.get("references", []), context=context)
        results["steps"].append({"agent": "Citation Expert", "data": citations})

        # Step 6: Final Refinement
        results["status"] = "Final Refiner: Polishing academic tone..."
        refinement_input = {
            "abstract": summary.get("abstract"),
            "key_insights": summary.get("key_insights"),
            "research_gaps": ideas.get("research_gaps"),
            "pro_arguments": analysis.get("pro_arguments"),
            "con_arguments": analysis.get("con_arguments")
        }
        refined = await self.refiner.process(refinement_input, context=context)
        results["steps"].append({"agent": "Final Refiner", "data": refined})

        results["status"] = "Completed"
        results["final_report"] = {
            "abstract": refined.get("polished_abstract", summary.get("abstract")),
            "literature_review": summary.get("literature_review"),
            "key_insights": refined.get("refined_insights", summary.get("key_insights")),
            "strengths": analysis.get("strengths"),
            "limitations": analysis.get("limitations"),
            "pro_arguments": refined.get("refined_pro", analysis.get("pro_arguments")),
            "con_arguments": refined.get("refined_con", analysis.get("con_arguments")),
            "research_gaps": refined.get("sharp_gaps", ideas.get("research_gaps")),
            "final_summary": refined.get("final_summary"),
            "citations": citations
        }
        
        return results
