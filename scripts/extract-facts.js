const fs = require('fs')
const path = require('path')

// This script expects a .docx file path as the first arg; if omitted it looks for
// ~/Downloads/Real and fake bug facts.docx

const mammoth = require('mammoth')

async function run() {
  const defaultPath = path.join(require('os').homedir(), 'Downloads', 'Real and fake bug facts.docx')
  const docxPath = process.argv[2] || defaultPath

  if (!fs.existsSync(docxPath)) {
    console.error('Docx file not found at', docxPath)
    process.exit(2)
  }

  try {
    const result = await mammoth.extractRawText({ path: docxPath })
    const text = result.value
    // Split into paragraphs and filter out short/empty lines
    const paragraphs = text
      .split(/\r?\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 10)

    // Deduplicate and keep order
    const seen = new Set()
    const facts = paragraphs.filter((p) => {
      if (seen.has(p)) return false
      seen.add(p)
      return true
    })

    const outPath = path.join(process.cwd(), 'src', 'facts.json')
    fs.writeFileSync(outPath, JSON.stringify(facts, null, 2), 'utf8')
    console.log('Wrote', facts.length, 'facts to', outPath)
  } catch (err) {
    console.error('Error extracting docx:', err)
    process.exit(1)
  }
}

run()
