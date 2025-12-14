# BrikCode - Code Practice Platform

A modern LeetCode-like coding platform that allows users to practice coding problems with real-time code execution and test validation.

## Features

- **Question Browser**: Browse coding problems organized by difficulty and category
- **Multi-Language Support**: Write solutions in Python, C++, or Java
- **Monaco Code Editor**: Professional code editor with syntax highlighting
- **Real-Time Execution**: Run code and test against multiple test cases
- **Test Validation**: Submit solutions and see detailed test results
- **Modern UI**: Clean, dark-themed interface with responsive design

## Tech Stack

- **Frontend**: React + Vite
- **Code Editor**: Monaco Editor (VS Code editor)
- **Database**: Supabase (PostgreSQL)
- **Backend**: FastAPI (Python)
- **Code Execution**: Judge0 API

## Getting Started

### Backend Setup

1. Start the FastAPI backend:
```bash
cd app
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

3. Build for production:
```bash
npm run build
```

## Usage

1. **Select a Problem**: Choose from the list of coding problems on the left panel
2. **Choose Language**: Select your preferred programming language (Python, C++, or Java)
3. **Write Code**: Use the Monaco editor to write your solution
4. **Run Code**: Click "Run Code" to execute your code with custom input
5. **Submit**: Click "Submit" to test your solution against all test cases
6. **View Results**: See detailed test results including passed/failed tests, execution time, and memory usage

## Database Schema

The platform uses Supabase with the following tables:

- `questions`: Stores coding problems with descriptions, difficulty levels, and starter code
- `test_cases`: Stores test cases for each question with input/output pairs

## Sample Problems

The platform comes pre-loaded with classic coding problems:
- Two Sum (Easy)
- Palindrome Number (Easy)
- Reverse String (Easy)
- Valid Parentheses (Medium)
- Longest Palindromic Substring (Medium)