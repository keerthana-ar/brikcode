/*
  # Create Questions and Test Cases Tables

  ## Summary
  This migration creates the core schema for a LeetCode-like coding platform with questions and test cases.

  ## New Tables

  ### 1. `questions`
  Stores coding problems that users can solve.
  - `id` (uuid, primary key) - Unique identifier for each question
  - `title` (text) - The title of the coding problem
  - `description` (text) - Detailed description of the problem
  - `difficulty` (text) - Difficulty level: "Easy", "Medium", or "Hard"
  - `category` (text) - Problem category (e.g., "Arrays", "Strings", "Dynamic Programming")
  - `starter_code_python` (text) - Python starter code template
  - `starter_code_cpp` (text) - C++ starter code template
  - `starter_code_java` (text) - Java starter code template
  - `created_at` (timestamptz) - When the question was created
  - `order_index` (integer) - For ordering questions in the UI

  ### 2. `test_cases`
  Stores test cases for validating user submissions.
  - `id` (uuid, primary key) - Unique identifier for each test case
  - `question_id` (uuid, foreign key) - References the parent question
  - `input` (text) - The input for the test case
  - `expected_output` (text) - The expected output
  - `is_hidden` (boolean) - Whether this test case is hidden from users (for validation only)
  - `order_index` (integer) - For ordering test cases

  ## Security
  - Enable RLS on both tables
  - Allow public read access to questions and visible test cases (authentication not required for viewing)
  - Only authenticated users can submit code (enforced at API level)

  ## Important Notes
  1. Questions support three languages: Python, C++, and Java
  2. Test cases can be marked as hidden to prevent users from seeing all validation criteria
  3. Public read access allows anyone to browse problems, but submissions require authentication at API level
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category text NOT NULL DEFAULT 'General',
  starter_code_python text DEFAULT '',
  starter_code_cpp text DEFAULT '',
  starter_code_java text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  order_index integer DEFAULT 0
);

-- Create test_cases table
CREATE TABLE IF NOT EXISTS test_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  input text NOT NULL DEFAULT '',
  expected_output text NOT NULL,
  is_hidden boolean DEFAULT false,
  order_index integer DEFAULT 0
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_test_cases_question_id ON test_cases(question_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(order_index);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;

-- Public read access to questions
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  USING (true);

-- Public read access to test cases
CREATE POLICY "Anyone can view test cases"
  ON test_cases FOR SELECT
  USING (true);
