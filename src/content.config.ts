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
    // 系列合集：同名 series 的文章在列表里折叠成一张系列卡；order 决定系列内顺序
    series: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { blog };
