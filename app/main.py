from fastapi import FastAPI, HTTPException
from app.schemas import CodeSubmission, TestSubmission, TestResult
from app.judge import run_code, run_test_suite
from typing import List

app = FastAPI(title="BrikCode Runner")

@app.post("/run")
def execute(submission: CodeSubmission):
    try:
        result = run_code(
            submission.language,
            submission.source_code,
            submission.stdin
        )
        return result
    except KeyError:
        raise HTTPException(status_code=400, detail="Unsupported language")

@app.post("/test", response_model=List[TestResult])
def test_suite(submission: TestSubmission):
    try:
        results = run_test_suite(
            submission.language,
            submission.source_code,
            submission.test_cases
        )
        return results
    except KeyError:
        raise HTTPException(status_code=400, detail="Unsupported language")


@app.get("/")
def home():
    return {"message": "BrikCode Runner is live!"}
