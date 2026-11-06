import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // 不主动列出：页面照常生成、直链可访问，但不进首页、文章列表、侧栏、标签栏和搜索
    unlisted: z.boolean().default(false),
    // 系列合集：同名 series 的文章在列表里折叠成一张系列卡；order 决定系列内顺序
    series: z.string().optional(),
    order: z.number().optional(),
  }),
});

// 作品集与 GitHub 项目是两件事：前者是自己挑选、配图展示的作品，后者是代码仓库。
// 两者都由 /gyanano_cms 后台写入。可选字段容忍后台写出的空值。
const works = defineCollection({
  loader: glob({ base: "./src/content/works", pattern: "**/*.yml" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).nullish(),
    cover: z.string().nullish(),
    images: z.array(z.string()).nullish(),
    link: z.string().nullish(),
    repo: z.string().nullish(),
    home: z.boolean().default(true),
    order: z.number().default(99),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.yml" }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    stack: z.array(z.string()).nullish(),
    repo: z.string(),
    image: z.string().nullish(),
    order: z.number().default(99),
  }),
});

export const collections = { blog, works, projects };
