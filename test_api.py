import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("====================================")
    print("Testing Vedanta AI Backend API...")
    print("====================================\n")

    # 1. Chat Component Normal Mode
    try:
        print("1. Testing Chatbot Component...")
        res = requests.post(f"{BASE_URL}/chat/", json={"prompt": "Hello!"}, timeout=10)
        assert res.status_code == 200
        chat_id = res.json().get("id")
        user_msg = res.json().get("messages")[0]["content"]
        assert chat_id is not None
        print(f"✅ Chat created successfully! ID: {chat_id}")
        print(f"✅ Got user prompt: '{user_msg}'")
    except Exception as e:
        print(f"❌ Chat Component failed: {e}")

    # 2. Chat Component Report Mode
    try:
        print("\n2. Testing Chatbot Report Generation Component...")
        res2 = requests.post(f"{BASE_URL}/chat/", json={"prompt": "Report on AI.", "chat_id": chat_id, "generate_report": True}, timeout=20)
        assert res2.status_code == 200
        report = res2.json().get("report")
        assert report is not None
        assert "summary" in report
        print(f"✅ Report successfully generated!")
        print(f"✅ Summary Snippet: {report['summary'][:50]}...")
    except Exception as e:
        print(f"❌ Chat Report mode failed: {e}")

    # 3. Paraphraser Component
    try:
        print("\n3. Testing Paraphrasing Component...")
        res3 = requests.post(f"{BASE_URL}/tools/paraphrase", json={"text": "I is a robot."}, timeout=10)
        assert res3.status_code == 200
        pt = res3.json().get("paraphrased_text")
        print(f"✅ Paraphrase active -> '{pt}'")
    except Exception as e:
        print(f"❌ Paraphraser Component failed: {e}")

    # 4. AI Detection Component
    try:
        print("\n4. Testing AI Detection Component...")
        res4 = requests.post(f"{BASE_URL}/tools/detect", json={"text": "This is entirely authentic human prose."}, timeout=10)
        assert res4.status_code == 200
        score = res4.json().get("score")
        print(f"✅ AI Detection score calculated -> {score}")
    except Exception as e:
        print(f"❌ AI Detection Component failed: {e}")

    # 5. History Component
    try:
        print("\n5. Testing History Database Link...")
        res5 = requests.get(f"{BASE_URL}/history/chats", timeout=5)
        assert res5.status_code == 200
        chats = res5.json()
        print(f"✅ History API working. Total stored chats: {len(chats)}")
    except Exception as e:
        print(f"❌ History Component failed: {e}")

if __name__ == "__main__":
    run_tests()
