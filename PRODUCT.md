# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
博主本人 Gyanano（嵌入式与全栈工程师，INTP）。读者有三类：招聘方与合作方（看项目和能力）、搜到开发笔记的开发者、对奇门遁甲感兴趣的读者。

## Product Purpose
个人品牌站。作品、文章、小工具同等重要，整站是博主本人的展厅。成功标准：访客在首屏记住这个人和这个站，之后愿意点进作品或文章。

## Positioning
同一个人同时做硬件、软件和奇门遁甲笔记。别的工程师博客没有这个组合。

## Operating Context
内容用中文。文章是 Markdown（`src/content/blog/`），当前有 20 篇：开发笔记（Git、Go、Python、Keil 等）和奇门遁甲系列。`/tools` 是小工具（纯色背景生成器）。

## Capabilities and Constraints
- 技术栈不变：Astro 6，静态构建，Cloudflare 静态资源部署（`npm run build` 后 `wrangler deploy`）。
- 不含任何广告（已移除 AdSense、ads.txt、广告位和隐私政策页）。保留 `search-index.json` 搜索。
- 保留路由：`/`、`/about`、`/work`、`/tools`、`/blog`、`/blog/[slug]`。
- 身份文案和技能来自 `src/consts.ts`。
- 作品集和 GitHub 项目是两件事，分别存放在 `src/content/works/` 和 `src/content/projects/`。作品集由博主单独配图，首页只展示作品集。
- 博主用本地开发服务器的 `/admin/index.html` 后台编辑作品集、GitHub 项目、文章和站点设置。后台不进生产构建。它只改工作区文件，发布仍需提交、构建和部署。
- 栏目名（道、术、演、器、墨痕）是否沿用：待定，视觉可以完全重做。

## Brand Commitments
站名「Gyanano · 竹言」。用户要求：暗色底，克制的光影点缀，大胆的元素拼接，打破常规，有张力，独一无二。参考图 1 是几何色块拼贴，参考图 2 是大图加圆角卡片的杂志版式；用户要的是它们的张力，不是它们的亮色底。

## Evidence on Hand
真实内容：20 篇文章，8 个 GitHub 项目，1 个工具。作品集目前是 Bower、RSerialDebugAssistant、Feedback Spider，封面待博主上传。同一个项目不得同时出现在作品集和 GitHub 项目里。没有客户评价和数据，不得编造。

## Product Principles
1. 先让人记住这个人，再让人读内容。
2. 每个栏目都要有自己的版式，不套同一个卡片模板。
3. 光影克制：只在一两处发光，不满屏霓虹。
4. 文章页要好读，展示页可以激进。
