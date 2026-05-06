import os, sys, traceback
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Load env
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

print("GROQ_API_KEY:", os.getenv("GROQ_API_KEY", "NOT SET")[:20] + "...")
print("GROQ_MODEL:", os.getenv("GROQ_MODEL", "NOT SET"))

try:
    from app.services.llm_service import llm_service
    print("\nTesting generate_report...")
    result = llm_service.generate_report("data science")
    print("SUCCESS!")
    print("Summary:", str(result.get("summary",""))[:200])
    print("Citations:", result.get("citations", []))
except Exception as e:
    print(f"\nFAILED: {e}")
    traceback.print_exc()
