import './App.css'
import EditorPane from './components/EditorPane'
import DiffPane from './components/DiffPane'
import VocabPane from './components/VocabPane'

function App() {
  return (
    <div className="app">
      <EditorPane />
      <div className="right-column">
        <DiffPane />
        <VocabPane />
      </div>
    </div>
  )
}

export default App
