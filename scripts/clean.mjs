// 构建前清空 dist/（可选连 Astro 内容缓存一起清）。
//
// 用法：
//   node scripts/clean.mjs [--with-cache]
//   pnpm clean            # 等价的脚本调用，见 package.json
//   pnpm clean:cache      # 连带清掉 Astro 内容缓存
//
// ---------------------------------------------------------------------------
// 安全护栏
// ---------------------------------------------------------------------------
// 删除目标全部由脚本自身位置推导，且仅限本项目内的**可再生构建产物**
// （dist/、node_modules/.astro、node_modules/.vite）。
// 脚本不接受任何外部路径输入，目标越界即拒绝执行并以退出码 1 终止。

import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');
const distDir = join(projectRoot, 'dist');

// 安全护栏：所有目标都由 projectRoot 推导，不接受任何外部路径输入。
const withCache = process.argv.includes('--with-cache');

const targets = [
  { label: 'dist', path: distDir },
  ...(withCache
    ? [
        { label: 'node_modules/.astro', path: join(projectRoot, 'node_modules', '.astro') },
        { label: 'node_modules/.vite', path: join(projectRoot, 'node_modules', '.vite') },
      ]
    : []),
];

for (const target of targets) {
  const relTarget = relative(projectRoot, target.path);
  if (relTarget.startsWith('..') || isAbsolute(relTarget)) {
    console.error(`[clean] 拒绝执行：目标不在项目根内 -> ${target.path}`);
    process.exit(1);
  }
  if (!existsSync(target.path)) {
    console.log(`[clean] ${target.label}/ 不存在，跳过。`);
    continue;
  }
  try {
    // maxRetries 应对 Windows 上的文件占用（如浏览器/预览进程持有句柄）。
    await rm(target.path, { recursive: true, force: true, maxRetries: 5, retryDelay: 120 });
    console.log(`[clean] 已清空 ${target.label}/`);
  } catch (err) {
    console.error(`[clean] 清理 ${target.label}/ 失败：${err?.message ?? err}`);
    process.exit(1);
  }
}
