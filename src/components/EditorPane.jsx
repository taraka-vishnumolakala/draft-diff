import { useState } from 'react'

function EditorPane() {
  const [text, setText] = useState('')

  // trim() removes leading/trailing whitespace, then split(/\s+/) splits on
  // one or more whitespace characters (spaces, tabs, newlines) into an array
  // of words. Empty string check avoids [''].length returning 1 on blank input.
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length

  return (
    <div className="pane editor-pane">
      <div className="pane-card editor-card">
        <textarea
          className="editor-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing..."
        />
        <div className="editor-footer">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        </div>
      </div>
    </div>
  )
}

export default EditorPane
