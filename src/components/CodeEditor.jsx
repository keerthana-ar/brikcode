import Editor from '@monaco-editor/react'

function CodeEditor({ language, code, onChange }) {
  const languageMap = {
    python: 'python',
    cpp: 'cpp',
    java: 'java'
  }

  return (
    <div className="code-editor">
      <Editor
        height="400px"
        language={languageMap[language]}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  )
}

export default CodeEditor
