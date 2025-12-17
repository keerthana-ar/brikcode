function QuestionDetail({ question, testCases, getDifficultyColor }) {
  if (!question) {
    return (
      <div className="question-detail">
        <p className="no-question">Select a problem to get started</p>
      </div>
    )
  }

  return (
    <div className="question-detail">
      <div className="question-header-info">
        <h2 className="question-title-large">{question.title}</h2>
        <span
          className="difficulty-badge-large"
          style={{ color: getDifficultyColor(question.difficulty) }}
        >
          {question.difficulty}
        </span>
      </div>

      <div className="question-meta">
        <span className="category-tag">{question.category}</span>
      </div>

      <div className="question-description">
        <h3>Description</h3>
        <p>{question.description}</p>
      </div>

      {testCases.length > 0 && (
        <div className="examples-section">
          <h3>Examples</h3>
          {testCases.slice(0, 2).map((testCase, index) => (
            <div key={testCase.id} className="example">
              <div className="example-header">Example {index + 1}</div>
              <div className="example-content">
                <div className="example-row">
                  <strong>Input:</strong>
                  <pre>{testCase.input || '(empty)'}</pre>
                </div>
                <div className="example-row">
                  <strong>Output:</strong>
                  <pre>{testCase.expected_output}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuestionDetail