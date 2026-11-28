#!/usr/bin/env node
/**
 * Builds two downloadable PDFs of the Claude CCAR-F question bank from the
 * same compiled data the website uses (public/claude/review/*.json, produced by
 * build-claude-data.mjs from content/claude/questions/*.md):
 *
 *   public/claude/downloads/ccar-f-practice-questions-study.pdf     answers inline
 *   public/claude/downloads/ccar-f-practice-questions-practice.pdf  answer key at the back
 *
 * Nothing is rewritten or summarised: every stem, option, explanation and doc
 * link is copied verbatim. scripts/verify-claude-pdf.mjs then re-reads both
 * files and checks every question made it in, with the right answer.
 */
import PDFDocument from 'pdfkit';
import { readFileSync, mkdirSync, createWriteStream } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/claude/downloads');
const FONT_DIR = join(dirname(require.resolve('dejavu-fonts-ttf/package.json')), 'ttf');
const FONTS = {
  regular: join(FONT_DIR, 'DejaVuSans.ttf'),
  bold: join(FONT_DIR, 'DejaVuSans-Bold.ttf'),
  italic: join(FONT_DIR, 'DejaVuSans-Oblique.ttf'),
  mono: join(FONT_DIR, 'DejaVuSansMono.ttf'),
};
const C = { ink: '#2a1d14', muted: '#5c4838', faint: '#8a7562', brown: '#6b4226', gold: '#a67c3d', line: '#e3d6c0', soft: '#f6f0e4', good: '#3f6b3f' };
const SITE = 'https://sarveshtalele.org';
const LETTERS = ['A', 'B', 'C', 'D'];

const questions = JSON.parse(readFileSync(join(ROOT, 'public/claude/review/questions.json'), 'utf8'));
const concepts = JSON.parse(readFileSync(join(ROOT, 'public/claude/review/concepts.json'), 'utf8'));
// Scenario names come from the exam guide so the PDF and site agree.
const examMd = readFileSync(join(ROOT, 'content/claude/exams/foundations.md'), 'utf8');
const scenarioBlock = examMd.match(/^scenarios:\n((?:\s+- .+\n)+)/m)?.[1] ?? '';
const SCENARIOS = [...scenarioBlock.matchAll(/- (.+)/g)].map((m) => m[1].split(',')[0].trim());

const domains = [...new Set(questions.map((q) => q.domain))].sort((a, b) => a - b).map((d) => {
  const cs = concepts.filter((c) => c.domain === d);
  return {
    n: d,
    name: cs[0]?.domainName ?? `Domain ${d}`,
    weight: cs[0]?.weight ?? '',
    concepts: cs,
    questions: questions.filter((q) => q.domain === d),
  };
});
const today = new Date().toISOString().slice(0, 10);

/* ---------------------------------------------------------------------- */
/* Inline markdown (`code`, **bold**, *italic*) → styled runs               */
/* ---------------------------------------------------------------------- */
function runs(text) {
  const out = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ t: text.slice(last, m.index), f: 'regular' });
    const tok = m[0];
    if (tok.startsWith('`')) out.push({ t: tok.slice(1, -1), f: 'mono' });
    else if (tok.startsWith('**')) out.push({ t: tok.slice(2, -2), f: 'bold' });
    else out.push({ t: tok.slice(1, -1), f: 'italic' });
    last = m.index + tok.length;
  }
  if (last < text.length) out.push({ t: text.slice(last), f: 'regular' });
  return out.length ? out : [{ t: text, f: 'regular' }];
}

function build(edition, tocPages) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 64, bottom: 72, left: 64, right: 64 },
    bufferPages: true,
    info: {
      Title: `CCAR-F Practice Questions (${edition === 'study' ? 'Study' : 'Practice'} Edition)`,
      Author: 'Sarvesh Talele',
      Subject: 'Unofficial practice questions for Claude Certified Architect, Foundations (CCAR-F)',
      Keywords: 'Claude, Anthropic, CCAR-F, certification, practice questions',
    },
  });
  for (const [k, v] of Object.entries(FONTS)) doc.registerFont(k, v);
  const W = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const X = doc.page.margins.left;
  const starts = {}; // section key -> page number (1-based)
  const page = () => doc.bufferedPageRange().start + doc.bufferedPageRange().count;

  const para = (text, { size = 10.5, color = C.ink, gap = 4, indent = 0, lineGap = 2.5 } = {}) => {
    const rs = runs(text);
    // pdfkit keeps one line wrapper across `continued` runs only if later runs
    // pass no position or width, so only the first run sets them.
    rs.forEach((r, i) => {
      doc.font(r.f).fontSize(r.f === 'mono' ? size - 1 : size).fillColor(color);
      const opts = { continued: i < rs.length - 1, lineGap };
      if (i === 0) doc.text(r.t, X + indent, doc.y, { ...opts, width: W - indent });
      else doc.text(r.t, opts);
    });
    doc.moveDown(gap / 10);
  };
  const ensure = (h) => {
    if (doc.y + h > doc.page.height - doc.page.margins.bottom) doc.addPage();
  };
  const rule = (color = C.line) => {
    doc.moveTo(X, doc.y).lineTo(X + W, doc.y).lineWidth(0.7).strokeColor(color).stroke();
    doc.moveDown(0.6);
  };

  /* ---- cover ---- */
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(C.soft);
  doc.rect(0, 0, doc.page.width, 12).fill(C.brown);
  doc.font('bold').fontSize(11).fillColor(C.gold).text('CLAUDE CERTIFIED ARCHITECT · FOUNDATIONS (CCAR-F)', X, 150, { width: W, characterSpacing: 1.5 });
  doc.moveDown(1);
  doc.font('bold').fontSize(34).fillColor(C.ink).text(`${questions.length} Practice Questions`, { width: W });
  doc.font('regular').fontSize(20).fillColor(C.brown).text(edition === 'study' ? 'Study Edition' : 'Practice Edition', { width: W });
  doc.moveDown(1.2);
  doc.font('regular').fontSize(12).fillColor(C.muted).text(
    edition === 'study'
      ? 'Every question is followed by the correct answer, why it is right, why each other option is wrong, and the Claude documentation page to read.'
      : 'Questions only, so you can test yourself. The answer key with full explanations is at the back.',
    { width: W * 0.85, lineGap: 3 },
  );
  doc.moveDown(2);
  const facts = [
    [String(questions.length), 'questions'],
    [String(domains.length), 'exam domains'],
    [String(concepts.length), 'task statements'],
    [String(questions.filter((q) => q.docUrl).length), 'doc links'],
  ];
  let fx = X;
  const fy = doc.y;
  for (const [v, l] of facts) {
    doc.font('bold').fontSize(22).fillColor(C.brown).text(v, fx, fy, { width: 110 });
    doc.font('regular').fontSize(9.5).fillColor(C.muted).text(l, fx, fy + 28, { width: 110 });
    fx += 118;
  }
  doc.font('regular').fontSize(11).fillColor(C.ink).text('By Sarvesh Talele', X, 600, { width: W });
  doc.fillColor(C.brown).text(`${SITE}/claude`, { width: W, link: `${SITE}/claude`, underline: true });
  doc.fillColor(C.faint).fontSize(9.5).text(`Generated ${today} from the same question bank as the website.`, { width: W });
  doc.roundedRect(X, 680, W, 70, 8).lineWidth(0.8).strokeColor(C.gold).stroke();
  doc.font('bold').fontSize(9.5).fillColor(C.brown).text('Unofficial practice material.', X + 14, 692, { width: W - 28, continued: true });
  doc.font('regular').fillColor(C.muted).text(
    ' These are original questions written to help you study. They are not real exam questions and are not affiliated with or endorsed by Anthropic. Always check the current official exam guide.',
    { width: W - 28, lineGap: 2 },
  );

  /* ---- contents ---- */
  doc.addPage();
  starts.contents = page();
  doc.font('bold').fontSize(22).fillColor(C.ink).text('Contents', X, doc.page.margins.top);
  doc.moveDown(0.8);
  const tocLine = (label, key, bold = false, indent = 0) => {
    const pn = tocPages?.[key] ? String(tocPages[key]) : '';
    const y = doc.y;
    doc.font(bold ? 'bold' : 'regular').fontSize(bold ? 11.5 : 10).fillColor(bold ? C.ink : C.muted)
      .text(label, X + indent, y, { width: W - indent - 40 });
    const yEnd = doc.y;
    doc.text(pn, X + W - 40, y, { width: 40, align: 'right' });
    doc.y = yEnd + (bold ? 4 : 1);
  };
  tocLine('How to use this book', 'howto', true);
  for (const d of domains) {
    tocLine(`Domain ${d.n} · ${d.name} (${d.weight})`, `d${d.n}`, true);
    for (const c of d.concepts) tocLine(`${c.task}  ${c.title}`, `t${c.task}`, false, 14);
  }
  if (edition === 'practice') tocLine('Answer key and explanations', 'key', true);

  /* ---- how to use ---- */
  doc.addPage();
  starts.howto = page();
  doc.outline.addItem('How to use this book');
  doc.font('bold').fontSize(20).fillColor(C.ink).text('How to use this book', X, doc.page.margins.top);
  doc.moveDown(0.6);
  const howto =
    edition === 'study'
      ? [
          'Questions are grouped by exam domain, then by task statement, the same way as the Learn & Review page on the website.',
          'Each question shows its ID (for example D1-Q01), the task statement it tests, and the exam scenario it belongs to.',
          'The correct answer comes straight after the options, followed by why it is right, why each other option is wrong, and the documentation page to read if you are unsure.',
          `Prefer to test yourself first? Use the Practice Edition, or the free timed mock exam at ${SITE}/claude/quiz.`,
        ]
      : [
          'Questions are grouped by exam domain, then by task statement. Answer each one before you look anything up.',
          'Write your answers down, then check them against the answer key at the back. It has the correct letter, the explanation, why each other option is wrong, and the doc to read.',
          'Note the task statements you miss most often. Those are the domains to study first.',
          `For exam conditions, try the free timed 60-question mock exam at ${SITE}/claude/quiz.`,
        ];
  howto.forEach((h, i) => para(`${i + 1}.  ${h}`, { size: 11, gap: 6, color: C.muted }));
  doc.moveDown(0.6);
  para('**Domains and weights**', { size: 11 });
  for (const d of domains) para(`Domain ${d.n} · ${d.name}: ${d.weight} of the exam, ${d.questions.length} questions here`, { size: 10.5, color: C.muted, indent: 10 });
  doc.moveDown(0.6);
  para('**Scenarios**', { size: 11 });
  SCENARIOS.forEach((s, i) => para(`${i + 1}. ${s}`, { size: 10.5, color: C.muted, indent: 10 }));

  /* ---- questions ---- */
  for (const d of domains) {
    doc.addPage();
    starts[`d${d.n}`] = page();
    const dOutline = doc.outline.addItem(`Domain ${d.n} · ${d.name}`);
    doc.rect(X, doc.page.margins.top, 4, 54).fill(C.gold);
    doc.font('bold').fontSize(10).fillColor(C.gold).text(`DOMAIN ${d.n} · ${d.weight} OF THE EXAM`, X + 14, doc.page.margins.top + 2, { characterSpacing: 1.2 });
    doc.font('bold').fontSize(22).fillColor(C.ink).text(d.name, X + 14, undefined, { width: W - 14 });
    doc.x = X;
    doc.moveDown(1);

    const tasks = [...new Set(d.questions.map((q) => q.ptask))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    for (const t of tasks) {
      const c = d.concepts.find((x) => x.task === t);
      ensure(120);
      starts[`t${t}`] = page();
      dOutline.addItem(`${t} ${c?.title ?? ''}`);
      doc.font('bold').fontSize(13.5).fillColor(C.brown).text(`${t}  ${c?.title ?? ''}`, X, undefined, { width: W });
      doc.moveDown(0.3);
      if (c?.summary) para(c.summary, { size: 9.5, color: C.muted, gap: 3 });
      if (c?.docUrl) {
        doc.font('regular').fontSize(9).fillColor(C.brown).text(`Docs: ${c.docUrl}`, X, undefined, { width: W, link: c.docUrl, underline: true });
      }
      doc.moveDown(0.6);

      for (const q of d.questions.filter((x) => x.ptask === t)) {
        ensure(170);
        rule();
        doc.font('bold').fontSize(9).fillColor(C.gold).text(
          `${q.id}   ·   Task ${q.task}   ·   Scenario: ${SCENARIOS[q.scenario - 1] ?? q.scenario}${q.official ? '   ·   Exam-style' : ''}`,
          X, undefined, { width: W, characterSpacing: 0.3 },
        );
        doc.moveDown(0.35);
        para(q.stem, { size: 11, gap: 5 });
        for (const L of LETTERS) {
          const correct = edition === 'study' && L === q.answer;
          ensure(30);
          const y = doc.y;
          doc.font('bold').fontSize(10.5).fillColor(correct ? C.good : C.brown).text(`${L}.`, X + 6, y, { width: 18 });
          doc.y = y;
          const rs = runs(q.options[L]);
          rs.forEach((r, i) => {
            doc.font(correct && r.f === 'regular' ? 'bold' : r.f).fontSize(r.f === 'mono' ? 9.5 : 10.5).fillColor(correct ? C.good : C.ink);
            const opts = { continued: i < rs.length - 1, lineGap: 2 };
            if (i === 0) doc.text(r.t, X + 26, y, { ...opts, width: W - 26 });
            else doc.text(r.t, opts);
          });
          doc.moveDown(0.25);
        }
        if (edition === 'study') explain(q);
        doc.moveDown(0.5);
      }
    }
  }

  function explain(q) {
    doc.moveDown(0.3);
    ensure(60);
    doc.font('bold').fontSize(10).fillColor(C.good).text(`Answer: ${q.answer}`, X, undefined, { width: W });
    para(q.explanation, { size: 10, color: C.ink, gap: 3 });
    for (const L of LETTERS.filter((l) => l !== q.answer)) {
      if (q.distractors[L]) para(`**Why not ${L}:** ${q.distractors[L]}`, { size: 9.5, color: C.muted, gap: 2 });
    }
    if (q.docUrl) {
      doc.font('regular').fontSize(9).fillColor(C.brown).text(`Read: ${q.docLabel} (${q.docUrl})`, X, undefined, { width: W, link: q.docUrl, underline: true });
    }
  }

  /* ---- practice edition: answer key ---- */
  if (edition === 'practice') {
    doc.addPage();
    starts.key = page();
    doc.outline.addItem('Answer key and explanations');
    doc.font('bold').fontSize(22).fillColor(C.ink).text('Answer key', X, doc.page.margins.top);
    doc.moveDown(0.4);
    para('Quick list first, then every explanation in the same order as the questions.', { size: 10.5, color: C.muted });
    doc.moveDown(0.4);
    // quick grid: 5 columns of "D1-Q01  A"
    const cols = 5;
    const colW = W / cols;
    const all = domains.flatMap((d) => {
      const tasks = [...new Set(d.questions.map((q) => q.ptask))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      return tasks.flatMap((t) => d.questions.filter((q) => q.ptask === t));
    });
    for (let i = 0; i < all.length; i += cols) {
      ensure(16);
      const y = doc.y;
      for (let c = 0; c < cols && i + c < all.length; c++) {
        const q = all[i + c];
        doc.font('regular').fontSize(9).fillColor(C.muted).text(q.id, X + c * colW, y, { width: colW * 0.62, lineBreak: false });
        doc.font('bold').fontSize(9).fillColor(C.good).text(q.answer, X + c * colW + colW * 0.62, y, { width: colW * 0.3, lineBreak: false });
      }
      doc.y = y + 14;
    }
    doc.addPage();
    doc.font('bold').fontSize(18).fillColor(C.ink).text('Explanations', X, doc.page.margins.top);
    doc.moveDown(0.5);
    for (const q of all) {
      ensure(110);
      rule();
      doc.font('bold').fontSize(9.5).fillColor(C.gold).text(`${q.id}   ·   Task ${q.task}`, X, undefined, { width: W });
      doc.moveDown(0.2);
      para(q.stem, { size: 9.5, color: C.muted, gap: 2 });
      explain(q);
      doc.moveDown(0.4);
    }
  }

  /* ---- running footers (skip cover) ---- */
  const range = doc.bufferedPageRange();
  for (let i = 1; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    // Footer sits inside the bottom margin; zero it so pdfkit doesn't start a new page.
    const bottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const y = doc.page.height - 48;
    doc.font('regular').fontSize(8).fillColor(C.faint)
      .text(`CCAR-F Practice Questions · ${edition === 'study' ? 'Study' : 'Practice'} Edition · Unofficial · ${SITE.replace('https://', '')}`, X, y, { width: W - 40, lineBreak: false });
    doc.text(String(i + 1), X + W - 40, y, { width: 40, align: 'right', lineBreak: false });
    doc.page.margins.bottom = bottom;
  }
  return { doc, starts, pages: range.count };
}

async function write(edition) {
  // Pass 1 finds the page each section starts on; pass 2 prints the contents with those numbers.
  const first = build(edition, null);
  first.doc.end();
  const { doc, pages } = build(edition, first.starts);
  const file = join(OUT, `ccar-f-practice-questions-${edition}.pdf`);
  await new Promise((resolve, reject) => {
    const s = createWriteStream(file);
    s.on('finish', resolve).on('error', reject);
    doc.pipe(s);
    doc.end();
  });
  console.log(`✔ PDF (${edition}): ${pages} pages → ${file.replace(ROOT + '/', '')}`);
}

mkdirSync(OUT, { recursive: true });
await write('study');
await write('practice');
