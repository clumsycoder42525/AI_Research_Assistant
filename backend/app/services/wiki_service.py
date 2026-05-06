import urllib.request
import urllib.parse
import json

class WikiService:
    """Search Wikipedia and return summaries + URLs as real references."""
    
    BASE_URL = "https://en.wikipedia.org/api/rest_v1"
    SEARCH_URL = "https://en.wikipedia.org/w/api.php"

    @staticmethod
    def search(query, num_results=5):
        """Search Wikipedia for relevant articles and return summaries + links."""
        references = []
        try:
            # First attempt
            references = WikiService._perform_search(query, num_results)
            
            # Fallback for very specific queries
            if not references and " " in query:
                simpler_query = " ".join(query.split()[:2])
                print(f"No results for '{query}', trying simpler query: '{simpler_query}'")
                references = WikiService._perform_search(simpler_query, num_results)
                
        except Exception as e:
            print(f"Wikipedia Search Error: {e}")
        
        return references

    @staticmethod
    def _perform_search(query, num_results):
        references = []
        params = urllib.parse.urlencode({
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": num_results,
            "format": "json",
            "utf8": 1
        })
        url = f"{WikiService.SEARCH_URL}?{params}"
        req = urllib.request.Request(url, headers={"User-Agent": "VedantaAI/1.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
        
        results = data.get("query", {}).get("search", [])
        for item in results:
            title = item.get("title", "")
            page_url = f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
            summary = WikiService._get_summary(title)
            references.append({
                "title": title,
                "url": page_url,
                "snippet": summary or "Academic overview available at target URL."
            })
        return references

    @staticmethod
    def _get_summary(title):
        """Get a short summary for a Wikipedia article."""
        try:
            encoded = urllib.parse.quote(title)
            url = f"{WikiService.BASE_URL}/page/summary/{encoded}"
            req = urllib.request.Request(url, headers={"User-Agent": "VedantaAI/1.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode())
            return data.get("extract", "")[:300]
        except Exception:
            return ""

wiki_service = WikiService()
