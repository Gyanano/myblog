# 小工具区「器」+ 纯色背景生成器 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `extra-earth/` 新增独立的「器」工具区（`/tools` 索引 + 每个工具独立整页），并交付第一个工具「纯色背景生成器」（选色 / 复制 HEX·RGB / 导出指定分辨率纯色 PNG）。

**Architecture:** 工具区与动画库对称但独立：`src/tools/<id>/`（`meta.ts` 纯元数据 + 组件），`src/tools/registry.ts` 只汇总 meta（不导入组件，索引页因此轻量）。索引页 `/tools` 从 registry 列瓷砖链到 `/tools/<id>`；每个工具一页 `src/pages/tools/<id>.astro` 直接 import 自己的组件并以 `client:only="react"` island 渲染（天然按页代码分割）。

**Tech Stack:** Astro 6.4.2、`@astrojs/react`、React、TypeScript（Astro strict）。纯前端 Canvas（`toBlob`）导出 PNG，无新依赖。

## Global Constraints

- Node `>=22.12.0`；Astro 6.4.2；**本仓库无测试/lint 设施**——每个任务的验证用 `npx astro check`（0 errors）+ `npm run build` + 真实浏览器手测，不引入测试框架。
- 水墨视觉复用 `src/styles/global.css` 的 CSS 变量：`--paper-bg` / `--ink-dark` / `--ink-base` / `--ink-light` / `--ink-wash` / `--cinnabar` / `--font-serif` / `--font-mono`。
- **`meta.id` 必须等于其文件夹名，也等于 url 短名**（`/tools/<id>`）。
- **`src/tools/registry.ts` 只 import 各 `meta.ts`（纯元数据），不得 import 任何工具组件**（保持索引页轻量）。
- 工具页用 `client:only="react"` 渲染工具组件（纯交互、无需 SSR）。
- 纯色背景生成器：默认色 `#BE3A3A`；Hex 校验 `#RGB`/`#RRGGBB`（无效则忽略、保留上一个有效值）；导出分辨率范围夹取 `1–8192`。
- React 交互组件走 island，不写裸 `<script>`。

---

## File Structure

| 文件 | 职责 |
|---|---|
| `src/tools/types.ts`（建） | `ToolMeta` 类型 |
| `src/tools/registry.ts`（建） | `tools: ToolMeta[]`（仅元数据） |
| `src/pages/tools/index.astro`（建） | 「器」索引页，列瓷砖链到 `/tools/<id>` |
| `src/consts.ts`（改） | NAV 增加 `/tools`「器」 |
| `src/tools/color-bg/ColorBg.tsx`（建） | 纯色背景生成器交互组件 |
| `src/tools/color-bg/meta.ts`（建） | 该工具 `ToolMeta` |
| `src/pages/tools/color-bg.astro`（建） | 工具页：BaseLayout + island |

---

## Task 1: 工具区基建（类型 + 空 registry + 索引页 + 导航）

**Files:**
- Create: `src/tools/types.ts`
- Create: `src/tools/registry.ts`
- Create: `src/pages/tools/index.astro`
- Modify: `src/consts.ts`

**Interfaces:**
- Consumes: `BaseLayout`、`NAV`。
- Produces: `ToolMeta = { id: string; title: string; description: string; category: string }`；`tools: ToolMeta[]`（本任务为空）；可访问的 `/tools` 索引页；导航「器」。

- [ ] **Step 1: 创建 `src/tools/types.ts`**

```ts
export type ToolMeta = {
  /** = 文件夹名 = url 短名（/tools/<id>） */
  id: string;
  title: string;
  description: string;
  /** 设计 / 视频 / 文本 … */
  category: string;
};
```

- [ ] **Step 2: 创建 `src/tools/registry.ts`（先空）**

```ts
import type { ToolMeta } from './types';

// 仅汇总元数据：禁止 import 任何工具组件，保持索引页轻量。
export const tools: ToolMeta[] = [];
```

- [ ] **Step 3: 在 NAV 增加「器」**

把 `src/consts.ts` 的 `NAV` 改为（在 `/lab` 之后、`/blog` 之前插入）：
```ts
export const NAV = [
  { href: "/about", label: "道", en: "About" },
  { href: "/work", label: "术", en: "Work" },
  { href: "/lab", label: "演", en: "Lab" },
  { href: "/tools", label: "器", en: "Tools" },
  { href: "/blog", label: "墨痕", en: "Blog" },
];
```

- [ ] **Step 4: 创建 `src/pages/tools/index.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { tools } from "../../tools/registry";
---

<BaseLayout title="器" description="日常小工具">
  <section id="tools">
    <h2 class="gs-title">器 / 工具</h2>
    <p
      class="gs-stagger"
      style="border-left:2px solid var(--cinnabar);padding-left:1rem;font-family:var(--font-calligraphy);font-size:1.6rem;color:var(--ink-dark)"
    >
      利器在手。<br />
      <span style="font-family:var(--font-serif);font-size:1rem;color:var(--ink-light)">
        一些日常会用到的小工具，多数也服务于内容创作。
      </span>
    </p>
    {tools.length === 0 ? (
      <p class="gs-stagger" style="color:var(--ink-light);font-family:var(--font-mono)">
        &gt; 工具整理中…
      </p>
    ) : (
      <ul
        class="gs-stagger"
        style="list-style:none;padding:0;margin-top:2rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem"
      >
        {tools.map((t) => (
          <li>
            <a
              href={`/tools/${t.id}`}
              style="display:block;padding:1.2rem 1.3rem;border:1px solid var(--ink-wash);border-radius:2px;text-decoration:none;color:inherit;transition:border-color .2s"
            >
              <span
                style="font-family:var(--font-mono);font-size:.7rem;color:var(--cinnabar);border:1px solid var(--cinnabar);padding:.1rem .5rem;border-radius:2px"
              >
                {t.category}
              </span>
              <h3 style="margin:.6rem 0 .3rem;font-family:var(--font-serif);color:var(--ink-dark)">
                {t.title}
              </h3>
              <p style="margin:0;color:var(--ink-light);font-size:.9rem">{t.description}</p>
            </a>
          </li>
        ))}
      </ul>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 5: 类型检查**

Run: `npx astro check`
Expected: 0 errors（允许既有 hints）。

- [ ] **Step 6: 构建验证**

Run: `npm run build`
Expected: 构建成功，生成 `dist/tools/index.html`。

- [ ] **Step 7: Commit**

```bash
git add src/tools/types.ts src/tools/registry.ts src/pages/tools/index.astro src/consts.ts
git commit -m "feat: add tools section scaffold (/tools index + 器 nav)"
```

---

## Task 2: 纯色背景生成器

**Files:**
- Create: `src/tools/color-bg/ColorBg.tsx`
- Create: `src/tools/color-bg/meta.ts`
- Create: `src/pages/tools/color-bg.astro`
- Modify: `src/tools/registry.ts`

**Interfaces:**
- Consumes: `ToolMeta`（Task 1）、`tools` 数组（Task 1）、`BaseLayout`。
- Produces: 默认导出 `ColorBg` 组件；`meta`（id `color-bg`）注册进 `tools`；可访问的 `/tools/color-bg` 工具页。

- [ ] **Step 1: 创建组件 `src/tools/color-bg/ColorBg.tsx`**

```tsx
import { useState } from 'react';
import type { CSSProperties } from 'react';

const PRESETS = [
  { label: '1920×1080', w: 1920, h: 1080 },
  { label: '3840×2160', w: 3840, h: 2160 },
  { label: '1080×1080', w: 1080, h: 1080 },
  { label: '1080×1920', w: 1080, h: 1920 },
];

/** 归一化为 #RRGGBB（接受 #RGB / RGB / #RRGGBB / RRGGBB，大小写均可）；无效返回 null */
function normalizeHex(input: string): string | null {
  let s = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(s)) {
    s = s.split('').map((c) => c + c).join('');
  }
  if (/^[0-9a-fA-F]{6}$/.test(s)) return '#' + s.toUpperCase();
  return null;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const s = hex.replace(/^#/, '');
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const btn: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.85rem',
  padding: '0.4rem 0.9rem',
  border: '1px solid var(--ink-light, #8A857D)',
  background: 'transparent',
  color: 'var(--ink-dark, #2A2825)',
  cursor: 'pointer',
  borderRadius: 2,
};

const field: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.9rem',
  padding: '0.35rem 0.5rem',
  border: '1px solid var(--ink-wash, rgba(42,40,37,0.2))',
  borderRadius: 2,
  background: 'transparent',
  color: 'var(--ink-dark, #2A2825)',
};

const label: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.7rem',
  color: 'var(--ink-light, #8A857D)',
  display: 'block',
  marginBottom: '0.3rem',
};

export default function ColorBg() {
  const [color, setColor] = useState('#BE3A3A');
  const [hexInput, setHexInput] = useState('#BE3A3A');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [copied, setCopied] = useState<string | null>(null);

  const { r, g, b } = hexToRgb(color);
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  const onHexInput = (v: string) => {
    setHexInput(v);
    const norm = normalizeHex(v);
    if (norm) setColor(norm);
  };
  const onPicker = (v: string) => {
    const up = v.toUpperCase();
    setColor(up);
    setHexInput(up);
  };

  const copy = async (key: string, text: string) => {
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable (需 HTTPS 或 localhost)');
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error('[ColorBg] 复制失败：', err);
    }
  };

  const exportPng = () => {
    const w = clamp(Math.round(width) || 1, 1, 8192);
    const h = clamp(Math.round(height) || 1, 1, 8192);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `color-${color.replace('#', '').toUpperCase()}-${w}x${h}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 实时预览 */}
      <div
        style={{
          height: '38vh',
          minHeight: 220,
          borderRadius: 2,
          border: '1px solid var(--ink-wash, rgba(42,40,37,0.15))',
          background: color,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '0.8rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.85)',
            mixBlendMode: 'difference',
          }}
        >
          {color} · {rgbString}
        </span>
      </div>

      {/* 取色 + 色值 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', alignItems: 'flex-end' }}>
        <div>
          <span style={label}>取色器</span>
          <input
            type="color"
            value={color}
            onChange={(e) => onPicker(e.target.value)}
            style={{ width: 56, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }}
          />
        </div>
        <div>
          <span style={label}>HEX</span>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => onHexInput(e.target.value)}
            spellCheck={false}
            style={{ ...field, width: 110 }}
          />
        </div>
        <div>
          <span style={label}>RGB</span>
          <input type="text" value={rgbString} readOnly style={{ ...field, width: 160 }} />
        </div>
        <button style={btn} onClick={() => copy('hex', color)}>
          {copied === 'hex' ? '已复制 ✓' : '复制 HEX'}
        </button>
        <button style={btn} onClick={() => copy('rgb', rgbString)}>
          {copied === 'rgb' ? '已复制 ✓' : '复制 RGB'}
        </button>
      </div>

      {/* 分辨率 + 导出 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              style={{
                ...btn,
                borderColor:
                  width === p.w && height === p.h ? 'var(--cinnabar, #BE3A3A)' : 'var(--ink-light, #8A857D)',
                color:
                  width === p.w && height === p.h ? 'var(--cinnabar, #BE3A3A)' : 'var(--ink-dark, #2A2825)',
              }}
              onClick={() => {
                setWidth(p.w);
                setHeight(p.h);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', alignItems: 'flex-end' }}>
          <div>
            <span style={label}>宽 (px)</span>
            <input
              type="number"
              min={1}
              max={8192}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              style={{ ...field, width: 100 }}
            />
          </div>
          <div>
            <span style={label}>高 (px)</span>
            <input
              type="number"
              min={1}
              max={8192}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              style={{ ...field, width: 100 }}
            />
          </div>
          <button style={{ ...btn, borderColor: 'var(--cinnabar)', color: 'var(--cinnabar)' }} onClick={exportPng}>
            导出 PNG
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 `src/tools/color-bg/meta.ts`**

```ts
import type { ToolMeta } from '../types';

export const meta: ToolMeta = {
  id: 'color-bg',
  title: '纯色背景生成器',
  description: '选色并导出指定分辨率的纯色 PNG，可复制 HEX / RGB。',
  category: '设计',
};
```

- [ ] **Step 3: 注册进 registry**

把 `src/tools/registry.ts` 改为：
```ts
import type { ToolMeta } from './types';
import { meta as colorBg } from './color-bg/meta';

// 仅汇总元数据：禁止 import 任何工具组件，保持索引页轻量。
export const tools: ToolMeta[] = [colorBg];
```

- [ ] **Step 4: 创建工具页 `src/pages/tools/color-bg.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import ColorBg from "../../tools/color-bg/ColorBg.tsx";
---

<BaseLayout title="纯色背景生成器" description="选色并导出指定分辨率的纯色 PNG">
  <section id="tool-color-bg">
    <a
      href="/tools"
      style="font-family:var(--font-mono);font-size:.8rem;color:var(--ink-light);text-decoration:none"
    >&lt; 器 / 工具</a>
    <h2 class="gs-title" style="margin-top:.5rem">纯色背景生成器</h2>
    <div class="gs-stagger" style="margin-top:1.5rem;max-width:760px">
      <ColorBg client:only="react" />
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 5: 类型检查**

Run: `npx astro check`
Expected: 0 errors。

- [ ] **Step 6: 构建验证**

Run: `npm run build`
Expected: 构建成功，生成 `dist/tools/color-bg/index.html`，且 `dist/tools/index.html` 此时应能列出「纯色背景生成器」瓷砖。

- [ ] **Step 7: 真实浏览器验收（dev）**

Run: `npm run dev`，浏览器打开 `http://localhost:4321/tools`，确认：
- 导航有「器」；索引页出现「纯色背景生成器」瓷砖，点击进入 `/tools/color-bg`；
- 改取色器 / 输入 Hex（如 `#1a1a1a`、`f00`）→ 预览块与 RGB 实时联动；无效 Hex（如 `zzz`）被忽略；
- 「复制 HEX」「复制 RGB」点击变「已复制 ✓」，粘贴出对应值；
- 选预设或填自定义宽高后点「导出 PNG」→ 下载到形如 `color-FF0000-1920x1080.png` 的纯色图片，打开尺寸/颜色正确。

Expected: 以上全部满足。

- [ ] **Step 8: Commit**

```bash
git add src/tools/color-bg src/tools/registry.ts src/pages/tools/color-bg.astro
git commit -m "feat: add color background generator tool (/tools/color-bg)"
```

---

## Self-Review

**1. Spec coverage：**
- §2 独立工具区结构（types/registry/index/工具页/folder）→ Task 1 + Task 2 ✅
- §2 registry 仅元数据、索引页轻量 → Task 1 Step 2 + Global Constraints ✅
- §2 ToolMeta 字段（id/title/description/category）、id=folder=slug → Task 1 Step 1 + Task 2 meta ✅
- §3 `/tools` 索引 + 导航「器」+ 瓷砖链 `/tools/<id>` + 水墨视觉 → Task 1 ✅
- §4 取色器 + Hex 校验 + RGB 读数联动 → Task 2 Step 1（normalizeHex/onHexInput/onPicker）✅
- §4 实时预览 → Task 2 预览块 ✅
- §4 复制 HEX/RGB + 容错 → Task 2 copy() ✅
- §4 导出 PNG（预设 + 自定义宽高 1–8192 夹取 + 文件名）→ Task 2 exportPng/PRESETS ✅
- §4 默认色 #BE3A3A → Task 2 useState('#BE3A3A') ✅
- §4 client:only="react" 工具页 → Task 2 Step 4 ✅
- §4 明确不做（全屏/调色板/动态路由）→ 计划未涉及 ✅
- §5 验收（astro check / build / 手测）→ 两任务的验证步骤 ✅

**2. Placeholder scan：** 无 TBD/TODO；每个改代码步骤均含完整代码与确切命令、预期输出。✅

**3. Type consistency：** `ToolMeta` 字段在 Task 1 定义，Task 2 meta 与 index 页使用一致（`id/title/description/category`）；`tools` 数组类型一致；`normalizeHex/hexToRgb/clamp/exportPng/PRESETS` 均在 Task 2 内自洽定义与使用。✅
