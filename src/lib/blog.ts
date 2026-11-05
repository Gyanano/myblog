import { getCollection, type CollectionEntry } from "astro:content";
import blogConfig from "../data/blog.json";

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

/**
 * 侧栏列出的标签，由博主在 src/data/blog.json 指定，顺序照写。
 * posts 必须是公开文章：没有公开文章的标签不列出，配置里写错也不会露出未列出的文章。
 * 当前所在的标签总是列出，读者才知道自己在哪。
 */
export function navTags(posts: Post[], active?: string): { tag: string; count: number }[] {
  const all = new Map(collectTags(posts).map((t) => [t.tag, t.count]));
  const names = [...blogConfig.tags];
  if (active && !names.includes(active)) names.push(active);
  return names.flatMap((tag) => (all.has(tag) ? [{ tag, count: all.get(tag)! }] : []));
}

// 带这些标签的文章默认不主动列出（也可在 frontmatter 里单篇写 unlisted: true）。
const UNLISTED_TAGS = new Set(["玄学", "奇门遁甲"]);

export function isUnlisted(p: Post): boolean {
  return p.data.unlisted || p.data.tags.some((t) => UNLISTED_TAGS.has(t));
}

/** 可以主动展示的文章：用于首页、文章列表、侧栏、标签栏和搜索。 */
export function getListedPosts(posts: Post[]): Post[] {
  return posts.filter((p) => !isUnlisted(p));
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

export interface SeriesInfo {
  name: string;
  posts: Post[]; // 按 order 升序（系列内阅读顺序）
  latest: Date; // 系列内最新文章日期，用于在时间流中定位
  count: number;
  description: string;
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
      description: blogConfig.series.find((x) => x.name === name)?.description ?? `「${name}」系列，共 ${arr.length} 篇。`,
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

/** 侧栏的系列列表。posts 必须是公开文章；未列出的系列只在读者已经进入它时才加进来。 */
export function navSeries(posts: Post[], current?: SeriesInfo): { name: string; count: number }[] {
  const list = [...getSeriesMap(posts).values()].map(({ name, count }) => ({ name, count }));
  if (current && !list.some((s) => s.name === current.name)) list.push({ name: current.name, count: current.count });
  return list;
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


// ---------------- 文档式侧栏 ----------------

export interface DocsGroup {
  key: string; // 系列名，或 "notes"
  label: string;
  href?: string; // 系列目录页
  items: Post[]; // 阅读顺序
}

const NOTES_LABEL = "开发笔记";

/** 侧栏分组：每个系列一组（按 order），其余散篇合为「开发笔记」（按日期倒序）。 */
export function getDocsNav(posts: Post[]): DocsGroup[] {
  const groups: DocsGroup[] = [];
  for (const info of getSeriesMap(posts).values()) {
    groups.push({ key: info.name, label: info.name, href: `/blog/series/${encodeURIComponent(info.name)}`, items: info.posts });
  }
  const notes = posts.filter((p) => !p.data.series);
  if (notes.length) groups.push({ key: "notes", label: NOTES_LABEL, items: notes });
  return groups;
}

/** 当前文章所在分组及其上一篇、下一篇（组内顺序）。 */
export function getNeighbors(groups: DocsGroup[], current: Post) {
  const g = groups.find((x) => x.items.some((p) => p.id === current.id));
  if (!g) return { group: null as DocsGroup | null, prev: null as Post | null, next: null as Post | null };
  const i = g.items.findIndex((p) => p.id === current.id);
  return { group: g, prev: i > 0 ? g.items[i - 1] : null, next: i < g.items.length - 1 ? g.items[i + 1] : null };
}
