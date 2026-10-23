#!/usr/bin/env node
/**
 * Compiles the Claude exam question banks (Markdown) into the JSON files the
 * mock exam (/claude/quiz) and Learn & Review library (/claude/review) load.
 *
 *   Source:  src/content/claude/questions/domain-*.md   (you edit these)
 *   Output:  public/claude/review/questions.json        (all questions)
 *            public/claude/review/concepts.json         (task statements)
 *            public/claude/quiz/questions.json          (questions marked `mock: true`)
 *
 * The output is generated, git-ignored, and rebuilt on every `pnpm dev` /
 * `pnpm build`. Run `pnpm claude:build` manually to validate after editing.
 * The script fails loudly (non-zero exit) on any malformed question so a bad
 * edit can never ship a broken exam.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src/content/claude/questions');
const OUT_REVIEW = join(ROOT, 'public/claude/review');
const OUT_QUIZ = join(ROOT, 'public/claude/quiz');
const LETTERS = ['A', 'B', 'C', 'D'];
const SCENARIOS = [1, 2, 3, 4, 5, 6];

const errors = [];
const fail = (file, id, msg) => errors.push(`${file}${id ? ` › ${id}` : ''}: ${msg}`);

/** Only absolute https links may reach the page (they are rendered as hrefs). */
function safeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return [{}, text];
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return [data, text.slice(m[0].length)];
}

function parseDomainFile(file) {
  const raw = readFileSync(join(SRC, file), 'utf8')
    .replace(/\r\n/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '');
  const [fm, body] = parseFrontmatter(raw);
  const domain = Number(fm.domain);
  if (!domain) fail(file, '', 'frontmatter needs `domain: <number>`');
  const domainName = fm.name ?? `Domain ${domain}`;
  const weight = fm.weight ?? '';

  const [, tasksPart = '', questionsPart = ''] = body.split(/^# (?:Task statements|Questions)\s*$/m);

  // --- task statements: "### 1.1 Title" + summary + "Docs: url"
  const concepts = [];
  for (const block of tasksPart.split(/^### /m).slice(1)) {
    const [head, ...rest] = block.trim().split('\n');
    const hm = head.match(/^(\d+\.\d+)\s+(.+)$/);
    if (!hm) {
      fail(file, head, 'task heading must look like "### 1.1 Title"');
      continue;
    }
    const text = rest.join('\n').trim();
    const docLine = text.match(/^Docs:\s*(\S+)\s*$/m);
    const docUrl = docLine ? safeUrl(docLine[1]) : null;
    if (docLine && !docUrl) fail(file, hm[1], 'Docs link must be an https URL');
    concepts.push({
      domain,
      domainName,
      weight,
      task: hm[1],
      title: hm[2].trim(),
      summary: text.replace(/^Docs:.*$/m, '').trim(),
      docUrl: docUrl ?? '',
    });
  }

  // --- questions: "## D1-Q01" blocks
  const questions = [];
  for (const block of questionsPart.split(/^## /m).slice(1)) {
    const lines = block.replace(/\s+$/, '').split('\n');
    const id = lines.shift().trim();
    if (!/^D\d-Q\d+$/.test(id)) fail(file, id, 'question id must look like D1-Q01');
    if (!id.startsWith(`D${domain}-`)) fail(file, id, `id prefix does not match domain ${domain}`);

    const meta = {};
    const options = {};
    const distractors = {};
    let answer = null;
    let explanation = '';
    const stem = [];
    let section = 'meta';

    for (const line of lines) {
      const metaM = line.match(/^- (task|group|scenario|mock|official|docs):\s*(.+)$/);
      const optM = line.match(/^- \[( |x|X)\] ([A-D])\.\s+(.+)$/);
      const expM = line.match(/^\*\*Explanation:\*\*\s*(.+)$/);
      const whyM = line.match(/^\*\*Why not ([A-D]):\*\*\s*(.+)$/);
      if (section === 'meta' && metaM) {
        meta[metaM[1]] = metaM[2].trim();
      } else if (optM) {
        section = 'options';
        options[optM[2]] = optM[3].trim();
        if (optM[1].toLowerCase() === 'x') {
          if (answer) fail(file, id, 'more than one option marked [x]');
          answer = optM[2];
        }
      } else if (expM) {
        section = 'explanation';
        explanation = expM[1].trim();
      } else if (whyM) {
        section = 'why';
        distractors[whyM[1]] = whyM[2].trim();
      } else if (line.trim() === '') {
        if (section === 'meta' && Object.keys(meta).length) section = 'stem';
      } else if (section === 'stem' || section === 'meta') {
        section = 'stem';
        stem.push(line.trim());
      } else if (section === 'explanation') {
        explanation += ` ${line.trim()}`;
      } else {
        fail(file, id, `unexpected line: "${line.slice(0, 60)}"`);
      }
    }

    const docs = meta.docs?.match(/^\[(.+)\]\((.+)\)$/);
    const docUrl = docs ? safeUrl(docs[2]) : null;
    const scenario = Number(meta.scenario);

    if (!meta.task || !/^\d+\.\d+/.test(meta.task)) fail(file, id, 'missing or invalid `- task: X.Y`');
    if (!SCENARIOS.includes(scenario)) fail(file, id, '`- scenario:` must be 1-6');
    if (!stem.length) fail(file, id, 'missing question text');
    if (LETTERS.some((l) => !options[l])) fail(file, id, 'needs four options A-D');
    if (!answer) fail(file, id, 'mark the correct option with [x]');
    if (!explanation) fail(file, id, 'missing **Explanation:**');
    if (!docUrl) fail(file, id, '`- docs: [label](https://...)` is required');
    for (const l of LETTERS) {
      if (l !== answer && !distractors[l]) fail(file, id, `missing **Why not ${l}:**`);
    }

    questions.push({
      id,
      domain,
      task: meta.task,
      ptask: meta.group ?? meta.task,
      scenario,
      stem: stem.join(' '),
      options,
      answer,
      explanation,
      distractors,
      official: meta.official === 'true',
      mock: meta.mock === 'true',
      docLabel: docs?.[1] ?? '',
      docUrl: docUrl ?? '',
    });
  }
  return { concepts, questions };
}

const files = readdirSync(SRC)
  .filter((f) => /^domain-\d+\.md$/.test(f))
  .sort();
const concepts = [];
const questions = [];
for (const file of files) {
  const r = parseDomainFile(file);
  concepts.push(...r.concepts);
  questions.push(...r.questions);
}

const seen = new Set();
for (const q of questions) {
  if (seen.has(q.id)) fail('all', q.id, 'duplicate question id');
  seen.add(q.id);
}

if (errors.length) {
  console.error(`\n✖ Claude question bank has ${errors.length} problem(s):\n  ${errors.join('\n  ')}\n`);
  process.exit(1);
}

const mock = questions.filter((q) => q.mock);
const strip = ({ mock: _m, ...q }) => q;
mkdirSync(OUT_REVIEW, { recursive: true });
mkdirSync(OUT_QUIZ, { recursive: true });
writeFileSync(join(OUT_REVIEW, 'questions.json'), JSON.stringify(questions.map(strip)));
writeFileSync(join(OUT_REVIEW, 'concepts.json'), JSON.stringify(concepts));
writeFileSync(
  join(OUT_QUIZ, 'questions.json'),
  JSON.stringify(mock.map(({ mock: _m, ptask: _p, docLabel: _l, docUrl: _u, ...q }) => q)),
);
// Small summary the Astro pages import for counts (kept in src so it is typed).
writeFileSync(
  join(ROOT, 'src/data/claude-stats.json'),
  JSON.stringify(
    {
      total: questions.length,
      mock: mock.length,
      tasks: concepts.length,
      domains: [...new Set(questions.map((q) => q.domain))].length,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  `✔ Claude data: ${questions.length} questions, ${mock.length} in mock exam, ${concepts.length} task statements`,
);
