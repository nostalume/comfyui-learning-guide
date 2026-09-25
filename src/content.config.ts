// Starlight 自带 content collection 定义。此文件显式声明，避免 Astro 的
// "Auto-generating collections ... is deprecated" 警告。
import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
