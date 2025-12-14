function QuestionsList({ questions, selectedQuestion, onSelectQuestion, getDifficultyColor }) {
  return (
    <div className="questions-list">
      <div className="questions-header">
        <h2>Problems</h2>
        <span className="problems-count">{questions.length} problems</span>
      </div>

      <div className="questions-items">
        {questions.map((question) => (
          <div
            key={question.id}
            className={`question-item ${selectedQuestion?.id === question.id ? 'active' : ''}`}
            onClick={() => onSelectQuestion(question)}
          >
            <div className="question-item-header">
              <span className="question-title">{question.title}</span>
              <span
                className="difficulty-badge"
                style={{ color: getDifficultyColor(question.difficulty) }}
              >
                {question.difficulty}
              </span>
            </div>
            <span className="question-category">{question.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionsList
