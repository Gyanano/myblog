# Gyanano · 竹言

水墨风格的个人博客（Astro 6）。在线地址部署在 Cloudflare（项目名 `myblog`），推送到远端即自动部署。

## 写作指南：新增一篇文章

只需在 `src/content/blog/` 下新建一个 Markdown 文件，列表页、文章页、分类、分页都会自动更新，**不用改任何代码**。

1. 新建 `src/content/blog/<英文文件名>.md`，文件名就是网址 slug。
   例：`my-note.md` → 文章地址 `/blog/my-note`。建议文件名用英文/拼音（URL 更干净），中文标题写在 frontmatter 里。

2. 文件顶部写 frontmatter（两行 `---` 之间），下面写正文：

````markdown
---
title: "文章标题"
date: 2026-06-01
description: "一句话摘要，显示在列表卡片上。"
tags: ["嵌入式", "踩坑"]
draft: false
---

正文用 Markdown。

## 一级章节

段落、**加粗**、`行内代码`、[链接](https://example.com)。

### 二级章节

> 引用块（左侧朱砂竖线）

```c
int main(void) { return 0; }   // 代码块（已有水墨风格高亮容器）
```
````

### frontmatter 字段（schema 见 `src/content.config.ts`）

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 文章标题 |
| `date` | ✅ | 日期，列表按它倒序排列 |
| `description` | ✅ | 列表卡片摘要 |
| `tags` | 否 | 字符串数组，默认 `[]`，**就是分类来源**（见下） |
| `draft` | 否 | `true` 则不发布（不进列表、不生成页面），默认 `false` |

## 标签 / 分类用法

- `tags` 里写的每个字符串就是一个分类。**同名标签会自动归到一起**——计数、`/blog` 顶部的标签栏、以及标签页 `/blog/tags/<标签>` 都会自动生成和更新。
- 标签栏按文章数量从多到少排序；点某个标签即筛出该分类下的全部文章。
- 中文标签也支持（URL 会自动编码），不用额外配置。
- 想新开一个分类，直接在某篇文章的 `tags` 里写上即可，无需在别处登记。

## 系列合集（避免同一主题刷屏列表）

当一份大主题被拆成多篇时，给这些文章的 frontmatter 加上相同的 `series` 与递增的 `order`：

```markdown
series: "奇门遁甲基础"
order: 1
```

效果（参考 dev.to / 掘金专栏的折叠模式）：

- **主列表**：同系列折叠成一张「系列卡」，占据其最新一篇的时间位置，不再刷屏；零散单篇照常显示。
- **系列目录页** `/blog/series/<系列名>`：按 `order` 顺序列出全部分篇。
- **文章页**：自动出现系列导航条（第 N/总 篇 + 上一篇 / 下一篇）。
- 系列描述可在 `src/lib/blog.ts` 的 `SERIES_META` 里登记（缺省自动生成）。

不加 `series` 的文章就是普通独立文章，行为不变。

## 分页

- 每页 `PAGE_SIZE` 篇（默认 6，定义在 `src/lib/blog.ts`）。
- `/blog` 是第 1 页，之后是 `/blog/page/2`、`/blog/page/3`…
- 底部分页器只有在**超过 1 页**时才出现，文章不多时不会有多余控件。

## 文章页大纲

文章正文里的 `##` / `###` 标题会自动生成右侧大纲目录（宽屏显示，点击平滑跳转、随滚动高亮当前章节）。所以正文用好标题层级即可，无需手动维护目录。

## 本地预览 / 发布

```sh
npm install        # 安装依赖
npm run dev        # 本地预览 http://localhost:4321 （存盘即刷新）
npm run build      # 生产构建到 ./dist/
npm run preview    # 本地预览构建产物
```

确认无误后提交推送，远端自动部署：

```sh
git add src/content/blog/my-note.md
git commit -m "post: 文章标题"
git push
```

## 小提示

- **插图**：每篇文章的图片单独放一个目录 `public/blog/<slug>/`（`<slug>` 与文件名一致），按出现顺序命名 `1.png`、`2.png`…，正文用绝对路径 `![说明](/blog/<slug>/1.png)` 引用；附件（如 PDF）同样放该目录并用 `[名称](/blog/<slug>/xxx.pdf)`。这样图片随文章聚拢、`public/` 根目录保持整洁。正文图片会自动限制到文字列宽，点击即可在灯箱中查看大图（滚轮/按钮缩放、拖动平移、双击复位、Esc 关闭），无需手动处理大图。
- **草稿**：`draft: true` 先存着，写完改成 `false` 再发布。
- 想改每页篇数，调 `src/lib/blog.ts` 里的 `PAGE_SIZE`。
