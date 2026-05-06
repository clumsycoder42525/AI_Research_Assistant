import re
import json

def clean_ai_string(value):
    """
    Enforces string type, normalizes spacing, and removes malformed punctuation artifacts.
    """
    if value is None:
        return ""
    
    # Enforce string type
    if isinstance(value, (list, dict)):
        try:
            # If it's a list of strings, just join them
            if isinstance(value, list) and all(isinstance(x, str) for x in value):
                text = "\n".join(value)
            else:
                text = json.dumps(value)
        except:
            text = str(value)
    else:
        text = str(value)

    # 1. Normalize spacing but PRESERVE newlines
    text = re.sub(r'[ \t\r\f\v]+', ' ', text)
    
    # 2. Remove malformed punctuation (e.g., redundant dots .. or trailing commas)
    # 3+ dots become ellipsis, 2 dots become a single dot
    text = re.sub(r'\.{2,}', lambda m: '...' if len(m.group(0)) >= 3 else '.', text)
    # Handle mixed punctuation like ., or ,.
    text = re.sub(r',\.', '.', text) 
    text = re.sub(r'\.,', '.', text)
    
    # 2.5 Remove spaces before punctuation
    text = re.sub(r'\s+([,\.])', r'\1', text)
    text = text.strip()




    
    # 3. Strip unwanted control characters
    text = "".join(char for char in text if ord(char) >= 32 or char in "\n\r\t")
    
    return text

def validate_response_format(data):
    """
    Ensures final response always has a safe 'output' key.
    """
    if not isinstance(data, dict):
        return {"output": clean_ai_string(data)}
    
    if "output" not in data and "content" in data:
        data["output"] = clean_ai_string(data["content"])
    elif "output" not in data:
        data["output"] = "Unable to generate structured output. Please try again."
    
    return data
