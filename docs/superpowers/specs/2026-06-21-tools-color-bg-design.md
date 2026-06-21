# 小工具区「器」+ 纯色背景生成器 — 设计规格

- 日期：2026-06-21
- 项目：`extra-earth/`（Astro 6，部署到 Cloudflare，项目名 `myblog`）
- 作者人设：Gyanano —— 嵌入式 + 全栈工程师，INTP 逻辑学家

## 1. 背景与目标

在博客中开辟一个**日常小工具**区，第一个工具是**纯色背景生成器**。整体目标是建立一套「加工具像加动画一样简单」的结构，并交付第一个可用工具验证它。

### 需求决策（已与用户确认）

1. **工具与动画库的关系**：独立新区，不与 `/lab` 混排。各有注册表与卡片样式。
2. **呈现方式**：索引页 + 每个工具独立整页（`/tools` 列瓷砖，点进 `/tools/<id>` 整页使用）。理由：未来工具功能丰富、需要空间，独立页也便于按需扩展、按页代码分割。
3. **第一个工具 `纯色背景生成器` 的 v1 核心**：**导出指定分辨率的纯色 PNG**（贴合做视频取背景素材的场景），外加基础的取色器 + Hex/RGB 输入 + 复制色值。

### 成功标准

- 导航出现「器」；`/tools` 索引页从注册表列出工具瓷砖，点击进入对应工具页。
- `/tools/color-bg` 可选色、复制 HEX/RGB、导出指定分辨率纯色 PNG。
- 索引页不加载任何工具组件本体（保持轻量）。
- 加一个新工具 = 建一个文件夹 + 注册表加一行 + 建一个很薄的页面文件。
- `npm run build` 通过。

## 2. 架构与目录结构（均在 `extra-earth/` 内）

```
src/tools/
├─ types.ts              # ToolMeta 类型
├─ registry.ts           # tools: ToolMeta[]（仅元数据，不导入组件 → 索引页轻量）
└─ color-bg/
   ├─ ColorBg.tsx        # 交互组件（React island）
   └─ meta.ts            # 本工具的 ToolMeta
src/pages/tools/
├─ index.astro           # 「器」索引页：从 registry 列瓷砖，链到 /tools/<id>
└─ color-bg.astro        # 薄页：BaseLayout + <ColorBg client:only="react" />
src/consts.ts            # NAV 增加 { href: "/tools", label: "器", en: "Tools" }
```

要点：

- **`src/tools/registry.ts` 只引用各 `meta.ts`（纯元数据，不导入组件）**，索引页因此不会把工具本体打进包里。
- **每个工具本体只在自己那一页加载**：`/tools/<id>.astro` 直接 import 该工具组件并以 island 渲染。天然按页代码分割，符合「功能丰富、按需扩展」诉求。
- 工具页用 `client:only="react"`：工具是纯交互应用、无需 SSR/SEO 内容，跳过服务端渲染最干净。

### ToolMeta

```ts
export type ToolMeta = {
  id: string;          // = 文件夹名 = url 短名（/tools/<id>）
  title: string;
  description: string;
  category: string;    // 设计 / 视频 / 文本 …
};
```

索引页链接由 id 推导：`/tools/${tool.id}`。

## 3. 「器」索引页 `/tools`

- `src/consts.ts` 的 `NAV` 增加 `{ href: "/tools", label: "器", en: "Tools" }`（放在「演」之后、「墨痕」之前）。
- 用 `BaseLayout`，标题「器」。网格瓷砖：每张 = 分类标签（朱砂描边）+ 标题 + 描述，整张 `<a href="/tools/${id}">` 可点。
- 沿用水墨视觉（`--paper-bg`/`--ink-*`/`--cinnabar`/`--font-serif`）。内部跳转自动走站点已有的 `TransitionOverlay` 水墨过场（拦截内链）。

## 4. 纯色背景生成器 `/tools/color-bg`（v1）

`src/pages/tools/color-bg.astro` = `BaseLayout`（标题「纯色背景生成器」）+ `<ColorBg client:only="react" />`。

`ColorBg.tsx`（一个 island，默认导出 React 组件）功能：

- **取色**：原生 `<input type="color">` + Hex 文本输入框 + RGB 只读读数，三者联动。
  - Hex 输入校验 `#RGB` / `#RRGGBB`（大小写均可）；无效输入忽略、保留上一个有效值。
- **实时预览**：一块大的颜色面板铺满当前所选颜色。
- **复制**：「复制 HEX」「复制 RGB」按钮，点击短暂变「已复制 ✓」；剪贴板调用带容错（`navigator.clipboard` 不可用时 `console.error`，不抛未捕获异常）——复用画廊已验证的写法。
- **导出 PNG**：
  - 分辨率预设按钮：1920×1080、3840×2160、1080×1080、1080×1920。
  - 自定义宽、高数值输入，范围限制 1–8192（越界则夹取到边界）。
  - 点「导出 PNG」：用离屏 `<canvas>`（或 `document.createElement('canvas')`）设为所选宽高，`ctx.fillStyle = 颜色; ctx.fillRect(0,0,w,h)`，`canvas.toBlob(blob => 触发下载)`。
  - 文件名形如 `color-BE3A3A-1920x1080.png`（hex 去掉 `#`、转大写）。
- 默认色：朱砂 `#BE3A3A`（呼应站点）。
- 视觉沿用水墨 token；控件用 `--font-mono` 等宽字体显示色值/数值。

### 明确不做（v1）

- 网页全屏铺色（用户选了导出路线；以后可加）。
- 调色板/历史色/渐变/多色（YAGNI，后续迭代）。
- 工具的动态路由（`/tools/[id].astro`）：v1 用显式每页文件，更简单、天然代码分割。

## 5. 第一版交付范围

1. 工具基建：`src/tools/types.ts`、`src/tools/registry.ts`、`/tools` 索引页、导航「器」。
2. 纯色背景生成器：`ColorBg.tsx` + `meta.ts` + `/tools/color-bg.astro`，注册进 registry。
3. 验收：`npx astro check` 0 errors；`npm run build` 通过；`/tools` 列出瓷砖并能进入；`/tools/color-bg` 能改色、复制 HEX/RGB、导出指定分辨率 PNG。

## 6. 风险与注意

- `client:only="react"` 的工具页在 SSR 阶段不渲染组件内容，构建时仍会处理该页——确认构建通过、首屏有 BaseLayout 外壳。
- Canvas `toBlob` 是异步且需在浏览器环境调用（island 内，天然客户端）；下载用临时 `<a download>` + `URL.createObjectURL`，用后 `revokeObjectURL`。
- 大分辨率（如 4K）Canvas 导出会占内存，限制上限 8192 已足够防御。
- 颜色解析：Hex→RGB 自行实现（支持 3/6 位），不引第三方色彩库（YAGNI）。
- 沿用客户端脚本约定：本工具是 React island，自管生命周期；站点 View Transitions 下 island 会在导航时重新挂载，无需额外处理。
