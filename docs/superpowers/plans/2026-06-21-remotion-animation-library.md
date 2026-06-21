# Remotion 动画库 + 「演」画廊 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `extra-earth/` 内搭一个个人 Remotion 动画库：每个动画是「组件 + meta(Prompt)」，网站 `/lab`(「演」) 画廊浏览器实时预览并支持「复制代码 / 复制 Prompt」，同一批组件可本地 `remotion render` 导出 mp4。

**Architecture:** 方案 ①——单仓库、单 `package.json`。动画组件放 `src/animations/<id>/`，是浏览器预览与本地渲染的唯一源头。`registry.ts` 汇总元数据（**保持 Remotion/webpack 安全，禁用 Vite 专属语法**）；画廊侧用 Vite 的 `import.meta.glob('...?raw')` 把组件源码当字符串读出来给「复制代码」。`@remotion/player` 在 React island 内预览，`remotion/Root.tsx` 把同一批组件注册成 `<Composition>` 供 CLI 渲染。

**Tech Stack:** Astro 6.4.2、`@astrojs/react`、React 18/19、Remotion 4（`remotion` / `@remotion/player` / `@remotion/cli`）、TypeScript（Astro strict）。

## Global Constraints

- Node `>=22.12.0`（仓库现状满足，本机 v25）。
- **本仓库无测试/lint 设施**（CLAUDE.md 明示）。本计划不引入测试框架（YAGNI）；每个任务的「测试周期」用 `astro check` / `npm run build` / `remotion render` 等**真实验证命令**代替单元测试。
- 水墨视觉：复用 `src/styles/global.css` 的 CSS 变量 `--paper-bg` / `--ink-dark` / `--ink-base` / `--ink-light` / `--ink-wash` / `--cinnabar` / `--font-serif` / `--font-mono`。
- **`meta.id` 必须等于其所在文件夹名**（画廊用文件夹名做 `id → 源码` 映射）。
- **`src/animations/registry.ts` 必须保持「Remotion 安全」**：只 `import` 普通 `.ts/.tsx`，**禁止** `?raw`、`import.meta.glob` 等 Vite 专属语法（Remotion 用 webpack 打包，识别不了）。
- React 交互组件一律走 island（`client:visible` 等），不要写裸 `<script>`；预览组件依赖 WebGL/Canvas，headless 环境可能空白，验收以真实浏览器为准。
- 导出视频链路只在本地/CI 跑，**不进 `npm run build` / `wrangler deploy`**。

---

## File Structure

| 文件 | 职责 |
|---|---|
| `astro.config.mjs`（改） | 启用 `@astrojs/react` 集成 |
| `package.json`（改） | 新增 react/remotion 依赖与 remotion 脚本 |
| `remotion.config.ts`（建） | Remotion CLI 渲染配置 |
| `src/animations/types.ts`（建） | `AnimationParam` / `AnimationMeta` 类型 |
| `src/animations/registry.ts`（建） | 汇总所有 `meta`（Remotion 安全，无 Vite 语法） |
| `src/animations/ink-spread/InkSpread.tsx`（建） | 动画①组件 |
| `src/animations/ink-spread/meta.ts`（建） | 动画①元数据 + Prompt |
| `src/animations/text-fade-in/TextFadeIn.tsx`（建） | 动画②组件 |
| `src/animations/text-fade-in/meta.ts`（建） | 动画②元数据 + Prompt |
| `remotion/Root.tsx`（建） | 把 registry 注册成 `<Composition>` |
| `remotion/index.ts`（建） | `registerRoot(RemotionRoot)` 入口 |
| `src/components/AnimationGallery.tsx`（建） | React island：网格 + Player 预览 + 双复制按钮 + `?raw` 源码读取 |
| `src/pages/lab.astro`（建） | 「演」画廊页，挂载 island |
| `src/consts.ts`（改） | NAV 增加 `/lab`「演」 |

---

## Task 1: 接入 React 集成与 Remotion 依赖

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`
- Create: `remotion.config.ts`

**Interfaces:**
- Consumes: 无。
- Produces: 项目可用 React island（`@astrojs/react`）、可用 `remotion`/`@remotion/player`/`@remotion/cli`、`npx remotion` 命令可运行。

- [ ] **Step 1: 用 astro add 接入 React（非交互）**

Run:
```bash
cd extra-earth
npx astro add react --yes
```
Expected: 自动安装 `@astrojs/react` + `react` + `react-dom`，并把 `astro.config.mjs` 改成含 `integrations: [react()]`，更新 `tsconfig.json` 的 jsx 设置。

- [ ] **Step 2: 安装 Remotion 依赖**

Run:
```bash
npm install remotion @remotion/player @remotion/cli
```
Expected: 三个包写入 `package.json` 的 `dependencies`，无报错。

- [ ] **Step 3: 新增 remotion 脚本**

在 `package.json` 的 `scripts` 中加入（保留已有项）：
```json
    "remotion:studio": "remotion studio remotion/index.ts",
    "remotion:render": "remotion render remotion/index.ts"
```

- [ ] **Step 4: 创建 `remotion.config.ts`（仓库根）**

`extra-earth/remotion.config.ts`：
```ts
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
```

- [ ] **Step 5: 验证 React 集成不破坏构建**

Run:
```bash
npm run build
```
Expected: 构建成功（与接入前一致，无新报错）。

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json package-lock.json tsconfig.json remotion.config.ts
git commit -m "chore: add @astrojs/react + remotion deps and config"
```

---

## Task 2: 动画单元类型 + 空 registry

**Files:**
- Create: `src/animations/types.ts`
- Create: `src/animations/registry.ts`

**Interfaces:**
- Consumes: 无。
- Produces:
  - `AnimationParam = { name: string; desc: string; default: string | number | boolean }`
  - `AnimationMeta = { id, title, category, description, prompt, params: AnimationParam[], component: ComponentType<any>, defaultProps: Record<string, unknown>, fps: number, durationInFrames: number, width: number, height: number }`
  - `animations: AnimationMeta[]`（本任务先为空数组）

- [ ] **Step 1: 创建 `src/animations/types.ts`**

```ts
import type { ComponentType } from 'react';

export type AnimationParam = {
  name: string;
  desc: string;
  default: string | number | boolean;
};

export type AnimationMeta = {
  /** 必须与所在文件夹名一致 */
  id: string;
  title: string;
  /** 入场 / 退场 / 强调 / 转场 / 背景 … */
  category: string;
  description: string;
  /** 「复制 Prompt」吐出的自然语言描述，遵循固定模板 */
  prompt: string;
  params: AnimationParam[];
  component: ComponentType<any>;
  /** Player 的 inputProps 与 Composition 的 defaultProps 共用 */
  defaultProps: Record<string, unknown>;
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
};
```

- [ ] **Step 2: 创建 `src/animations/registry.ts`（先空）**

```ts
import type { AnimationMeta } from './types';

// 注意：本文件被 Remotion(webpack) 与 Astro(vite) 共用，
// 禁止使用 ?raw / import.meta.glob 等 Vite 专属语法。
export const animations: AnimationMeta[] = [];
```

- [ ] **Step 3: 验证类型通过**

Run:
```bash
npx astro check
```
Expected: 0 errors（允许已有的 hint/warning，不应新增 error）。

- [ ] **Step 4: Commit**

```bash
git add src/animations/types.ts src/animations/registry.ts
git commit -m "feat: add animation meta types and empty registry"
```

---

## Task 3: 动画① 墨点扩散（ink-spread）

**Files:**
- Create: `src/animations/ink-spread/InkSpread.tsx`
- Create: `src/animations/ink-spread/meta.ts`
- Modify: `src/animations/registry.ts`

**Interfaces:**
- Consumes: `AnimationMeta`（Task 2）。
- Produces: `InkSpread`（props `{ color: string; speed: number }`）、`meta`（id `ink-spread`）、注册进 `animations`。

- [ ] **Step 1: 创建组件 `InkSpread.tsx`**

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export type InkSpreadProps = {
  color: string;
  speed: number;
};

export const InkSpread = ({ color, speed }: InkSpreadProps) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const progress = spring({ frame, fps, durationInFrames: speed, config: { damping: 200 } });
  const maxR = Math.hypot(width, height);
  const r = interpolate(progress, [0, 1], [0, maxR]);
  const opacity = interpolate(frame, [0, speed * 0.5, speed], [0, 1, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#F2EFE8', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          backgroundColor: color,
          opacity,
          filter: 'blur(8px)',
        }}
      />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: 创建 `meta.ts`（Prompt 遵循固定模板：效果定义 → 分段时间轴 → 可调项）**

```ts
import type { AnimationMeta } from '../types';
import { InkSpread } from './InkSpread';

export const meta: AnimationMeta = {
  id: 'ink-spread',
  title: '墨点扩散',
  category: '入场',
  description: '一滴墨从中心晕开扩散到全屏的入场效果',
  prompt: `做一个「墨点扩散」入场动画（Remotion 组件）：
效果：画面中心出现一个墨点，快速向外晕染扩散直到覆盖全屏，像水墨在宣纸上渗开。
时间轴（默认 30fps，约 60 帧）：
- 0–30 帧：墨点用 spring 缓动从 0 放大到覆盖全屏对角线半径，呈「先快后慢」的渗透感，边缘用 blur 制造水墨毛刺。
- 0–15 帧：不透明度 0 → 1；30–60 帧：稳定在约 0.85。
可调参数：
- color：墨色（默认 #1a1a1a）
- speed：扩散持续帧数，越小越快（默认 30）`,
  params: [
    { name: 'color', desc: '墨色', default: '#1a1a1a' },
    { name: 'speed', desc: '扩散持续帧数(越小越快)', default: 30 },
  ],
  component: InkSpread,
  defaultProps: { color: '#1a1a1a', speed: 30 },
  fps: 30,
  durationInFrames: 60,
  width: 1920,
  height: 1080,
};
```

- [ ] **Step 3: 注册进 registry**

把 `src/animations/registry.ts` 改为：
```ts
import type { AnimationMeta } from './types';
import { meta as inkSpread } from './ink-spread/meta';

// 注意：本文件被 Remotion(webpack) 与 Astro(vite) 共用，
// 禁止使用 ?raw / import.meta.glob 等 Vite 专属语法。
export const animations: AnimationMeta[] = [inkSpread];
```

- [ ] **Step 4: 验证类型通过**

Run:
```bash
npx astro check
```
Expected: 0 errors。

- [ ] **Step 5: Commit**

```bash
git add src/animations/ink-spread src/animations/registry.ts
git commit -m "feat: add ink-spread animation"
```

---

## Task 4: 动画② 文字逐字淡入（text-fade-in）

**Files:**
- Create: `src/animations/text-fade-in/TextFadeIn.tsx`
- Create: `src/animations/text-fade-in/meta.ts`
- Modify: `src/animations/registry.ts`

**Interfaces:**
- Consumes: `AnimationMeta`（Task 2）。
- Produces: `TextFadeIn`（props `{ text: string; color: string; staggerFrames: number }`）、`meta`（id `text-fade-in`）、注册进 `animations`。

- [ ] **Step 1: 创建组件 `TextFadeIn.tsx`**

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type TextFadeInProps = {
  text: string;
  color: string;
  staggerFrames: number;
};

export const TextFadeIn = ({ text, color, staggerFrames }: TextFadeInProps) => {
  const frame = useCurrentFrame();
  const chars = [...text];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F2EFE8', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', fontSize: 120, fontWeight: 700, color, fontFamily: 'serif' }}>
        {chars.map((ch, i) => {
          const start = i * staggerFrames;
          const opacity = interpolate(frame, [start, start + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [start, start + 12], [24, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span key={i} style={{ opacity, transform: `translateY(${y}px)`, whiteSpace: 'pre' }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: 创建 `meta.ts`**

```ts
import type { AnimationMeta } from '../types';
import { TextFadeIn } from './TextFadeIn';

export const meta: AnimationMeta = {
  id: 'text-fade-in',
  title: '文字逐字淡入',
  category: '强调',
  description: '标题文字逐字浮现淡入的强调效果',
  prompt: `做一个「文字逐字淡入」动画（Remotion 组件）：
效果：一行标题文字，每个字符依次从下方上浮并淡入，形成逐字浮现的节奏感。
时间轴（默认 30fps）：
- 第 i 个字符在第 i*staggerFrames 帧开始动画，历时约 12 帧：不透明度 0 → 1，同时纵向位移 24px → 0。
- 字符按顺序错峰开始，整体读起来像逐字落笔。
可调参数：
- text：要显示的文字（默认「水墨」）
- color：文字颜色（默认 #1a1a1a）
- staggerFrames：相邻字符的错峰帧数，越大越慢（默认 4）`,
  params: [
    { name: 'text', desc: '显示文字', default: '水墨' },
    { name: 'color', desc: '文字颜色', default: '#1a1a1a' },
    { name: 'staggerFrames', desc: '字符错峰帧数', default: 4 },
  ],
  component: TextFadeIn,
  defaultProps: { text: '水墨', color: '#1a1a1a', staggerFrames: 4 },
  fps: 30,
  durationInFrames: 60,
  width: 1920,
  height: 1080,
};
```

- [ ] **Step 3: 注册进 registry**

把 `src/animations/registry.ts` 改为：
```ts
import type { AnimationMeta } from './types';
import { meta as inkSpread } from './ink-spread/meta';
import { meta as textFadeIn } from './text-fade-in/meta';

// 注意：本文件被 Remotion(webpack) 与 Astro(vite) 共用，
// 禁止使用 ?raw / import.meta.glob 等 Vite 专属语法。
export const animations: AnimationMeta[] = [inkSpread, textFadeIn];
```

- [ ] **Step 4: 验证类型通过**

Run:
```bash
npx astro check
```
Expected: 0 errors。

- [ ] **Step 5: Commit**

```bash
git add src/animations/text-fade-in src/animations/registry.ts
git commit -m "feat: add text-fade-in animation"
```

---

## Task 5: Remotion 渲染入口 + 导出 mp4 验证

**Files:**
- Create: `remotion/Root.tsx`
- Create: `remotion/index.ts`

**Interfaces:**
- Consumes: `animations`（Task 3/4）。
- Produces: 可运行 `remotion studio` / `remotion render`，每个动画 id 对应一个 `<Composition>`。

- [ ] **Step 1: 创建 `remotion/Root.tsx`**

```tsx
import { Composition } from 'remotion';
import { animations } from '../src/animations/registry';

export const RemotionRoot = () => {
  return (
    <>
      {animations.map((a) => (
        <Composition
          key={a.id}
          id={a.id}
          component={a.component}
          durationInFrames={a.durationInFrames}
          fps={a.fps}
          width={a.width}
          height={a.height}
          defaultProps={a.defaultProps}
        />
      ))}
    </>
  );
};
```

- [ ] **Step 2: 创建 `remotion/index.ts`**

```ts
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
```

- [ ] **Step 3: 列出 compositions 确认入口可被识别**

Run:
```bash
npx remotion compositions remotion/index.ts
```
Expected: 输出包含 `ink-spread` 与 `text-fade-in` 两个 composition id。

> 若 Remotion CLI 版本提示找不到入口或 props 名不符，按 `npx remotion --help` 与 `@remotion/cli` 当前版本调整命令/属性名（核心 API：`Composition` 的 `id/component/durationInFrames/fps/width/height/defaultProps`）。

- [ ] **Step 4: 导出一个 mp4 验证渲染链路**

Run:
```bash
npx remotion render remotion/index.ts ink-spread out/ink-spread.mp4
```
Expected: 生成 `out/ink-spread.mp4`，文件大小 > 0。

- [ ] **Step 5: 把渲染产物目录加入 .gitignore**

在 `extra-earth/.gitignore` 追加一行（若文件不存在则创建）：
```
out/
```

- [ ] **Step 6: Commit**

```bash
git add remotion/Root.tsx remotion/index.ts .gitignore
git commit -m "feat: add remotion render entry (Root + registerRoot)"
```

---

## Task 6: 画廊 island（预览 + 双复制）

**Files:**
- Create: `src/components/AnimationGallery.tsx`

**Interfaces:**
- Consumes: `animations`（registry）、各组件 `.tsx` 源码（经 `import.meta.glob('...?raw')`，按文件夹名=`id` 映射）。
- Produces: 默认导出 React 组件 `AnimationGallery`，自包含整个动画网格（Player 预览 + 「复制代码」「复制 Prompt」）。

> 关键：`@remotion/player` 与组件函数**不能作为 props 跨 Astro→island 边界传递**（Astro 只能序列化 JSON）。因此整个网格由这一个 island 内部 `import` registry 完成，Astro 页面只负责挂载它。`?raw` 源码读取放在此处（Vite 侧），不污染 registry。

- [ ] **Step 1: 创建 `src/components/AnimationGallery.tsx`**

```tsx
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Player } from '@remotion/player';
import { animations } from '../animations/registry';

// 以文件夹名(=id)为键，读取每个动画组件的源码字符串（Vite 专属，仅画廊侧使用）
const codeModules = import.meta.glob('../animations/*/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const codeById: Record<string, string> = {};
for (const [path, src] of Object.entries(codeModules)) {
  const folder = path.split('/').slice(-2)[0];
  codeById[folder] = src;
}

const btnStyle: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.85rem',
  padding: '0.4rem 0.9rem',
  border: '1px solid var(--ink-light, #8A857D)',
  background: 'transparent',
  color: 'var(--ink-dark, #2A2825)',
  cursor: 'pointer',
  borderRadius: 2,
};

const tagStyle: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.7rem',
  color: 'var(--cinnabar, #BE3A3A)',
  border: '1px solid var(--cinnabar, #BE3A3A)',
  padding: '0.1rem 0.5rem',
  borderRadius: 2,
};

type CopyKind = 'code' | 'prompt';

function CopyButtons({ code, prompt }: { code: string; prompt: string }) {
  const [copied, setCopied] = useState<CopyKind | null>(null);
  const copy = async (kind: CopyKind, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
      <button style={btnStyle} onClick={() => copy('code', code)}>
        {copied === 'code' ? '已复制 ✓' : '复制代码'}
      </button>
      <button style={btnStyle} onClick={() => copy('prompt', prompt)}>
        {copied === 'prompt' ? '已复制 ✓' : '复制 Prompt'}
      </button>
    </div>
  );
}

export default function AnimationGallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
      {animations.map((a) => (
        <article key={a.id} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', border: '1px solid var(--ink-wash, rgba(42,40,37,0.1))' }}>
            <Player
              component={a.component}
              durationInFrames={a.durationInFrames}
              fps={a.fps}
              compositionWidth={a.width}
              compositionHeight={a.height}
              inputProps={a.defaultProps}
              style={{ width: '100%' }}
              controls
              loop
              autoPlay
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <span style={tagStyle}>{a.category}</span>
            <h3 style={{ margin: '0.4rem 0 0.2rem', fontFamily: 'var(--font-serif, serif)', color: 'var(--ink-dark)' }}>
              {a.title}
            </h3>
            <p style={{ margin: 0, color: 'var(--ink-light)', fontSize: '0.9rem' }}>{a.description}</p>
          </div>
          <CopyButtons code={codeById[a.id] ?? ''} prompt={a.prompt} />
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: 验证类型通过**

Run:
```bash
npx astro check
```
Expected: 0 errors（若 `import.meta.glob` 的 raw 类型报错，把 `as Record<string, string>` 断言保留即可；如仍报 `?raw` 模块未声明，新增 `src/animations/raw.d.ts` 内容 `declare module '*?raw' { const s: string; export default s; }`）。

- [ ] **Step 3: Commit**

```bash
git add src/components/AnimationGallery.tsx src/animations/raw.d.ts 2>/dev/null; git add src/components/AnimationGallery.tsx
git commit -m "feat: add AnimationGallery island with player preview and dual copy"
```

---

## Task 7: 「演」画廊页 + 导航入口

**Files:**
- Create: `src/pages/lab.astro`
- Modify: `src/consts.ts`

**Interfaces:**
- Consumes: `AnimationGallery`（Task 6）、`BaseLayout`、`NAV`。
- Produces: 路由 `/lab` 可访问；顶部导航出现「演」。

- [ ] **Step 1: 在 NAV 增加「演」**

把 `src/consts.ts` 的 `NAV` 改为（在 `/work` 后插入）：
```ts
export const NAV = [
  { href: "/about", label: "道", en: "About" },
  { href: "/work", label: "术", en: "Work" },
  { href: "/lab", label: "演", en: "Lab" },
  { href: "/blog", label: "墨痕", en: "Blog" },
];
```

- [ ] **Step 2: 创建 `src/pages/lab.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import AnimationGallery from "../components/AnimationGallery.tsx";
---

<BaseLayout title="演" description="Remotion 动画库">
  <section id="lab">
    <h2 class="gs-title">演 / 动画库</h2>
    <p
      class="gs-stagger"
      style="border-left:2px solid var(--cinnabar);padding-left:1rem;font-family:var(--font-calligraphy);font-size:1.6rem;color:var(--ink-dark)"
    >
      取其形，得其神。<br />
      <span style="font-family:var(--font-serif);font-size:1rem;color:var(--ink-light)">
        每个动画可实时预览，并一键复制「代码」或「Prompt」交给 Agent 复用。
      </span>
    </p>
    <div class="gs-stagger" style="margin-top:2rem">
      <AnimationGallery client:visible />
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: 构建验证**

Run:
```bash
npm run build
```
Expected: 构建成功，`dist/lab/index.html` 生成。

- [ ] **Step 4: 真实浏览器验收（dev）**

Run:
```bash
npm run dev
```
然后在浏览器打开 `http://localhost:4321/lab`，确认：
- 导航出现「演」，点击可达 `/lab`；
- 两张卡片各有可播放的 Player 预览（墨点扩散、文字逐字淡入）；
- 「复制代码」「复制 Prompt」点击后变「已复制 ✓」，粘贴出的内容分别是组件源码与 Prompt 文案。

Expected: 以上全部满足。

- [ ] **Step 5: Commit**

```bash
git add src/pages/lab.astro src/consts.ts
git commit -m "feat: add /lab gallery page and nav entry"
```

---

## Self-Review

**1. Spec coverage（逐条对照 spec）：**
- §3 方案①单仓库单 package.json → Task 1 ✅
- §4 目录结构（animations/、components/、pages/、remotion/、remotion.config.ts）→ Task 1–7 ✅
- §4 `?raw` 复制代码且与组件同源 → Task 6（`import.meta.glob ?raw`，源码即组件文件）✅
- §5 组件 + meta，meta 字段（id/title/category/description/prompt/params/fps/duration/width/height + component/defaultProps）→ Task 2 类型 + Task 3/4 实例 ✅
- §5 Prompt 固定模板（效果定义→分段时间轴→可调项）→ Task 3/4 的 prompt 文案 ✅
- §6 `/lab`「演」路由 + 导航 + 卡片（预览/标签/标题/描述/双复制）+ 水墨视觉 → Task 6/7 ✅
- §6 数据来自 registry → Task 6 import ✅
- §7 本地导出（Root 注册 Composition、studio/render 命令）→ Task 5 ✅
- §8 第一版范围（装依赖、结构、2 动画、导出 1 个 mp4、build 通过）→ Task 1–7 ✅
- §8 明确不做（小工具/机器清单/workspace）→ 计划未涉及 ✅
- §9 风险（React 首次引入、`?raw` 类型、Remotion 依赖体积、Node 版本）→ Task 1/6 的验证步骤与备注覆盖 ✅

**2. Placeholder scan：** 无 TBD/TODO；每个改代码的步骤都给了完整代码与确切命令、预期输出。✅

**3. Type consistency：** `AnimationMeta` 字段在 Task 2 定义，Task 3/4 实例、Task 5 `Root.tsx`、Task 6 island 使用的字段名（`component/durationInFrames/fps/width/height/defaultProps/prompt/category/description/title/id`）一致；`id`=文件夹名 约束被 Task 6 的 `codeById` 映射依赖，已在 Global Constraints 与 Task 3/4 注释中固定。✅

**已知执行期注意点**（非 plan 缺陷）：Remotion CLI 的入口/属性名可能随版本细微变化，Task 5 Step 3 已给回退指引；`import.meta.glob` raw 类型若报错，Task 6 Step 2 给了 `raw.d.ts` 兜底。
