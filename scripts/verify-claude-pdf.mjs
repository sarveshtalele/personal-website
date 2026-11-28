#!/usr/bin/env node
/**
 * Faithfulness check for the question-bank PDFs. Re-reads the text of both
 * PDFs and confirms, for every question in the source data:
 *   - its ID, full question text, and explanation appear verbatim
 *   - the Study edition states the right answer right after it
 *   - the Practice edition's answer key lists the right letter
 * Fails the build if anything is missing or wrong.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const questions = JSON.parse(readFileSync(join(ROOT, 'public/claude/review/questions.json'), 'utf8'));

// Strip inline markdown and whitespace so wrapped lines compare equal.
const norm = (s) => s.replace(/[`*]/g, '').replace(/\s+/g, '');

async function text(file) {
  const pdf = await getDocument({ data: new Uint8Array(readFileSync(file)), verbosity: 0 }).promise;
  let out = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    out += tc.items.map((it) => it.str).join(' ') + '\n';
  }
  return { out, pages: pdf.numPages };
}

const problems = [];
for (const edition of ['study', 'practice']) {
  const file = join(ROOT, `public/claude/downloads/ccar-f-practice-questions-${edition}.pdf`);
  const { out, pages } = await text(file);
  const flat = norm(out);
  let checked = 0;
  for (const q of questions) {
    const id = q.id;
    if (!flat.includes(norm(q.stem))) problems.push(`${edition}: ${id} question text not found`);
    if (!flat.includes(norm(q.explanation))) problems.push(`${edition}: ${id} explanation not found`);
    for (const L of ['A', 'B', 'C', 'D']) {
      if (!flat.includes(norm(q.options[L]))) problems.push(`${edition}: ${id} option ${L} not found`);
    }
    if (edition === 'study') {
      // "D1-Q01 · Task …" header, then later "Answer: X" before the explanation.
      const at = flat.indexOf(norm(q.stem));
      const ans = flat.indexOf('Answer:', at);
      if (at < 0 || ans < 0 || flat[ans + 7] !== q.answer) problems.push(`study: ${id} answer is not ${q.answer}`);
    } else if (!flat.includes(`${id}${q.answer}`)) {
      problems.push(`practice: ${id} answer key entry is not ${q.answer}`);
    }
    checked++;
  }
  console.log(`  ${edition}: ${pages} pages, ${checked} questions checked`);
}

if (problems.length) {
  console.error(`✖ PDF verification failed (${problems.length}):\n  ${problems.slice(0, 30).join('\n  ')}`);
  process.exit(1);
}
console.log(`✔ PDFs verified: all ${questions.length} questions, options, answers, and explanations match the source`);
