# 水墨博客落地页 + 博客基础设施 — 设计规格

- 日期：2026-05-30
- 项目：`extra-earth/`（Astro 6，部署到 Cloudflare，项目名 `myblog`）
- 作者人设：Gyanano —— 嵌入式 + 全栈工程师，INTP 逻辑学家

## 1. 目标

把一个具有**丰富动效与精心设计的页面过渡**的个人博客落地页，用**水墨美学**实现，并承载作者**真实的工程师身份**。范围包含落地页与可持续写作的博客基础设施。

成功标准：
- 首屏即呈现 WebGL 流体水墨与书法标题，气质统一。
- 多个真实路由之间切换时，有设计过的水墨过场动画，无白屏闪烁。
- 博客可通过新增 Markdown 文件持续发文，自动出现在列表与详情页。
- `npm run build` 通过，`wrangler deploy` 可部署。

## 2. 美学系统（设计 token）

沿用参考稿的视觉语言，统一为全局 CSS 变量（定义在全局样式中）：

- 宣纸暖米底色 `--paper-bg: #F2EFE8`，叠加 SVG 噪点纹理 `--paper-texture`
- 墨色层级：`--ink-dark #2A2825` / `--ink-base #4A4641` / `--ink-light #8A857D` / `--ink-wash rgba(42,40,37,0.05)`
- 朱砂红点缀 `--cinnabar #BE3A3A`
- 字体：`--font-serif` Noto Serif SC（正文）、`--font-calligraphy` 志莽行书 Zhi Mang Xing（标题/书法）、`--font-mono` Fira Code（终端/等宽）
- 自定义隐藏光标（`cursor: none`）+ WebGL 墨迹拖尾
- SVG `feTurbulence`/`feDisplacementMap` 墨水晕染滤镜（用于彩蛋与过场）

**已移除**：竖排书法诗句（用户确认不需要）。

## 3. 站点结构（真实路由）

| 路由 | 标题 | 内容 |
|---|---|---|
| `/` | **序** Home | WebGL 水墨 hero、名字 Gyanano、标语、交互终端（彩蛋） |
| `/about` | **道 · 理念** | INTP 逻辑学家简介、设计/工程理念、技能栅格、数据统计 |
| `/work` | **术 · 实践** | 精选项目，终端初始化卡片 + 技术标签 + GitHub 链接 |
| `/blog` | **墨痕** | 博客文章索引（内容集合） |
| `/blog/[...slug]` | 文章 | 单篇文章，水墨正文排版 |

联系方式（**结**：邮箱 + GitHub）放在全局页脚，跨页可见。

## 4. 内容（来自 gyanano.github.io，中文化）

- **标语**：用中文表达 "在硬件与软件之间架桥——从裸机 MCU 固件到现代 React 应用"。
- **理念（道）**：INTP-A「逻辑学家」。不只是写代码，而是构建逻辑架构；从电子穿过晶体管到屏幕上的像素，热衷于深入底层。当前在 MCU 嵌入式领域工作，同时构建全栈 Web 应用；推崇极简与功能性、清晰抽象、类型安全与高效内存管理。
- **数据**：4+ 年经验 / 20+ 项目。
- **技能栅格**：前端（React, TypeScript, Tailwind, Framer Motion, Next.js）／后端（Node.js, Python, Go, PostgreSQL, Docker）／嵌入式（C/C++, RTOS, STM32, ESP32, PCB Design）／工具（Git, Linux, VS Code, PlatformIO, Oscilloscopes）。
- **项目（术）**：
  1. STM32 RTOS 无人机飞控（嵌入式）— C++ / STM32 / FreeRTOS / I2C/SPI
  2. IoT 智能温室（全栈 & IoT）— React / Node.js / MQTT / ESP32 / InfluxDB
  3. 极简作品集 V1（Web）— HTML / SCSS / JavaScript
- **链接**：GitHub `https://github.com/gyanano`；邮箱 `contact@gyanano.dev`。

## 5. 动效层

- **WebGL 流体水墨**（three.js）：全局常驻、跟随光标的墨迹晕染（移植参考稿的 ping-pong 着色器 sim + display）。
- **GSAP + ScrollTrigger**：分段错落入场（标题 + 内容 stagger）、滚动驱动的"代码诗"打字机、底部山水长卷视差。
- **终端彩蛋**：输入 `hello world` / `helloworld` / `你好世界` 触发全屏水墨绽放（`ink-bloom` 动画 + 背景渐白），支持中文输入法 composition 事件。
- **首屏淡入**：`astro:page-load` 时整页淡入。

## 6. 页面过渡（重点）

方案 A：**Astro View Transitions（`<ClientRouter />`）+ 自定义水墨晕染过场遮罩**。

- `BaseLayout` 引入 `<ClientRouter />`，实现无白屏的类 SPA 路由。
- WebGL 水墨画布与光标用 `transition:persist` 跨页保留，过渡时墨迹连续不中断。
- 过场遮罩：一层全屏元素，在 `astro:before-swap` 时以朱砂/墨色水墨晕染扫过屏幕（借用 SVG 晕染滤镜 + 透明度/遮罩动画），`astro:after-swap` 退场。
- 内容区设定 `transition:animate`（淡入 + 轻微位移）作为兜底动画。

技术注意：所有依赖 DOM 的客户端脚本（GSAP 初始化、终端、滚动监听）必须在 `astro:page-load` 事件中（重新）初始化，并在 `astro:before-swap` 清理（杀掉 ScrollTrigger、移除监听器），避免跨页泄漏。

## 7. 博客基础设施

- 内容集合目录 `src/content/blog/`，Markdown 文章。
- `src/content.config.ts`：用 Astro 6 的 glob loader 定义 `blog` 集合，schema 字段：`title`（string）、`date`（date）、`description`（string）、`tags`（string[]，可选）、`draft`（boolean，默认 false）。
- `/blog` 列出非 draft 文章，按 `date` 倒序，渲染为 `PostCard`。
- `/blog/[...slug]` 用 `getStaticPaths` 生成静态页，正文走水墨 prose 排版。
- 预置 1–2 篇示例文章作为占位与样式验证。

## 8. 组件架构

- `src/layouts/BaseLayout.astro` — 全局外壳：`<head>`（字体、meta）、宣纸底、`InkCanvas`、`Cursor`、`Nav`、`Watermark`、`ScrollLandscape`、`TransitionOverlay`、`Footer`、`<ClientRouter />`、SVG 滤镜定义。
- `src/components/Nav.astro` — 固定顶栏，logo + 道/术/墨 导航，墨笔下划线 hover。
- `src/components/InkCanvas.astro` — WebGL 流体水墨（含内联着色器与 three.js 客户端脚本），`transition:persist`。
- `src/components/Cursor.astro` — 自定义光标驱动（与 InkCanvas 协作）。
- `src/components/TerminalInput.astro` — 终端输入 + 彩蛋逻辑。
- `src/components/SkillGrid.astro` — 四类技能栅格，入场动画。
- `src/components/ProjectCard.astro` — 项目卡（终端初始化风格 + 标签 + 链接）。
- `src/components/PostCard.astro` — 博客列表卡。
- `src/components/TransitionOverlay.astro` — 水墨过场遮罩 + 过渡事件脚本。
- `src/components/Footer.astro` — 结：邮箱 + GitHub。
- 全局样式：`src/styles/global.css`（设计 token + 基础排版）。

每个组件职责单一、通过 props/slot 通信，可独立理解与替换。

## 9. 技术栈与构建

- Astro 6；`three` 与 `gsap` 作为 npm 依赖（由 Astro 打包，不走 CDN）。
- TypeScript strict（沿用现有 `tsconfig.json`）。
- 字体：通过 Google Fonts `<link>` 引入（Noto Serif SC / Zhi Mang Xing / Fira Code）。
- 部署：`npm run build` → `dist/` → `wrangler deploy`（沿用现有 `wrangler.jsonc`）。
- 移动端：保留参考稿的响应式断点（≤768px），过场/动效在小屏降级但不破版。

## 10. 不做（YAGNI）

- 竖排书法诗句（已移除）。
- 评论系统、CMS、搜索、RSS（本轮不做，结构上不阻碍后续添加）。
- 多语言切换（中文为主，不做 i18n 框架）。

## 11. 风险与缓解

- **WebGL 性能**：分辨率减半渲染（如参考稿 `>> 1`），`pixelRatio` 上限 2；低端设备可在检测到无 WebGL 时优雅降级为静态宣纸底。
- **View Transitions 与第三方脚本生命周期**：严格用 `astro:page-load` / `astro:before-swap` 管理初始化与清理，防止 GSAP/监听器跨页累积。
- **Astro 6 API 名称**：实现阶段以官方文档核实 `<ClientRouter />`、`content.config.ts`、glob loader、`getCollection` 的确切用法（相对 Astro 5 可能有细节差异）。
