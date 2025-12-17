import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import QuestionsList from './components/QuestionsList'
import CodeEditor from './components/CodeEditor'
import QuestionDetail from './components/QuestionDetail'
import OutputPanel from './components/OutputPanel'

function App() {
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [testCases, setTestCases] = useState([])
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('testcases')

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    if (selectedQuestion) {
      loadTestCases(selectedQuestion.id)
      const starterCode = getStarterCode(selectedQuestion, language)
      setCode(starterCode)
    }
  }, [selectedQuestion, language])

  const loadQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('order_index', { ascending: true })

    if (!error && data) {
      setQuestions(data)
      if (data.length > 0 && !selectedQuestion) {
        setSelectedQuestion(data[0])
      }
    }
  }

  const loadTestCases = async (questionId) => {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('question_id', questionId)
      .eq('is_hidden', false)
      .order('order_index', { ascending: true })

    if (!error && data) {
      setTestCases(data)
    }
  }

  const getStarterCode = (question, lang) => {
    switch (lang) {
      case 'python':
        return question.starter_code_python || '# Write your code here\n'
      case 'cpp':
        return question.starter_code_cpp || '// Write your code here\n'
      case 'java':
        return question.starter_code_java || '// Write your code here\n'
      default:
        return ''
    }
  }

  const handleRunCode = async () => {
    setLoading(true)
    setActiveTab('output')

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          source_code: code,
          stdin: ''
        })
      })

      const result = await response.json()
      setOutput({ type: 'run', data: result })
    } catch (error) {
      setOutput({ type: 'error', data: { message: error.message } })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitCode = async () => {
    setLoading(true)
    setActiveTab('output')

    try {
      const { data: allTestCases } = await supabase
        .from('test_cases')
        .select('*')
        .eq('question_id', selectedQuestion.id)
        .order('order_index', { ascending: true })

      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          source_code: code,
          test_cases: allTestCases.map(tc => ({
            input: tc.input,
            expected_output: tc.expected_output
          }))
        })
      })

      const results = await response.json()
      setOutput({ type: 'test', data: results })
    } catch (error) {
      setOutput({ type: 'error', data: { message: error.message } })
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return '#22c55e'
      case 'Medium':
        return '#f59e0b'
      case 'Hard':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">BrikCode</h1>
          <div className="header-actions">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="left-panel">
          <QuestionsList
            questions={questions}
            selectedQuestion={selectedQuestion}
            onSelectQuestion={setSelectedQuestion}
            getDifficultyColor={getDifficultyColor}
          />
        </div>

        <div className="right-panel">
          <div className="problem-section">
            <QuestionDetail
              question={selectedQuestion}
              testCases={testCases}
              getDifficultyColor={getDifficultyColor}
            />
          </div>

          <div className="editor-section">
            <CodeEditor
              language={language}
              code={code}
              onChange={setCode}
            />

            <div className="editor-actions">
              <button
                onClick={handleRunCode}
                disabled={loading}
                className="btn btn-secondary"
              >
                {loading ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            <OutputPanel
              output={output}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              testCases={testCases}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App