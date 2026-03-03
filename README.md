# DraftDiff

**Write. Diff. Learn.**

DraftDiff is a writing editor where you type your raw thoughts on the left and see AI-corrected grammar diffs on the right — in real time, sentence by sentence.

You do the writing. You do the thinking. AI only shows you what you got wrong — and you decide what to learn from it.

## Why I'm Building This

AI should amplify your ability to express ideas, not replace the act of expression. Every sentence you write is a rep at the gym. DraftDiff makes sure your form is correct, but you're still lifting the weight.

The modern AI landscape wants you to stop writing. Autocomplete, generate, rephrase — and suddenly the words on screen aren't yours anymore. Your voice atrophies. Your ability to find the right word, structure an argument, or hold a thought long enough to finish it decays because you never exercise it. You become an editor of machine output instead of a writer of your own ideas.

I started this project because I refuse to let that happen. Writing is thinking made visible. When you struggle to put a sentence together, that struggle is the work — it's where clarity comes from. Outsource that to a machine and you don't get better, you just get dependent.

DraftDiff is my answer: keep writing, keep struggling, keep owning every word. Just let AI hold up a mirror so you can see where your grammar broke down and fix it yourself. The red pen, not the ghostwriter.

## How It Works

1. You write in the left pane
2. When you finish a sentence, it's sent to an AI for grammar-only corrections
3. A word-level diff appears in the right pane — red for what's wrong, green for the fix
4. Over time, you see the same corrections less and less

## Tech Stack

- **Frontend:** React (Vite), ProseMirror
- **Diff Engine:** diff (npm)
- **AI:** Anthropic API (Claude)
- **Backend:** Express.js proxy

## License

See [LICENSE](LICENSE).
