import { useState, useRef } from 'react'
import './App.css'
import EditorPane from './components/EditorPane'
import DiffPane from './components/DiffPane'
import VocabPane from './components/VocabPane'
import { sentences } from './utils/sentenceDetector'

function App() {
  const [text, setText] = useState('')
  const [lastSentence, setLastSentence] = useState('')
  const prevCompletedCount = useRef(0)

  function handleTextChange(newText) {
    setText(newText)

    const detected = sentences(newText)
    // A sentence is "completed" if it ends with terminal punctuation
    const completed = detected.filter((s) => /[.!?]$/.test(s.trim()))

    if (completed.length > prevCompletedCount.current) {
      setLastSentence(completed[completed.length - 1])
    }
    prevCompletedCount.current = completed.length
  }

  return (
    <div className="app">
      <EditorPane text={text} onTextChange={handleTextChange} />
      <div className="right-column">
        <DiffPane lastSentence={lastSentence} />
        <VocabPane />
      </div>
    </div>
  )
}

export default App
