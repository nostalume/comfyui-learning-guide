// 校验 dist/ 里所有内部链接是否真实可达 —— 含三类：
//   A. 未解析的 `.md` 链接    B. 指向不存在路径    C. 页内锚点失效
//
// 为什么需要它：`astro build` 退出码为 0 只说明「渲染没抛异常」，
// 不说明链接正确。硬编码的绝对路径（如 /0-零基础入门/0.1-x/）既不会
// 被 Astro 重写，也不会被构建报错，但会在 GitHub Pages 上 404。
// 锚点同理：目标页在、`#fragment` 不在时，页面照常打开、只是停在页首，
// 构建与肉眼都发现不了 —— 与站外链接失效属同一类盲区。
//
// 运行时无关：本脚本只用 `node:` 前缀的内置模块，Node 与 Deno 都能直接运行：
//
//   node scripts/check-links.mjs [--verbose]
//   deno run --allow-read scripts/check-links.mjs [--verbose]
//   deno task check:links      # 见仓库根的 deno.json
//
// 退出码：0 = 无失效链接（含锚点）；1 = 存在失效链接或失效锚点。

import { readdir, readFile, stat, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join, resolve, posix, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

// 从脚本自身位置推导项目根，而不是依赖 cwd ——
// 否则在子目录或 IDE 里执行时会去错误的 dist/ 找文件，得出假结论。
const here = dirname(fileURLToPath(import.meta.url));
// CHECK_LINKS_DIST 只给 --selftest 用：指到一个临时 fixture 上做端到端验证
const DIST = process.env.CHECK_LINKS_DIST
  ? resolve(process.env.CHECK_LINKS_DIST)
  : resolve(here, '..', 'dist');
const VERBOSE = process.argv.includes('--verbose');

// 站点的 base 前缀。硬编码的内部绝对链接必须以此开头，
// 否则在 GitHub Pages 子路径部署下必然 404。
const BASE = '/comfyui-learning-guide';

// 这些扩展名按「文件」校验；其余按「目录索引」校验。
const FILE_EXT = /\.(html?|xml|json|txt|css|js|mjs|svg|png|jpe?g|webp|gif|ico|pdf|woff2?|map|wasm|vtt|avif)$/i;

const SKIP_SCHEME = /^(https?:|mailto:|tel:|data:|javascript:)/i;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function extractHrefs(html) {
  const hrefs = [];
  const re = /\s(?:href|src)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) hrefs.push(m[1]);
  return hrefs;
}

function resolveTarget(pageFile, href) {
  // 去掉 query / fragment
  let path = href.split('#')[0].split('?')[0];
  if (!path) return null;

  // href 里的中文以 percent-encoding 形式出现（如 %E5%AE%9E%E6%88%98），
  // 而 dist/ 里是真实中文目录名 —— 必须解码后再比对，否则会把存在的
  // 中文路径误判为失效。
  try {
    path = decodeURIComponent(path);
  } catch {
    // 非法编码则保持原样，交给后续判定
  }

  if (path.startsWith(BASE + '/') || path === BASE) {
    path = path.slice(BASE.length);
  } else if (path.startsWith('/')) {
    // 内部绝对路径但缺少 base —— Pages 子路径部署下会 404
    path = path.slice(1);
    return { rel: path, missingBase: true };
  } else {
    // 相对路径：相对当前页面所在目录解析
    const pageDir = posix.dirname('/' + posix.relative(DIST, pageFile).split('\\').join('/'));
    path = posix.normalize(posix.join(pageDir, path));
    if (path.startsWith('/')) path = path.slice(1);
  }
  return { rel: path, missingBase: false };
}

async function targetExists(rel) {
  const clean = rel.replace(/^\//, '');
  const abs = join(DIST, clean);
  if (FILE_EXT.test(clean)) return exists(abs);
  // 目录式路由：优先 index.html
  if (await exists(join(abs, 'index.html'))) return true;
  if (await exists(abs)) return true; // 精确文件（无扩展名）
  if (await exists(abs + '.html')) return true;
  return false;
}

// ---------------------------------------------------------------------------
// 页内锚点（#fragment）校验
//
// 为什么单列一类：「链接目标存在」不等于「页内锚点存在」。改了标题、删了小节、
// 或把内容挪去别篇之后，指向它的 #fragment 会**静默失效** —— 页面照常打开，
// 只是停在页首，构建不报错、肉眼也看不出。这和外链失效属同一类盲区。
//
// 判据取自**产物自身**：直接读目标页 HTML 里所有的 id 属性，而不是去复刻
// github-slugger 的 slug 算法 —— 算法一改（Astro / Starlight 升级）就会集体误报。
// ---------------------------------------------------------------------------

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// 中文标题的锚点在 HTML 里是 percent-encoding 形式，必须先解码再比对
function decodeAnchor(frag) {
  try {
    return decodeEntities(decodeURIComponent(frag));
  } catch {
    return decodeEntities(frag);
  }
}

const idCache = new Map();

async function idsOf(file) {
  let set = idCache.get(file);
  if (set) return set;
  set = new Set();
  try {
    const html = await readFile(file, 'utf-8');
    const re = /\sid\s*=\s*"([^"]*)"/g;
    let m;
    while ((m = re.exec(html)) !== null) set.add(decodeEntities(m[1]));
  } catch {
    // 读不到就当没有 id —— 上层已确认过文件存在，这里只处理竞态
  }
  idCache.set(file, set);
  return set;
}

// 相对路径 -> 可读的 HTML 文件；非 HTML 目标（图片 / PDF 等）返回 null
async function htmlPathOf(rel) {
  const clean = rel.replace(/^\//, '');
  if (FILE_EXT.test(clean)) return /\.html?$/i.test(clean) ? join(DIST, clean) : null;
  const abs = join(DIST, clean);
  const idx = join(abs, 'index.html');
  if (await exists(idx)) return idx;
  if (await exists(abs + '.html')) return abs + '.html';
  return null;
}

// ---------------------------------------------------------------------------
// --selftest：用临时 fixture 做**端到端**验证（含已知会失败的输入）
//
// 为什么必须有：一个「永远报全绿」的校验器和一个「逻辑压根没接上」的校验器，
// 输出完全一样。只用真实站点的产物测，永远分不清两者 —— 因为真实站点当前
// 恰好是全绿的，而 7921 条锚点里绝大多数是 Starlight 自动生成的目录链接，
// 天然有效。所以自测必须自己造一个**含坏锚点**的 dist。
// ---------------------------------------------------------------------------

if (process.argv.includes('--selftest')) {
  const tmp = await mkdtemp(join(tmpdir(), 'check-links-selftest-'));
  await mkdir(join(tmp, 'a'), { recursive: true });
  await writeFile(
    join(tmp, 'index.html'),
    [
      '<h1 id="_top">首页</h1>',
      '<a href="/comfyui-learning-guide/a/#good">跨页锚点，存在</a>',
      '<a href="/comfyui-learning-guide/a/#%E6%A0%87%E9%A2%98">跨页中文锚点，存在</a>',
      '<a href="/comfyui-learning-guide/a/#bad">跨页锚点，不存在</a>',
      '<a href="/comfyui-learning-guide/#_top">同页锚点，存在</a>',
      '<a href="#self-bad">同页锚点，不存在</a>',
    ].join('\n'),
    'utf-8'
  );
  await writeFile(
    join(tmp, 'a', 'index.html'),
    '<h2 id="good">好锚点</h2>\n<h2 id="标题">中文锚点</h2>\n',
    'utf-8'
  );

  const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
    env: { ...process.env, CHECK_LINKS_DIST: tmp },
    encoding: 'utf-8',
  });
  const out = (r.stdout || '') + (r.stderr || '');

  const checks = [
    [r.status === 1, `退出码应为 1（存在失效锚点），实得 ${r.status}`],
    [/C\. 失效锚点（2 条）/.test(out), '应恰好报出 2 条失效锚点（跨页 1 + 同页 1）'],
    [out.includes('/a/#bad'), '应报出跨页失效锚点 /a/#bad'],
    [out.includes('#self-bad'), '应报出同页失效锚点 #self-bad'],
    [out.includes('0 条失效 + 0 条缺 base 前缀 + 2 条失效锚点'), '结论行三类计数应正确'],
    [!/\/a\/#good\b/.test(out), '存在的跨页锚点 /a/#good 不应被报为失效'],
    [!/%E6%A0%87%E9%A2%98/.test(out), '存在的跨页中文锚点不应被报为失效（percent-encoding 需解码）'],
    [!/\/#_top/.test(out), '存在的同页锚点 /#_top 不应被报为失效'],
  ];
  const failed = checks.filter(([ok]) => !ok);

  await rm(tmp, { recursive: true, force: true });

  console.log('== check-links --selftest（fixture：1 个好锚点 ×3 形态 + 2 个坏锚点）==');
  for (const [ok, label] of checks) console.log(`${ok ? '  ok  ' : '  FAIL'} ${label}`);
  console.log(failed.length ? `自检失败 ${failed.length} 项。` : '自检通过。');
  process.exit(failed.length);
}

const pages = await walk(DIST);
const broken = [];
const missingBase = [];
const badAnchors = [];
let checked = 0;
let anchorsChecked = 0;

for (const page of pages) {
  const html = await readFile(page, 'utf-8');
  const pageRel = '/' + posix.relative(DIST, page).split('\\').join('/');
  const seen = new Set();
  for (const href of extractHrefs(html)) {
    if (!href) continue;
    if (SKIP_SCHEME.test(href)) continue;

    const hashAt = href.indexOf('#');
    const noFrag = hashAt >= 0 ? href.slice(0, hashAt) : href;
    const frag = hashAt >= 0 ? href.slice(hashAt + 1) : '';
    if (!noFrag && !frag) continue; // 仅一个裸 `#`

    const key = pageRel + ' -> ' + href; // 锚点不同即算不同链接
    if (seen.has(key)) continue;
    seen.add(key);
    checked += 1;

    // 同页锚点（`#x`）—— 目标页就是当前页，只查锚点
    if (!noFrag) {
      anchorsChecked += 1;
      if (!(await idsOf(page)).has(decodeAnchor(frag))) {
        badAnchors.push({
          page: pageRel,
          href,
          target: pageRel,
          targetFile: posix.relative(DIST, page).split('\\').join('/'),
        });
      }
      continue;
    }

    const resolved = resolveTarget(page, href);
    if (!resolved) continue;

    if (resolved.missingBase) {
      missingBase.push({ page: pageRel, href: noFrag });
      continue;
    }
    if (!(await targetExists(resolved.rel))) {
      broken.push({
        page: pageRel,
        href: noFrag,
        target: resolved.rel,
        // `.md` 残留是最大的一类：Starlight/Astro 都不重写相对 md 链接，
        // 作者写的 ./x.md 会原样进 HTML 并 404。单列出来便于定位。
        class: resolved.rel.endsWith('.md') ? 'md-leftover' : 'missing',
      });
      continue;
    }

    // 目标页存在 —— 带 fragment 时再看锚点是否真的在那一页里
    if (frag) {
      const file = await htmlPathOf(resolved.rel);
      if (!file) continue; // 非 HTML 目标（图片 / PDF…）不查锚点
      anchorsChecked += 1;
      if (!(await idsOf(file)).has(decodeAnchor(frag))) {
        badAnchors.push({
          page: pageRel,
          href,
          target: resolved.rel,
          targetFile: posix.relative(DIST, file).split('\\').join('/'),
        });
      }
    }
  }
}

function group(rows) {
  const byHref = new Map();
  for (const r of rows) {
    if (!byHref.has(r.href)) byHref.set(r.href, []);
    byHref.get(r.href).push(r.page);
  }
  return [...byHref.entries()].sort((a, b) => b[1].length - a[1].length);
}

console.log(
  `扫描 ${pages.length} 个 HTML，校验 ${checked} 条内部链接（其中 ${anchorsChecked} 条带页内锚点）。\n`
);

if (missingBase.length) {
  console.log(`缺失 base 前缀（${missingBase.length} 条，Pages 部署下会 404）：`);
  for (const [href, pages] of group(missingBase)) {
    console.log(`  ${href}   ← ${pages.length} 处`);
    if (VERBOSE) for (const p of pages.slice(0, 5)) console.log(`      ${p}`);
  }
  console.log('');
}

if (broken.length) {
  const mdLeftover = broken.filter((b) => b.class === 'md-leftover');
  const missing = broken.filter((b) => b.class !== 'md-leftover');

  if (mdLeftover.length) {
    console.log(`A. 未解析的 .md 链接（${mdLeftover.length} 条）—— 作者写 ./x.md，构建未重写：`);
    for (const [href, pages] of group(mdLeftover).slice(0, VERBOSE ? 999 : 15)) {
      console.log(`  ${href}   ← ${pages.length} 处`);
    }
    console.log('');
  }

  if (missing.length) {
    console.log(`B. 指向不存在路径的链接（${missing.length} 条）：`);
    for (const [href, pages] of group(missing)) {
      const target = missing.find((b) => b.href === href).target;
      console.log(`  ${href}`);
      console.log(`      实际查找: ${target}`);
      console.log(
        `      来自 ${pages.length} 处: ${pages.slice(0, 3).join(', ')}${pages.length > 3 ? ' …' : ''}`
      );
    }
    console.log('');
  }
}

if (badAnchors.length) {
  console.log(`C. 失效锚点（${badAnchors.length} 条）—— 目标页存在，但页内没有这个 id：`);
  for (const [href, fromPages] of group(badAnchors)) {
    const hit = badAnchors.find((b) => b.href === href);
    console.log(`  ${href}`);
    console.log(`      目标页: ${hit.targetFile}（该 id 不存在）`);
    console.log(
      `      来自 ${fromPages.length} 处: ${fromPages.slice(0, 3).join(', ')}${
        fromPages.length > 3 ? ' …' : ''
      }`
    );
  }
  console.log('');
}

if (!broken.length && !missingBase.length && !badAnchors.length) {
  console.log('通过：没有失效链接、没有缺失 base 前缀的内部绝对链接，也没有失效锚点。');
  process.exit(0);
}

console.log(
  `结论：${broken.length} 条失效 + ${missingBase.length} 条缺 base 前缀 + ${badAnchors.length} 条失效锚点。`
);
process.exit(1);
