# 水墨博客落地页 + 博客基础设施 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Astro 6 项目 `extra-earth/` 中实现一个水墨美学、动效丰富、带精心设计页面过渡的个人博客（落地页 + 博客基础设施）。

**Architecture:** 单一 `BaseLayout` 提供全局外壳（宣纸底、常驻 WebGL 水墨画布、自定义光标、导航、水墨过场遮罩、页脚、`<ClientRouter />`）。各路由为独立 `.astro` 页面，借 Astro View Transitions 实现无白屏切换；过场用自定义水墨晕染遮罩 + `transition:persist` 保留画布。博客用内容集合（glob loader）。

**Tech Stack:** Astro 6.4、TypeScript strict、three.js（WebGL 流体水墨）、GSAP + ScrollTrigger（滚动动效）、Astro `astro:transitions` / `astro:content`。

**验证约定（替代 TDD）：** 视觉/动画无法做有意义的单测，因此每个任务的验证 = `npm run build` 成功 + 用 `/browse` 对 `npm run preview` 或 `astro dev` 的页面截图人工核对。`$B` 指 `~/.claude/skills/gstack/browse/dist/browse`。

**参考源：** 用户在对话中提供的 `index.html`（根目录）为视觉/着色器/动效参考稿，下文标注「移植参考稿」处指逐段搬运其对应代码（着色器、SVG 滤镜、彩蛋逻辑、滚动算法）并封装为组件，行为保持一致。

---

## 文件结构

```
extra-earth/
├── astro.config.mjs              # 修改：保持默认（ClientRouter 无需配置）
├── package.json                  # 修改：加 three、gsap、@types/three
├── src/
│   ├── content.config.ts         # 新建：blog 集合定义
│   ├── consts.ts                 # 新建：站点元信息 + 个人资料/技能/项目数据
│   ├── styles/
│   │   └── global.css            # 新建：设计 token + 基础排版 + 光标/水印/过场样式
│   ├── layouts/
│   │   ├── BaseLayout.astro       # 新建：全局外壳
│   │   └── Layout.astro           # 删除（默认脚手架）
│   ├── components/
│   │   ├── InkCanvas.astro        # 新建：WebGL 流体水墨（transition:persist）
│   │   ├── Cursor.astro           # 新建：自定义光标
│   │   ├── Nav.astro              # 新建：顶部导航
│   │   ├── Footer.astro           # 新建：页脚（结：邮箱 + GitHub）
│   │   ├── Watermark.astro        # 新建：背景水印「无形」
│   │   ├── ScrollLandscape.astro  # 新建：底部山水长卷视差
│   │   ├── CodePoetry.astro       # 新建：滚动驱动代码诗打字机
│   │   ├── TransitionOverlay.astro# 新建：水墨过场遮罩 + 生命周期脚本
│   │   ├── TerminalInput.astro    # 新建：终端输入 + 彩蛋
│   │   ├── SkillGrid.astro        # 新建：技能栅格
│   │   ├── ProjectCard.astro      # 新建：项目卡
│   │   ├── PostCard.astro         # 新建：博客列表卡
│   │   └── Welcome.astro          # 删除（默认脚手架）
│   ├── content/
│   │   └── blog/
│   │       ├── hello-ink.md       # 新建：示例文章 1
│   │       └── embedded-vs-web.md # 新建：示例文章 2
│   └── pages/
│       ├── index.astro            # 改写：序（首页）
│       ├── about.astro            # 新建：道
│       ├── work.astro             # 新建：术
│       └── blog/
│           ├── index.astro        # 新建：墨痕（博客索引）
│           └── [...slug].astro    # 新建：文章详情
```

---

## Task 0: 依赖与脚手架清理

**Files:**
- Modify: `package.json`
- Create: `src/consts.ts`
- Delete: `src/components/Welcome.astro`, `src/layouts/Layout.astro`

- [ ] **Step 1: 安装依赖**

Run:
```bash
npm install three gsap && npm install -D @types/three
```
Expected: 安装成功，`package.json` dependencies 出现 `three`、`gsap`。

- [ ] **Step 2: 删除默认脚手架文件**

Run:
```bash
rm src/components/Welcome.astro src/layouts/Layout.astro
```

- [ ] **Step 3: 创建站点常量与个人数据 `src/consts.ts`**

```ts
export const SITE = {
  title: "Gyanano · 竹言",
  author: "Gyanano",
  description: "嵌入式与全栈工程师 — 在硬件与软件之间架桥。",
  email: "contact@gyanano.dev",
  github: "https://github.com/gyanano",
};

export const NAV = [
  { href: "/about", label: "道", en: "About" },
  { href: "/work", label: "术", en: "Work" },
  { href: "/blog", label: "墨痕", en: "Blog" },
];

export const STATS = [
  { value: "04+", label: "年经验" },
  { value: "20+", label: "项目" },
];

export const SKILLS = [
  { no: "01", group: "前端", items: ["React", "TypeScript", "Tailwind", "Framer Motion", "Next.js"] },
  { no: "02", group: "后端", items: ["Node.js", "Python", "Go", "PostgreSQL", "Docker"] },
  { no: "03", group: "嵌入式", items: ["C/C++", "RTOS", "STM32", "ESP32", "PCB Design"] },
  { no: "04", group: "工具", items: ["Git", "Linux", "VS Code", "PlatformIO", "Oscilloscopes"] },
];

export const PROJECTS = [
  {
    no: "01", tag: "嵌入式",
    title: "STM32 RTOS 无人机飞控",
    boot: "initializing stm32_rtos_drone_controller...",
    desc: "用 C++ 与 FreeRTOS 编写的自定义飞控固件。包含 PID 稳定、传感器融合（IMU）与自定义无线协议。",
    stack: ["C++", "STM32", "FreeRTOS", "I2C/SPI"],
    code: "https://github.com/gyanano",
  },
  {
    no: "02", tag: "全栈 & IoT",
    title: "IoT 智能温室",
    boot: "initializing iot_smart_greenhouse...",
    desc: "自动化气候控制系统。ESP32 节点经 MQTT 推送数据到 Node.js 后端，React 仪表盘通过 WebSocket 实时可视化。",
    stack: ["React", "Node.js", "MQTT", "ESP32", "InfluxDB"],
    code: "https://github.com/gyanano",
  },
  {
    no: "03", tag: "Web",
    title: "极简作品集 V1",
    boot: "initializing minimalist_portfolio_v1...",
    desc: "个人站的上一代。聚焦排版与粗野主义美学，纯 CSS 与原生 JS 实现。",
    stack: ["HTML", "SCSS", "JavaScript"],
    code: "https://github.com/gyanano",
  },
];
```

- [ ] **Step 4: 验证构建（此时无页面引用旧文件即可）**

Run: `npm run build`
Expected: 构建成功（默认 index.astro 仍在，但已不引用 Welcome；若报错，先在 Task 5 改写 index.astro。此步允许失败并在 Task 1/5 后复检）。

- [ ] **Step 5: 提交**

```bash
git add package.json package-lock.json src/consts.ts
git commit -m "chore: add three/gsap deps, site consts, remove scaffold"
```

---

## Task 1: 全局样式与 BaseLayout 外壳

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: 创建 `src/styles/global.css`（设计 token + 基础 + 光标/水印/过场）**

移植参考稿 `:root` 变量、宣纸纹理、基础排版、`cursor:none`、`.watermark`、`.code-poetry-bg`、终端、`h2/p` 等样式（去掉竖排 `.poem*` 相关）。补充志莽行书字体变量与过场遮罩样式。关键内容：

```css
:root {
  --paper-bg: #F2EFE8;
  --paper-texture: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.12'/%3E%3C/svg%3E");
  --ink-dark: #2A2825;
  --ink-base: #4A4641;
  --ink-light: #8A857D;
  --ink-wash: rgba(42, 40, 37, 0.05);
  --cinnabar: #BE3A3A;
  --font-serif: 'Noto Serif SC', serif;
  --font-mono: 'Fira Code', monospace;
  --font-calligraphy: 'Zhi Mang Xing', cursive;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
@media (pointer: fine) { * { cursor: none; } }   /* 触屏不隐藏光标 */
body {
  background-color: var(--paper-bg);
  background-image: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.04) 100%), var(--paper-texture);
  color: var(--ink-dark);
  font-family: var(--font-serif);
  overflow-x: hidden;
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
}
/* watermark / code-poetry / header / nav / terminal / h2 / p / works-list
   等：移植参考稿同名规则（删除 .poem / .poem-container）。 */
/* 过场遮罩 */
#ink-transition {
  position: fixed; inset: 0; z-index: 9000; pointer-events: none;
  background: var(--ink-dark); opacity: 0;
  clip-path: inset(0 0 100% 0);
}
/* 内容入场（View Transitions 兜底动画在各 page 用 transition:animate） */
@media (max-width: 768px) {
  /* 移植参考稿移动端断点（去掉 poem 相关） */
}
```

> 实现者：把参考稿 `<style>` 内除 `.poem`/`.poem-container` 外的规则完整搬入，并把上面新增的字体变量、`@media (pointer:fine)` 包裹的 `cursor:none`、`#ink-transition` 一并加入。

- [ ] **Step 2: 创建 `src/layouts/BaseLayout.astro`**

```astro
---
import { ClientRouter } from "astro:transitions";
import "../styles/global.css";
import { SITE } from "../consts";
import InkCanvas from "../components/InkCanvas.astro";
import Cursor from "../components/Cursor.astro";
import Nav from "../components/Nav.astro";
import Watermark from "../components/Watermark.astro";
import Footer from "../components/Footer.astro";
import TransitionOverlay from "../components/TransitionOverlay.astro";

interface Props { title?: string; description?: string; }
const { title, description = SITE.description } = Astro.props;
const fullTitle = title ? `${title} · ${SITE.author}` : SITE.title;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400&family=Noto+Serif+SC:wght@300;400;600&family=Zhi+Mang+Xing&display=swap" rel="stylesheet" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <ClientRouter />
  </head>
  <body>
    <!-- SVG 墨水晕染滤镜：移植参考稿 #ink-bleed-filter（transition:persist 保留） -->
    <svg style="display:none" transition:persist="ink-filter">
      <defs>
        <filter id="ink-bleed-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred" />
          <feComponentTransfer in="blurred" result="ink"><feFuncA type="linear" slope="3" intercept="-0.5" /></feComponentTransfer>
          <feMerge><feMergeNode in="ink" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
    <InkCanvas />
    <Cursor />
    <Watermark />
    <Nav />
    <main transition:animate="fade">
      <slot />
    </main>
    <Footer />
    <TransitionOverlay />
  </body>
</html>
```

- [ ] **Step 3: 提交**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: add global ink styles and BaseLayout shell"
```

---

## Task 2: WebGL 流体水墨画布 + 自定义光标

**Files:**
- Create: `src/components/InkCanvas.astro`
- Create: `src/components/Cursor.astro`

- [ ] **Step 1: 创建 `src/components/InkCanvas.astro`**

容器 + 客户端脚本。脚本逻辑移植参考稿「1. WebGL 流体光标」：three.js 正交相机、ping-pong `WebGLRenderTarget`、`simMaterial`/`displayMaterial` 着色器（**逐字移植参考稿着色器源码，行为不变**）、`handleMove`、`render()` 循环、resize。改动点：用 `import * as THREE from "three"` 取代 CDN；用 `transition:persist` 保留容器避免跨页重建；脚本用 `astro:page-load` 守卫只初始化一次（全局标志 `window.__inkInit`）。

```astro
<div id="webgl-container" transition:persist="ink-canvas"
     style="position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;mix-blend-mode:multiply;opacity:0.9"></div>
<script>
  import * as THREE from "three";
  function initInk() {
    if ((window as any).__inkInit) return;
    (window as any).__inkInit = true;
    const container = document.getElementById("webgl-container");
    if (!container) return;
    // ... 移植参考稿 renderer/scene/camera/rtA/rtB/simMaterial/displayMaterial/
    //     geometry/quad/handleMove/render()/resize 全部逻辑（着色器源码原样搬运）
  }
  document.addEventListener("astro:page-load", initInk);
</script>
```

> 实现者：把参考稿 `// 1. WebGL 流体光标` 整段（含两个 `ShaderMaterial` 的 vertex/fragment 字符串）原样放入 `initInk()`，仅去掉 CDN 依赖、改 `THREE` 来源、加初始化守卫与 `astro:page-load` 监听。`mousemove`/`touchmove`/`resize` 监听只在首次绑定。

- [ ] **Step 2: 创建 `src/components/Cursor.astro`（自定义光标点）**

```astro
<div id="ink-cursor" aria-hidden="true"
     style="position:fixed;top:0;left:0;width:10px;height:10px;border-radius:50%;background:var(--ink-dark);pointer-events:none;z-index:10000;transform:translate(-50%,-50%);transition:width .2s,height .2s,opacity .2s;mix-blend-mode:multiply"></div>
<script>
  function initCursor() {
    if ((window as any).__cursorInit) return;
    (window as any).__cursorInit = true;
    const c = document.getElementById("ink-cursor");
    if (!c) return;
    window.addEventListener("mousemove", (e) => {
      c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseover", (e) => {
      const t = e.target as HTMLElement;
      const big = t.closest("a,button,input,[data-cursor]");
      c.style.width = big ? "28px" : "10px";
      c.style.height = big ? "28px" : "10px";
      c.style.opacity = big ? "0.4" : "1";
    });
  }
  document.addEventListener("astro:page-load", initCursor);
</script>
```

加 `transition:persist="cursor"` 到该 div 以跨页保留。

- [ ] **Step 3: 验证**

在 `index.astro` 临时引用 BaseLayout 后 `npm run build`；运行 `astro dev`，用 `$B goto http://localhost:4321` + `$B screenshot /tmp/ink.png`，Read 截图确认宣纸底 + 墨迹渲染。

- [ ] **Step 4: 提交**

```bash
git add src/components/InkCanvas.astro src/components/Cursor.astro
git commit -m "feat: webgl fluid ink canvas + custom cursor (persisted)"
```

---

## Task 3: 导航、水印、页脚

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Watermark.astro`, `src/components/Footer.astro`

- [ ] **Step 1: `src/components/Nav.astro`**

```astro
---
import { SITE, NAV } from "../consts";
---
<header>
  <a class="logo" href="/" data-cursor>{SITE.author}</a>
  <nav>
    <ul>
      {NAV.map((n) => <li><a href={n.href}>{n.label}</a></li>)}
    </ul>
  </nav>
</header>
```
（`header`/`nav`/`.logo` 样式已在 global.css 移植自参考稿。）

- [ ] **Step 2: `src/components/Watermark.astro`**

```astro
<div class="watermark" aria-hidden="true" transition:persist="watermark">无形</div>
```

- [ ] **Step 3: `src/components/Footer.astro`**

```astro
---
import { SITE } from "../consts";
---
<footer style="position:relative;z-index:10;max-width:800px;margin:0 auto;padding:6rem 2rem 4rem;text-align:center">
  <h2 style="font-family:var(--font-calligraphy);font-size:2.4rem">结 / 缘起</h2>
  <p style="font-family:var(--font-mono);font-size:1rem;margin-top:1.5rem">
    <a href={`mailto:${SITE.email}`} style="color:var(--cinnabar);text-decoration:none;border-bottom:1px dotted var(--cinnabar);padding-bottom:4px">{SITE.email}</a>
  </p>
  <p style="margin-top:1rem"><a href={SITE.github} style="color:var(--ink-base)" data-cursor>GitHub ↗</a></p>
</footer>
```

- [ ] **Step 4: 提交**

```bash
git add src/components/Nav.astro src/components/Watermark.astro src/components/Footer.astro
git commit -m "feat: nav, watermark, footer components"
```

---

## Task 4: 水墨过场遮罩 + 过渡生命周期

**Files:**
- Create: `src/components/TransitionOverlay.astro`

- [ ] **Step 1: 创建组件**

用 `astro:before-swap` 把遮罩从底向上盖满（墨色晕染），`astro:after-swap` / `astro:page-load` 退场；并在 `astro:before-swap` 清理 ScrollTrigger（防跨页泄漏，配合 Task 6/7）。

```astro
<div id="ink-transition" aria-hidden="true" transition:persist="ink-transition"></div>
<script>
  function play(el: HTMLElement, frames: Keyframe[], opts: KeyframeAnimationOptions) {
    return el.animate(frames, opts).finished;
  }
  document.addEventListener("astro:before-swap", () => {
    const el = document.getElementById("ink-transition");
    if (!el) return;
    el.style.opacity = "1";
    play(el, [
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0 0 0 0)" },
    ], { duration: 420, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" });
  });
  document.addEventListener("astro:after-swap", () => {
    const el = document.getElementById("ink-transition");
    if (!el) return;
    play(el, [
      { clipPath: "inset(0 0 0 0)" },
      { clipPath: "inset(0 0 100% 0)" },
    ], { duration: 480, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" })
      .then(() => { el.style.opacity = "0"; });
  });
</script>
```

> 注：`#ink-transition` 的基础样式在 global.css。`mix-blend-mode` 可选加在样式里增强墨感。

- [ ] **Step 2: 验证过渡**

`astro dev`；`$B goto http://localhost:4321`，`$B click` 导航链接到 `/about`，`$B screenshot` 抓过场中帧（可多次截图）确认有墨色擦除、无白屏。

- [ ] **Step 3: 提交**

```bash
git add src/components/TransitionOverlay.astro
git commit -m "feat: ink-wipe page transition overlay"
```

---

## Task 5: 首页 序（hero + 终端彩蛋 + 代码诗）

**Files:**
- Create: `src/components/TerminalInput.astro`, `src/components/CodePoetry.astro`, `src/components/ScrollLandscape.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: `src/components/TerminalInput.astro`**

移植参考稿「3. 终端输入彩蛋」：终端输入框 + `#easter-egg-canvas` + `triggerEasterEgg()` + composition 事件 + `ink-bloom`（`ink-bloom` keyframes 与 `.ink-text` 样式加入 global.css）。脚本用 `astro:page-load` 初始化。结构：

```astro
<div class="terminal-wrapper">
  <div class="terminal-label">唤醒水墨，只需一句问候</div>
  <div class="terminal">
    <span class="prompt">~ %</span>
    <input type="text" id="code-input" autocomplete="off" spellcheck="false" placeholder="Type here..." data-cursor />
    <span class="blinking-cursor"></span>
  </div>
</div>
<div id="easter-egg-canvas"><div class="ink-text" id="egg-text">Hello World</div></div>
<script>
  function initTerminal() { /* 移植参考稿彩蛋逻辑，含中文输入法 composition 处理 */ }
  document.addEventListener("astro:page-load", initTerminal);
</script>
```

- [ ] **Step 2: `src/components/CodePoetry.astro`**

移植参考稿「2. 滚动进度精确控制」的代码诗打字机（`.gs-type` + scroll 监听 + `poetryData` scrubbing 算法）。脚本 `astro:page-load` 初始化、`astro:before-swap` 移除 scroll 监听。

```astro
<div class="code-poetry-bg gs-type" style="top:15vh;right:8vw" data-text="import { Void } from 'universe';"></div>
<div class="code-poetry-bg gs-type" style="top:25vh;left:10vw" data-text="const canvas = new Mind();\ncanvas.clear();"></div>
<div class="code-poetry-bg gs-type" style="bottom:20vh;left:5vw" data-text="while(true) {\n  seek(Dao);\n}"></div>
<div class="code-poetry-bg gs-type" style="bottom:25vh;right:12vw" data-text="// 大象无形\n/* 落笔生花 */"></div>
<script> /* 移植参考稿打字机 scrubbing；监听器存到 window 以便 before-swap 清理 */ </script>
```

- [ ] **Step 3: `src/components/ScrollLandscape.astro`**

移植参考稿底部山水长卷（`.scroll-painting-container` + `.scroll-painting`，样式入 global.css）+ 视差 transform（并入 CodePoetry 的 scroll 逻辑或独立监听）。`transition:persist` 保留。

- [ ] **Step 4: 改写 `src/pages/index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import TerminalInput from "../components/TerminalInput.astro";
import CodePoetry from "../components/CodePoetry.astro";
import ScrollLandscape from "../components/ScrollLandscape.astro";
---
<BaseLayout>
  <CodePoetry />
  <ScrollLandscape />
  <section id="hero" style="padding-top:22vh">
    <TerminalInput />
    <h1 style="text-align:center;font-family:var(--font-calligraphy);font-size:5rem;margin-top:4vh">Gyanano</h1>
    <p style="text-align:center;font-size:1.2rem;color:var(--ink-light)">在硅与浏览器之间，落笔生万物</p>
  </section>
</BaseLayout>
```

- [ ] **Step 5: 验证**

`npm run build` 通过；`astro dev`，`$B goto http://localhost:4321`，输入彩蛋：`$B fill "#code-input" "hello world"`，`$B screenshot /tmp/egg.png` 确认水墨绽放；`$B screenshot` 首屏确认 hero。

- [ ] **Step 6: 提交**

```bash
git add src/components/TerminalInput.astro src/components/CodePoetry.astro src/components/ScrollLandscape.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: home page hero, terminal easter egg, code-poetry, landscape"
```

---

## Task 6: 道 /about（理念 + 技能栅格 + 数据）

**Files:**
- Create: `src/components/SkillGrid.astro`, `src/pages/about.astro`

- [ ] **Step 1: `src/components/SkillGrid.astro`**

```astro
---
import { SKILLS } from "../consts";
---
<div class="skill-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem">
  {SKILLS.map((s) => (
    <div class="skill-cell gs-stagger-item">
      <span style="font-family:var(--font-mono);color:var(--ink-light)">{s.no}</span>
      <h3 style="font-weight:600;margin:.4rem 0">{s.group}</h3>
      <ul style="list-style:none">{s.items.map((i) => <li style="color:var(--ink-base)">{i}</li>)}</ul>
    </div>
  ))}
</div>
```

- [ ] **Step 2: `src/pages/about.astro`**

引用 BaseLayout，含：标题「道 / 理念」、INTP 逻辑学家理念文案（中文，源自 spec 第 4 节）、`STATS` 数据、`SkillGrid`。GSAP 入场动画用本页 `<script>`（见 Step 3）。

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SkillGrid from "../components/SkillGrid.astro";
import { STATS } from "../consts";
---
<BaseLayout title="道" description="理念与技能">
  <section id="about">
    <h2 class="gs-title">道 / 理念</h2>
    <div class="gs-stagger">
      <p>INTP-A「逻辑学家」。我不只是写代码，而是构建逻辑架构……（spec 第 4 节文案）</p>
      <p>当前在 MCU 嵌入式领域工作，同时构建全栈 Web 应用……推崇极简与功能性、清晰抽象、类型安全与高效内存管理。</p>
      <div style="display:flex;gap:4rem;margin:2rem 0">
        {STATS.map((st) => (<div><span style="font-family:var(--font-mono);font-size:2.5rem;color:var(--ink-dark)">{st.value}</span><div style="color:var(--ink-light)">{st.label}</div></div>))}
      </div>
    </div>
    <SkillGrid />
  </section>
</BaseLayout>
```

- [ ] **Step 3: 共享 GSAP 入场脚本**

在 global.css 无法放 JS，故在 `BaseLayout` 增加一段全局 GSAP 脚本（移植参考稿「0. GSAP 内容入场」，去掉 `.gs-pin-poem` 钉住部分）：对 `.gs-title`、`.gs-stagger > *`、`.gs-fade-up`、`.gs-stagger-item` 做入场。脚本 `astro:page-load` 初始化、`astro:before-swap` 调 `ScrollTrigger.getAll().forEach(t=>t.kill())` 清理。

> 实现者：把该脚本作为 `src/components/Reveal.astro`（仅脚本）或直接内联进 BaseLayout 的 `<script>`；用 `import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";`。

- [ ] **Step 4: 验证 + 提交**

`npm run build`；`$B goto .../about` 截图确认技能栅格与入场。
```bash
git add src/components/SkillGrid.astro src/pages/about.astro src/layouts/BaseLayout.astro
git commit -m "feat: about page (philosophy, stats, skill grid) + gsap reveal"
```

---

## Task 7: 术 /work（项目卡）

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/pages/work.astro`

- [ ] **Step 1: `src/components/ProjectCard.astro`**

```astro
---
interface Props { project: { no:string; tag:string; title:string; boot:string; desc:string; stack:string[]; code:string } }
const { project } = Astro.props;
---
<li class="gs-stagger-item" style="margin-bottom:2.5rem;padding-bottom:2.5rem;border-bottom:1px dashed var(--ink-wash)">
  <div style="font-family:var(--font-mono);color:var(--ink-light);font-size:.9rem">&gt; {project.boot} <span style="color:var(--cinnabar)">status: ready</span></div>
  <div style="font-family:var(--font-mono);color:var(--ink-light);margin:.3rem 0">{project.tag}</div>
  <h3 style="font-size:1.4rem;font-weight:600;margin:.5rem 0">{project.title}</h3>
  <p>{project.desc}</p>
  <div style="font-family:var(--font-mono);font-size:.85rem;color:var(--ink-base)">{project.stack.join(" · ")}</div>
  <a href={project.code} data-cursor style="color:var(--cinnabar);font-family:var(--font-mono)">Code ↗</a>
</li>
```

- [ ] **Step 2: `src/pages/work.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ProjectCard from "../components/ProjectCard.astro";
import { PROJECTS } from "../consts";
---
<BaseLayout title="术" description="精选项目">
  <section id="work">
    <h2 class="gs-title">术 / 实践</h2>
    <p class="gs-stagger" style="border-left:2px solid var(--cinnabar);padding-left:1rem;font-family:var(--font-calligraphy);font-size:1.5rem">大音希声，大象无形。</p>
    <ul class="gs-stagger" style="list-style:none">
      {PROJECTS.map((p) => <ProjectCard project={p} />)}
    </ul>
  </section>
</BaseLayout>
```

- [ ] **Step 3: 验证 + 提交**

`npm run build`；`$B goto .../work` 截图。
```bash
git add src/components/ProjectCard.astro src/pages/work.astro
git commit -m "feat: work page with terminal-style project cards"
```

---

## Task 8: 博客基础设施（集合 + 索引 + 详情）

**Files:**
- Create: `src/content.config.ts`, `src/content/blog/hello-ink.md`, `src/content/blog/embedded-vs-web.md`, `src/components/PostCard.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`

- [ ] **Step 1: `src/content.config.ts`**

```ts
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
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: 示例文章 `src/content/blog/hello-ink.md`**

```md
---
title: "落笔：用代码泼一幅水墨"
date: 2026-05-30
description: "为什么我把个人站做成一张会晕染的宣纸。"
tags: ["web", "webgl", "设计"]
---

第一篇。关于用 WebGL 流体模拟在浏览器里重现毛笔晕染的尝试……
```

- [ ] **Step 3: 示例文章 `src/content/blog/embedded-vs-web.md`**

```md
---
title: "从寄存器到像素：嵌入式与 Web 的两种思维"
date: 2026-05-20
description: "在 STM32 与 React 之间来回切换，我学到的事。"
tags: ["嵌入式", "fullstack"]
---

裸机固件讲究确定性与内存，Web 讲究状态与异步……
```

- [ ] **Step 4: `src/components/PostCard.astro`**

```astro
---
interface Props { href: string; title: string; date: Date; description: string; tags: string[] }
const { href, title, date, description, tags } = Astro.props;
const d = date.toISOString().slice(0, 10);
---
<a href={href} class="post-card gs-stagger-item" data-cursor
   style="display:block;text-decoration:none;color:inherit;padding:2rem 0;border-bottom:1px dashed var(--ink-wash)">
  <div style="font-family:var(--font-mono);color:var(--ink-light);font-size:.85rem">{d}</div>
  <h3 style="font-family:var(--font-calligraphy);font-size:2rem;margin:.4rem 0;color:var(--ink-dark)">{title}</h3>
  <p style="color:var(--ink-base)">{description}</p>
  <div style="font-family:var(--font-mono);font-size:.8rem;color:var(--ink-light)">{tags.map((t)=>`#${t}`).join(" ")}</div>
</a>
```

- [ ] **Step 5: `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import PostCard from "../../components/PostCard.astro";
const posts = (await getCollection("blog", ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="墨痕" description="文章">
  <section id="blog">
    <h2 class="gs-title">墨痕 / 文章</h2>
    <div class="gs-stagger">
      {posts.map((p) => (
        <PostCard href={`/blog/${p.id}`} title={p.data.title} date={p.data.date} description={p.data.description} tags={p.data.tags} />
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 6: `src/pages/blog/[...slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}
const { post } = Astro.props;
const { Content } = await render(post);
const d = post.data.date.toISOString().slice(0, 10);
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <article id="post" class="gs-stagger">
    <div style="font-family:var(--font-mono);color:var(--ink-light)">{d}</div>
    <h1 style="font-family:var(--font-calligraphy);font-size:3rem;margin:.5rem 0">{post.data.title}</h1>
    <div class="prose"><Content /></div>
    <p style="margin-top:3rem"><a href="/blog" data-cursor style="color:var(--cinnabar)">← 返回墨痕</a></p>
  </article>
</BaseLayout>
```

补：在 global.css 加 `.prose` 排版（标题/段落/代码块/链接 的水墨风格）。

- [ ] **Step 7: 验证 + 提交**

`npm run build`（确认 `/blog` 与两篇 `/blog/*` 静态生成）；`$B goto .../blog` 截图 + 进入一篇文章截图。
```bash
git add src/content.config.ts src/content/blog src/components/PostCard.astro src/pages/blog/ src/styles/global.css
git commit -m "feat: blog collection, index, post template + sample posts"
```

---

## Task 9: 整体打磨与响应式 + 部署验证

**Files:**
- Modify: 视需要 `src/styles/global.css`、各页面

- [ ] **Step 1: 全站构建**

Run: `npm run build`
Expected: 5 路由全部成功（`/`、`/about`、`/work`、`/blog`、两篇文章）。

- [ ] **Step 2: 过渡专项验证**

`astro dev`；依次 `$B click` 导航 序→道→术→墨痕→文章，每步前后 `$B screenshot`，确认：无白屏、水墨过场出现、WebGL 画布与光标连续（未重建闪烁）。

- [ ] **Step 3: 响应式**

`$B responsive /tmp/blog-resp`（mobile/tablet/desktop），Read 三张图确认导航/终端/栅格在 ≤768px 不破版；必要时补 global.css 移动端规则。

- [ ] **Step 4: 控制台与网络**

`$B console --errors` 与 `$B network`，确认无 JS 报错、字体与脚本加载正常。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "polish: responsive tweaks and cross-page transition verification"
```

- [ ] **Step 6（可选，需用户授权）：部署**

`npm run build && npx wrangler deploy`（仅在用户要求部署时执行）。

---

## Self-Review 记录

- **Spec 覆盖**：美学 token→Task1；站点结构 5 路由→Task5/6/7/8；内容→consts(Task0)+各页；动效（WebGL/GSAP/彩蛋/代码诗/山水）→Task2/5/6；页面过渡→Task1(ClientRouter)+Task4(overlay)+persist；博客基础设施→Task8；组件架构→各 Task；技术栈→Task0；移除竖排诗句→已在 Task1 标注删除 `.poem`。
- **占位符**：着色器/滤镜/彩蛋/滚动算法标注「移植参考稿」指向对话中可见的确定源码，非 TBD；其余均给出完整代码。
- **类型一致**：`PROJECTS` 字段（no/tag/title/boot/desc/stack/code）与 `ProjectCard` Props 一致；`post.id` 用于 `params.slug` 与 `/blog/${p.id}`，与 `getStaticPaths` 一致；blog schema 字段（title/date/description/tags/draft）与 index/PostCard/详情页引用一致。
