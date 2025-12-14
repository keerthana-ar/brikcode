function OutputPanel({ output, activeTab, setActiveTab, testCases }) {
  const renderRunOutput = (data) => {
    return (
      <div className="output-content">
        <div className="output-row">
          <span className="output-label">Status:</span>
          <span className={`status-badge ${data.status?.id === 3 ? 'success' : 'error'}`}>
            {data.status?.description || 'Error'}
          </span>
        </div>

        {data.stdout && (
          <div className="output-row">
            <span className="output-label">Output:</span>
            <pre className="output-code">{data.stdout}</pre>
          </div>
        )}

        {data.stderr && (
          <div className="output-row">
            <span className="output-label">Error:</span>
            <pre className="output-code error">{data.stderr}</pre>
          </div>
        )}

        {data.compile_output && (
          <div className="output-row">
            <span className="output-label">Compile Output:</span>
            <pre className="output-code">{data.compile_output}</pre>
          </div>
        )}

        <div className="output-stats">
          <span>Time: {data.time || 0}s</span>
          <span>Memory: {data.memory || 0} KB</span>
        </div>
      </div>
    )
  }

  const renderTestOutput = (results) => {
    const passedCount = results.filter(r => r.is_passed).length
    const totalCount = results.length

    return (
      <div className="test-results">
        <div className="test-summary">
          <h4>Test Results</h4>
          <span className={passedCount === totalCount ? 'success' : 'error'}>
            {passedCount} / {totalCount} tests passed
          </span>
        </div>

        <div className="test-cases-results">
          {results.map((result) => (
            <div
              key={result.test_case_id}
              className={`test-case-result ${result.is_passed ? 'passed' : 'failed'}`}
            >
              <div className="test-case-header">
                <span className="test-case-title">Test Case {result.test_case_id}</span>
                <span className={`test-status ${result.is_passed ? 'success' : 'error'}`}>
                  {result.is_passed ? '✓ Passed' : '✗ Failed'}
                </span>
              </div>

              <div className="test-case-details">
                {result.input && (
                  <div className="test-detail">
                    <strong>Input:</strong>
                    <pre>{result.input}</pre>
                  </div>
                )}

                <div className="test-detail">
                  <strong>Expected Output:</strong>
                  <pre>{result.expected_output}</pre>
                </div>

                <div className="test-detail">
                  <strong>Your Output:</strong>
                  <pre className={result.is_passed ? '' : 'error-output'}>
                    {result.actual_output || '(no output)'}
                  </pre>
                </div>

                <div className="test-stats">
                  <span>Time: {result.time}s</span>
                  <span>Memory: {result.memory} KB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="output-panel">
      <div className="output-tabs">
        <button
          className={`tab ${activeTab === 'testcases' ? 'active' : ''}`}
          onClick={() => setActiveTab('testcases')}
        >
          Test Cases
        </button>
        <button
          className={`tab ${activeTab === 'output' ? 'active' : ''}`}
          onClick={() => setActiveTab('output')}
        >
          Output
        </button>
      </div>

      <div className="output-body">
        {activeTab === 'testcases' && (
          <div className="testcases-view">
            {testCases.length > 0 ? (
              testCases.map((tc, index) => (
                <div key={tc.id} className="testcase-item">
                  <div className="testcase-header">Test Case {index + 1}</div>
                  <div className="testcase-content">
                    {tc.input && (
                      <div>
                        <strong>Input:</strong>
                        <pre>{tc.input}</pre>
                      </div>
                    )}
                    <div>
                      <strong>Expected Output:</strong>
                      <pre>{tc.expected_output}</pre>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No test cases available</p>
            )}
          </div>
        )}

        {activeTab === 'output' && (
          <div className="output-view">
            {output ? (
              output.type === 'run' ? (
                renderRunOutput(output.data)
              ) : output.type === 'test' ? (
                renderTestOutput(output.data)
              ) : (
                <div className="error-message">
                  <p>Error: {output.data?.message || 'Unknown error'}</p>
                </div>
              )
            ) : (
              <p className="no-data">Run your code to see output here</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OutputPanel
