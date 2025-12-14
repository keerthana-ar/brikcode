from pydantic import BaseModel, Field
from typing import List, Optional

class TestCase(BaseModel):
    """Defines a single test case for validation."""
    input: str = Field(..., description="The standard input (stdin) for this test case.")
    expected_output: str = Field(..., description="The expected stdout for this test case.")

class CodeSubmission(BaseModel):
    """Defines the code, language, and the standard single stdin (for simple run mode)."""
    language: str      # "python", "cpp", "java"
    source_code: str
    stdin: str = ""    # Kept for the simple "Run Code" button (custom input)

class TestSubmission(BaseModel):
    """Defines a submission for a full test suite."""
    language: str
    source_code: str
    test_cases: List[TestCase]

class TestResult(BaseModel):
    """Defines the result for a single test case execution."""
    test_case_id: int
    input: str
    expected_output: str
    actual_output: Optional[str] = None
    status_description: str
    is_passed: bool
    time: float
    memory: float