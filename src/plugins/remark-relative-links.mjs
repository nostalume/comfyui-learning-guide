// 把正文里的相对 .md 链接重写为站点路由。
//
// ── 为什么需要这个插件 ────────────────────────────────────────────────
// Astro 与 Starlight 都**不会**重写相对 .md 链接：作者写的 `[x](./y.md)`
// 会原样进入 HTML，在站点上必然 404。实测 392 条失效链接里有 362 条属于此因。
//
// ── 为什么不在正文里直接改成站点绝对路径 ──────────────────────────────
// 因为这些相对链接在 **GitHub 上浏览仓库时是正确的**（文件确实相对存在）。
// 把正文改成 `/comfyui-learning-guide/...` 会让 GitHub 上的阅读全部变坏。
// 构建期重写同时满足两边：源文件对 GitHub 友好，产物对站内路由友好。
//
// ── 路由规则 ─────────────────────────────────────────────────────────
// 与 Astro 生成内容 slug 的规则**完全一致**，抄自
// `astro/dist/content/utils.js`（5.18.2，第 288–291 行）：
//
//   去掉扩展名 → 按路径分隔符切段 → 每段过 github-slugger → 用 / 连接
//   → 去掉结尾的 /index
//
// 直接复用 Astro 自己依赖的 github-slugger，可保证与 Astro 的 slug 逐字一致；
// 自己写一套 slugify 迟早会在某个标点上与 Astro 分叉。
//
// 例：`1-概述与安装部署/1.3-连线逻辑.md`
//   → 段 ["1-概述与安装部署","1.3-连线逻辑"]
//   → ["1-概述与安装部署","13-连线逻辑"]
//   → 路由 /comfyui-learning-guide/1-概述与安装部署/13-连线逻辑/

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slug as githubSlug } from 'github-slugger';

const here = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(here, '..', 'content', 'docs');

const PROTOCOL = /^[a-z][a-z0-9+.-]*:/i;

/** 遍历 link 与 definition 节点（不引入 unist-util-visit，省一个依赖）。 */
function walkLinks(node, fn) {
  if (node.type === 'link' || node.type === 'definition') fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walkLinks(child, fn);
  }
}

/** 拆出 `#fragment` 与 `?query`，只对路径部分做判断与替换。 */
function splitUrl(url) {
  const hashAt = url.indexOf('#');
  const queryAt = url.indexOf('?');
  let cut = url.length;
  if (hashAt !== -1) cut = Math.min(cut, hashAt);
  if (queryAt !== -1) cut = Math.min(cut, queryAt);
  return { target: url.slice(0, cut), suffix: url.slice(cut) };
}

/**
 * 与 Astro 一致的内容 slug：逐段过 github-slugger，结尾 /index 去掉。
 */
function toRoute(relPathFromContentDir) {
  const withoutExt = relPathFromContentDir.replace(new RegExp(`${path.extname(relPathFromContentDir)}$`), '');
  const slug = withoutExt
    .split(path.sep)
    .map((segment) => githubSlug(segment))
    .join('/')
    .replace(/\/index$/, '');
  // 边界：内容根目录的 index.md。Astro 会算出字面量 `index`
  // （`.replace(/\/index$/, "")` 匹配不到没有斜杠前缀的情况），
  // 但它的真实路由是站点根 `/`。归一为空串，由调用方拼成 `BASE + "/"`。
  return slug === 'index' ? '' : slug;
}

export function remarkRelativeLinks({ base = '/', debug = false } = {}) {
  const BASE = base.replace(/\/+$/, '');
  if (debug) console.error(`[remark-relative-links] 已注册，base = ${BASE}`);

  return (tree, file) => {
    const filePath = file.path ?? file.history?.[0];
    if (!filePath) {
      if (debug) console.error('[remark-relative-links] 无法取得 file.path，本文件跳过');
      return;
    }

    let rewrites = 0;

    walkLinks(tree, (node) => {
      const url = node.url;
      if (typeof url !== 'string' || url.length === 0) return;

      const { target, suffix } = splitUrl(url);

      // 纯锚点、协议链接、站点绝对路径 —— 一律不动
      if (!target) return;
      if (PROTOCOL.test(target)) return;
      if (target.startsWith('/') || target.startsWith('\\')) return;

      // 只处理指向 markdown 源文件的相对链接
      if (!target.endsWith('.md')) return;

      let decoded = target;
      try {
        decoded = decodeURIComponent(target);
      } catch {
        // 非法百分号编码则按原样处理
      }

      const absTarget = path.resolve(path.dirname(filePath), decoded);

      // 必须落在内容目录内；越界（例如 ../README.md）不处理，留给链接校验报告
      const rel = path.relative(contentDir, absTarget);
      if (rel.startsWith('..') || path.isAbsolute(rel)) return;

      // 目标不存在则不猜，保持原样让 check:links 报出来
      if (!existsSync(absTarget)) return;

      const route = toRoute(rel);
      node.url = `${BASE}/${route ? `${route}/` : ''}${suffix}`;
      rewrites += 1;
    });

    if (debug) {
      console.error(
        `[remark-relative-links] ${path.relative(contentDir, filePath)}  重写 ${rewrites} 处`
      );
    }
  };
}

export default remarkRelativeLinks;
