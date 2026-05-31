import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

export const PAGE_SIZE = 6;

/** 已发布文章（排除草稿），按日期倒序。 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 统计所有标签及其文章数，按数量倒序。 */
export function collectTags(posts: Post[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count }));
}

export function totalPages(count: number): number {
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

// ---------------- 标签分组 ----------------

// 显式归入「玄学」的标签；其余一律落入默认组「技术」（新增技术标签自动归类）。
const TAG_GROUP_OF: Record<string, string> = {
  奇门遁甲: "玄学",
  玄学: "玄学",
};
const DEFAULT_TAG_GROUP = "技术";
const TAG_GROUP_ORDER = ["技术", "玄学"]; // 渲染顺序

export interface TagGroup {
  label: string;
  items: { tag: string; count: number }[];
}

/** 把标签按「技术 / 玄学」分组，组内沿用按文章数倒序，空组省略。 */
export function groupTags(posts: Post[]): TagGroup[] {
  const tags = collectTags(posts); // 已按数量倒序
  const buckets = new Map<string, { tag: string; count: number }[]>();
  for (const t of tags) {
    const g = TAG_GROUP_OF[t.tag] ?? DEFAULT_TAG_GROUP;
    (buckets.get(g) ?? buckets.set(g, []).get(g)!).push(t);
  }
  const ordered = [...TAG_GROUP_ORDER];
  for (const g of buckets.keys()) if (!ordered.includes(g)) ordered.push(g);
  return ordered
    .filter((g) => buckets.has(g))
    .map((label) => ({ label, items: buckets.get(label)! }));
}

// ---------------- 系列合集 ----------------

/** 各系列的展示信息（描述/封面可在此登记，缺省回退到通用文案）。 */
export const SERIES_META: Record<string, { description: string; cover?: string }> = {
  奇门遁甲基础: {
    description: "从「何谓奇门」到「吉格凶格」，时家奇门转盘法的入门系列笔记，按章节循序渐进。",
    cover: "/blog/bagua-jiugong/1.png",
  },
};

export interface SeriesInfo {
  name: string;
  posts: Post[]; // 按 order 升序（系列内阅读顺序）
  latest: Date; // 系列内最新文章日期，用于在时间流中定位
  count: number;
  description: string;
  cover?: string;
}

/** 系列名 → 系列信息。 */
export function getSeriesMap(posts: Post[]): Map<string, SeriesInfo> {
  const grouped = new Map<string, Post[]>();
  for (const p of posts) {
    const s = p.data.series;
    if (!s) continue;
    (grouped.get(s) ?? grouped.set(s, []).get(s)!).push(p);
  }
  const result = new Map<string, SeriesInfo>();
  for (const [name, arr] of grouped) {
    arr.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
    const latest = arr.reduce((m, p) => (p.data.date > m ? p.data.date : m), arr[0].data.date);
    result.set(name, {
      name,
      posts: arr,
      latest,
      count: arr.length,
      description: SERIES_META[name]?.description ?? `「${name}」系列，共 ${arr.length} 篇。`,
      cover: SERIES_META[name]?.cover,
    });
  }
  return result;
}

export type FeedItem =
  | { type: "post"; date: Date; post: Post }
  | { type: "series"; date: Date; series: SeriesInfo };

/**
 * 列表流：把同一系列的多篇折叠成一张系列卡，置于其最新一篇的时间位置；
 * 零散单篇照常展示。posts 须已按日期倒序。
 */
export function getFeedItems(posts: Post[]): FeedItem[] {
  const seriesMap = getSeriesMap(posts);
  const seen = new Set<string>();
  const items: FeedItem[] = [];
  for (const p of posts) {
    const s = p.data.series;
    if (s) {
      if (seen.has(s)) continue; // 系列只在首次（即最新一篇处）插入一张卡
      seen.add(s);
      const info = seriesMap.get(s)!;
      items.push({ type: "series", date: info.latest, series: info });
    } else {
      items.push({ type: "post", date: p.data.date, post: p });
    }
  }
  return items;
}

/** 给定文章在其系列中的导航信息（位置、上一篇、下一篇）；非系列文章返回 null。 */
export function getSeriesNav(
  posts: Post[],
  current: Post,
): { name: string; index: number; count: number; prev: Post | null; next: Post | null } | null {
  if (!current.data.series) return null;
  const info = getSeriesMap(posts).get(current.data.series);
  if (!info) return null;
  const idx = info.posts.findIndex((p) => p.id === current.id);
  if (idx < 0) return null;
  return {
    name: info.name,
    index: idx,
    count: info.count,
    prev: idx > 0 ? info.posts[idx - 1] : null,
    next: idx < info.count - 1 ? info.posts[idx + 1] : null,
  };
}
