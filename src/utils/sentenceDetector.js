// Sentence Boundary Detection
// Adapted from sbd (https://github.com/Tessmore/sbd) — MIT License
// Stripped to only what DraftDiff needs: no HTML, no sanitization, no phone/URL matching.

const abbreviations = [
  "al", "adj", "assn", "Ave",
  "BSc", "MSc",
  "Cell", "Ch", "Co", "cc", "Corp",
  "Dem", "Dept",
  "ed", "eg", "Eq", "Eqs", "est", "etc", "Ex", "ext",
  "Fig", "fig", "Figs", "figs",
  "i.e", "ie", "Inc", "inc",
  "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Sept", "Oct", "Nov", "Dec",
  "jr", "mi",
  "Miss", "Mrs", "Mr", "Ms",
  "Mol", "mt", "mts",
  "no", "Nos",
  "PhD", "MD", "BA", "MA", "MM",
  "pl", "pop", "pp",
  "Prof", "Dr",
  "pt", "Ref", "Refs", "Rep", "repr", "rev",
  "Sec", "Secs",
  "Sgt", "Col", "Gen", "Rep", "Sen", "Gov", "Lt", "Maj", "Capt", "St",
  "Sr", "sr", "Jr", "jr", "Rev",
  "Sun", "Mon", "Tu", "Tue", "Tues", "Wed", "Th", "Thu", "Thur", "Thurs", "Fri", "Sat",
  "trans", "Univ", "Viz", "Vol", "vs", "v",
]

// --- String helpers ---

function endsWithChar(word, c) {
  if (c.length > 1) {
    return c.indexOf(word.slice(-1)) > -1
  }
  return word.slice(-1) === c
}

function endsWith(word, end) {
  return word.slice(word.length - end.length) === end
}

// --- Match helpers ---

function isCapitalized(str) {
  return /^[A-Z][a-z].*/.test(str) || isNumber(str)
}

function isSentenceStarter(str) {
  return isCapitalized(str) || /``|"|'/.test(str.substring(0, 2))
}

function isCommonAbbreviation(str) {
  const noSymbols = str.replace(/[-'`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, "")
  return abbreviations.indexOf(noSymbols) > -1
}

function isTimeAbbreviation(word, next) {
  if (word === "a.m." || word === "p.m.") {
    const tmp = next.replace(/\W+/g, "").slice(-3).toLowerCase()
    if (tmp === "day") return true
  }
  return false
}

function isDottedAbbreviation(word) {
  const matches = word.replace(/[\(\)\[\]\{\}]/g, "").match(/(.\.)*/);
  return matches && matches[0].length > 0
}

function isCustomAbbreviation(str) {
  if (str.length <= 3) return true
  return isCapitalized(str)
}

function isNameAbbreviation(wordCount, words) {
  if (words.length > 0) {
    if (wordCount < 5 && words[0].length < 6 && isCapitalized(words[0])) {
      return true
    }
    const capitalized = words.filter((str) => /[A-Z]/.test(str.charAt(0)))
    return capitalized.length >= 3
  }
  return false
}

function isNumber(str, dotPos) {
  if (dotPos) {
    str = str.slice(dotPos - 1, dotPos + 2)
  }
  return !isNaN(str)
}

function isConcatenated(word) {
  let i = 0
  if (
    (i = word.indexOf(".")) > -1 ||
    (i = word.indexOf("!")) > -1 ||
    (i = word.indexOf("?")) > -1
  ) {
    const c = word.charAt(i + 1)
    if (c.match(/[a-zA-Z].*/)) {
      return [word.slice(0, i), word.slice(i + 1)]
    }
  }
  return false
}

function isBoundaryChar(word) {
  return word === "." || word === "!" || word === "?"
}

// --- Main tokenizer ---

const splitIntoWords = /\S+|\n/g

export function sentences(text, options = {}) {
  if (!text || typeof text !== "string" || !text.length) return []
  if (!/\S/.test(text)) return []

  const newlineBoundaries = options.newline_boundaries || false
  const newlinePlaceholder = " @~@ "
  const newlinePlaceholderTrimmed = newlinePlaceholder.trim()

  if (newlineBoundaries) {
    text = text.replace(/\n+|[-#=_+*]{4,}/g, newlinePlaceholder)
  }

  const words = text.trim().match(splitIntoWords)
  if (!words || !words.length) return []

  let wordCount = 0
  let index = 0
  let temp
  let sentencesList = []
  let current = []

  for (let i = 0, L = words.length; i < L; i++) {
    wordCount++
    current.push(words[i])

    // Sub-sentences, reset counter
    if (~words[i].indexOf(",")) {
      wordCount = 0
    }

    if (isBoundaryChar(words[i]) || endsWithChar(words[i], "?!") || words[i] === newlinePlaceholderTrimmed) {
      if (newlineBoundaries && words[i] === newlinePlaceholderTrimmed) {
        current.pop()
      }
      sentencesList.push(current)
      wordCount = 0
      current = []
      continue
    }

    if (endsWithChar(words[i], '"') || endsWithChar(words[i], "\u201D")) {
      words[i] = words[i].slice(0, -1)
    }

    // A dot might indicate end of sentence
    if (endsWithChar(words[i], ".")) {
      if (i + 1 < L) {
        // Single character abbr.
        if (words[i].length === 2 && isNaN(words[i].charAt(0))) continue

        // Common abbreviation
        if (isCommonAbbreviation(words[i])) continue

        // Skip ellipsis
        if (endsWith(words[i], "..")) continue

        if (isSentenceStarter(words[i + 1])) {
          if (isTimeAbbreviation(words[i], words[i + 1])) continue
          if (isNameAbbreviation(wordCount, words.slice(i, 6))) continue
          if (isNumber(words[i + 1])) {
            if (isCustomAbbreviation(words[i])) continue
          }
        } else {
          // Skip dotted abbreviations only when next word is not capitalized
          if (isDottedAbbreviation(words[i])) continue
          if (isNameAbbreviation(wordCount, words.slice(i, 5))) continue
        }
      }

      sentencesList.push(current)
      current = []
      wordCount = 0
      continue
    }

    // Check if word has a dot in it
    if ((index = words[i].indexOf(".")) > -1) {
      if (isNumber(words[i], index)) continue
      if (isDottedAbbreviation(words[i])) continue
    }

    if ((temp = isConcatenated(words[i]))) {
      current.pop()
      current.push(temp[0])
      sentencesList.push(current)
      current = []
      wordCount = 0
      current.push(temp[1])
    }
  }

  if (current.length) {
    sentencesList.push(current)
  }

  // Filter empty sentences
  sentencesList = sentencesList.filter((s) => s.length > 0)

  // Merge single-word enumeration items with the next sentence
  const result = sentencesList.slice(1).reduce((out, sentence) => {
    const lastSentence = out[out.length - 1]
    if (lastSentence.length === 1 && /^.{1,2}[.]$/.test(lastSentence[0])) {
      if (!/[.]/.test(sentence[0])) {
        out.pop()
        out.push(lastSentence.concat(sentence))
        return out
      }
    }
    out.push(sentence)
    return out
  }, [sentencesList[0]])

  return result.map((sentence) => sentence.join(" "))
}
