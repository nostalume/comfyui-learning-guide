// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { remarkRelativeLinks } from './src/plugins/remark-relative-links.mjs';

// GitHub Pages 配置。
// 仓库：https://github.com/nostalume/comfyui-learning-guide
// 站点地址：https://nostalume.github.io/comfyui-learning-guide/
//
// base 只在这里写一次：既用于站点部署路径，也用于把正文相对链接重写成站内路由。
// 两处若各写一份，改子路径时必然漏改一处。
const BASE = '/comfyui-learning-guide';

export default defineConfig({
  site: 'https://nostalume.github.io',
  base: BASE,
  trailingSlash: 'ignore',

  // 正文里的相对 .md 链接在构建期被重写为站内路由。
  // 这样源文件可以保持对 GitHub 友好（相对链接在仓库里确实可点），
  // 而产物在站点上是可达的 —— 详见该插件头部的完整说明。
  markdown: {
    // 用 [插件, 选项] 元组形式注册 —— 这是 Astro 文档规定的写法。
    // 写成 remarkRelativeLinks({...})（先调用再注册）会让 unified 把返回的
    // transformer 当成插件本身再调用一次，结果收不到 tree，插件静默失效。
    remarkPlugins: [[remarkRelativeLinks, { base: BASE }]],
  },


  integrations: [
    starlight({
      title: 'ComfyUI 学习指南',
      description:
        '从第一性原理出发的 ComfyUI 中文学习材料 —— 概念之间有推导链接，术语由推导引入。',
      defaultLocale: 'root',
      locales: {
        // 中文为默认语言，直接挂在根路径（内容位于 src/content/docs/）
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // 英文侧（内容位于 src/content/docs/en/）
        en: {
          label: 'English',
          lang: 'en',
        },
      },
      // Pagefind 内建搜索：无需插件。中文分词由 Pagefind 处理。
      pagefind: true,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/nostalume/comfyui-learning-guide',
        },
      ],
      // 侧边栏：取代 docs/SUMMARY.md 的导航职能，避免双权威。
      // 使用 autogenerate 让目录结构自己驱动导航 —— 迁移期不手写 50 条链接。
      // 注意：`autogenerate` 与 `label` 是同一层级的兄弟键（AutoSidebarGroupSchema
      // 继承自 SidebarGroupSchema），不能写成 items: [{ autogenerate }]。
      sidebar: [
        { label: '0. 开始之前', autogenerate: { directory: '0-零基础入门' } },
        { label: '1. 装好、跑通、看懂', autogenerate: { directory: '1-概述与安装部署' } },
        { label: '2. 模型', autogenerate: { directory: '2-模型体系与管理' } },
        { label: '3. 提示词与工作流', autogenerate: { directory: '3-基础工作流搭建' } },
        { label: '4. ControlNet 精准控制', autogenerate: { directory: '4-ControlNet精准控制' } },
        { label: '5. 自动化与批量生成', autogenerate: { directory: '5-自动化与批量生成' } },
        { label: '6. 高级节点与插件生态', autogenerate: { directory: '6-高级节点与插件生态' } },
        { label: '7. 性能优化与显存管理', autogenerate: { directory: '7-性能优化与显存管理' } },
        { label: '8. 与其他工具集成', autogenerate: { directory: '8-与其他工具集成' } },
        { label: '9. 团队知识库与任务管理', autogenerate: { directory: '9-团队知识库与任务管理' } },
        { label: '实战案例', autogenerate: { directory: '实战案例' } },
        // 附录：查阅型内容（术语表、对照表、速查、清单）。依据学习原则 P4 ——
        // 它们是概念推导的沉淀物，不是学习入口，因此不占主线序号。
        { label: '附录', autogenerate: { directory: '附录' } },
      ],
      editLink: {
        baseUrl: 'https://github.com/nostalume/comfyui-learning-guide/edit/main/',
      },
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
