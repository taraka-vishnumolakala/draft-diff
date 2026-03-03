function DiffPane({ lastSentence }) {
  return (
    <div className="pane diff-pane">
      <div className="pane-card">
        <h2>Corrections</h2>
        {lastSentence && <p>{lastSentence}</p>}
      </div>
    </div>
  )
}

export default DiffPane
