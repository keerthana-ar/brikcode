import requests
import base64
from app.config import (
    ATD_API_KEY,
    ATD_SUBMISSIONS_URL,
    ATD_APIHUB_HOST,
    ATD_APIHUB_ENDPOINT
)
from app.schemas import TestCase, TestResult
from typing import List

HEADERS = {
    "x-apihub-key": ATD_API_KEY,
    "x-apihub-host": ATD_APIHUB_HOST,
    "x-apihub-endpoint": ATD_APIHUB_ENDPOINT,
    "Content-Type": "application/json"
}

LANG_MAP = {
    "python": 71,  # Python 3
    "cpp": 54,     # C++17
    "java": 62     # Java
}

def b64(text: str) -> str:
    return base64.b64encode(text.encode()).decode()

def safe_b64_decode(encoded_text: str | None) -> str | None:
    if encoded_text is not None and isinstance(encoded_text, str):
        try:
            return base64.b64decode(encoded_text).decode('utf-8').strip()
        except base64.binascii.Error:
            # Handle cases where the string might not be valid Base64
            return f"[Decoding Error: Invalid Base64 String: {encoded_text}]"
    return encoded_text

def run_code(language: str, source_code: str, stdin: str = ""):
    payload = {
        "language_id": LANG_MAP[language],
        "source_code": b64(source_code),
        "stdin": b64(stdin)
    }

    response = requests.post(
        ATD_SUBMISSIONS_URL,
        headers=HEADERS,
        params={
            "base64_encoded": "true",
            "wait": "true"
        },
        json=payload
    )

    result = response.json()

    decode_fields = ["stdout", "stderr", "compile_output", "message"]

    for field in decode_fields:
        if field in result:
            result[field] = safe_b64_decode(result[field])

    return result

def run_test_suite(language: str, source_code: str, test_cases: List[TestCase]) -> List[TestResult]:
    
    final_results = []
    
    for i, case in enumerate(test_cases):
        # 1. Execute code for this single test case
        judge_output = run_code(language, source_code, case.input)
        
        # 2. Check if the execution was successful (Status ID 3 = Accepted)
        is_accepted = judge_output.get("status", {}).get("id") == 3
        
        # 3. Get the actual output, stripping whitespace for strict comparison
        actual_output = judge_output.get("stdout", "").strip()
        expected_output_clean = case.expected_output.strip()
        
        # 4. Determine if the test passed
        is_passed = is_accepted and (actual_output == expected_output_clean)
        
        # 5. Build the final TestResult object
        final_results.append(
            TestResult(
                test_case_id=i + 1,
                input=case.input,
                expected_output=case.expected_output,
                actual_output=actual_output,
                status_description=judge_output.get("status", {}).get("description", "Execution Error"),
                is_passed=is_passed,
                time=float(judge_output.get("time", 0.0)),
                memory=float(judge_output.get("memory", 0.0))
            )
        )
        
    return final_results