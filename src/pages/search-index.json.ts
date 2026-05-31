import type { APIRoute } from "astro";
import { getPublishedPosts } from "../lib/blog";

// 构建期生成的全文检索索引：标题/摘要/标签/正文纯文本。客户端首次搜索时拉取一次。
export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const index = posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    tags: p.data.tags,
    date: p.data.date.toISOString().slice(0, 10),
    slug: p.id,
    // 去掉 markdown 记号，压平空白，截断以控制索引体积
    body: (p.body ?? "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[`*#>_~\-\[\]()!|]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000),
  }));
  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
