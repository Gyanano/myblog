# Remotion 动画库 + 「演」画廊 — 设计规格

- 日期：2026-06-21
- 项目：`extra-earth/`（Astro 6，部署到 Cloudflare，项目名 `myblog`）
- 作者人设：Gyanano —— 嵌入式 + 全栈工程师，INTP 逻辑学家

## 1. 背景与目标

作者想用 AI Agent + Remotion 逐步接手视频制作。当前痛点：**每次都要向 Agent 详细描述每一个动画，非常痛苦**。

目标是积累一个**个人 Remotion 动画库**，让以后「想要某个动画」时，直接把对应的 prompt 或代码交给 Agent 就能复用，并把这个库**集成进现有博客网站**作为日常取用入口。

### 需求决策（已与用户确认）

1. **库主要服务谁**：主要给 Agent 用——核心资产是「可复用的 Remotion 代码 + 打磨好的 prompt」，网站是取用入口。
2. **起点**：完全从零（尚未安装 Remotion，无既有动画）。
3. **位置**：放在 `extra-earth/` 博客仓库内（方案 ①：单仓库、单 `package.json`）。
4. **取用方式**：**复制粘贴**——在网站画廊翻到动画后，整块复制，粘到 Agent 对话里。→ 画廊是日常主力工具，不是橱窗。
5. **复制内容**：复制前**可切换「代码 / Prompt」**。Prompt 对非技术的人更友好、更方便基于它修改；代码给能直接落地的人。

### 成功标准

- `extra-earth/` 内存在一个结构化的动画库，新增一个动画 = 新增一个文件夹（组件 + meta）。
- 网站 `/lab`（「演」）画廊页能**浏览器实时预览**每个动画，并提供「复制代码 / 复制 Prompt」两种取用。
- 本地可对同一批组件跑 `npx remotion render` 导出 mp4。
- 视频渲染链路与 Cloudflare 静态部署互不干扰。
- `npm run build` 通过。

## 2. 关键技术澄清

Remotion 的「渲染出视频」与博客「部署到 Cloudflare」是两条线：

- **动画组件本质是 React**——可放进 `extra-earth/`，并用 `@remotion/player` 在浏览器实时预览（作为 Astro 的 React island）。这条随博客一起 deploy。
- **导出 mp4** 靠本地 `@remotion/renderer`（headless Chrome 渲染），是本地/CI 跑命令，**不进 Cloudflare 静态部署**。

→ 一份组件代码是唯一源头，同时被「浏览器预览」和「本地渲染」复用。

## 3. 架构方案（方案 ①）

单仓库、单 `package.json`，组件做唯一源头。在 `extra-earth/` 现有 `package.json` 中加 Remotion 依赖 + `@astrojs/react`。

理由：个人库，摩擦越小越好，YAGNI 掉 npm workspaces 的复杂度；等库规模大到依赖冲突再拆。

## 4. 目录结构（均在 `extra-earth/` 内）

```
extra-earth/
├─ src/
│  ├─ animations/                 ← 动画库本体（唯一源头）
│  │  ├─ ink-spread/
│  │  │  ├─ InkSpread.tsx         ← Remotion 组件（useCurrentFrame 等）
│  │  │  └─ meta.ts               ← 标题/分类/描述/Prompt/参数/渲染配置
│  │  ├─ text-fade-in/
│  │  │  ├─ TextFadeIn.tsx
│  │  │  └─ meta.ts
│  │  └─ registry.ts              ← 汇总所有动画，画廊与渲染入口都读它
│  ├─ components/
│  │  └─ AnimationCard.tsx        ← React island：预览 + 两个复制按钮
│  └─ pages/
│     └─ lab.astro                ← 「演」画廊页
├─ remotion/
│  ├─ Root.tsx                    ← 把每个动画注册成 <Composition>
│  └─ index.ts                    ← registerRoot()
└─ remotion.config.ts             ← Remotion 本地渲染配置
```

**「复制代码」实现**：用 Vite 的 `?raw` 导入把 `*.tsx` 源码当字符串读入，而非另存一份代码。保证复制出的代码永远与真正在跑的组件一致，不会失同步。

## 5. 单个动画单元 = 组件 + meta

`meta.ts` 是这个库省事的核心资产，结构如下：

```ts
export const meta = {
  id: 'ink-spread',
  title: '墨点扩散',
  category: '入场',              // 入场/退场/强调/转场/背景…
  description: '一滴墨从中心晕开扩散到全屏',
  prompt: `做一个「墨点扩散」入场动画：
- 中心出现小墨点，0–30 帧快速放大并向外晕染，边缘带不规则水墨毛刺
- 用 spring 缓动做「先快后慢」的渗透感
可调：墨色、扩散速度、最终覆盖范围、是否带颗粒噪点`,
  params: [
    { name: 'color', desc: '墨色', default: '#1a1a1a' },
    { name: 'speed', desc: '扩散速度(帧)', default: 30 },
  ],
  fps: 30, durationInFrames: 60, width: 1920, height: 1080,
};
```

### Prompt 固定模板

`prompt` 字段就是「复制 Prompt」吐出的内容。所有动画统一遵循模板，保证风格一致、Agent/他人一看就懂：

1. **一句话效果定义**（这是什么动画）。
2. **分段时间轴**（按帧/时间区间描述每一段的变化）。
3. **可调项**（哪些参数可以改、各自影响什么）。

`params` 是机器可读的可调参数清单（驱动卡片上的参数展示，也是 Remotion `defaultProps` 的来源）。

## 6. 「演」画廊页（`/lab`）

- **路由**：新增 `/lab`，导航单字标题 **「演」**（演示/演绎），与现有 序/道/术/墨痕 风格一致。以后日常小工具可挂在该区下扩展。
- **每张卡片**（`AnimationCard.tsx`，React island，`client:visible`）：
  - `@remotion/player` 浏览器实时预览（可播放/循环）；
  - 分类标签 + 标题 + 描述；
  - **两个复制按钮：「复制代码」「复制 Prompt」**，点击后短暂变「已复制 ✓」。
- 沿用博客水墨视觉（宣纸底、朱砂点缀、serif 字体）。
- 卡片列表数据来自 `src/animations/registry.ts`。

## 7. 本地导出视频

`remotion/Root.tsx` 读 `registry.ts`，把每个动画注册为 `<Composition>`（id、组件、fps、durationInFrames、宽高、defaultProps 来自 meta）。本地命令：

```sh
npx remotion studio                                  # 可视化调试
npx remotion render ink-spread out/ink-spread.mp4    # 导出某个动画
```

仅本地/CI 运行，不影响 `npm run build` 与 `wrangler deploy`。

## 8. 第一版交付范围（YAGNI）

1. 安装 `@astrojs/react` + `react`/`react-dom` + Remotion 依赖（`remotion`、`@remotion/player`、`@remotion/cli`）。
2. 搭好第 4 节目录结构 + `/lab` 画廊页 + `AnimationCard`（预览 + 双复制）+ `registry.ts`。
3. **先做 2 个示例动画**跑通全链路：`墨点扩散`（ink-spread）+ `文字逐字淡入`（text-fade-in）。
4. 跑通本地 `remotion render` 至少导出 1 个 mp4 验证渲染链路。
5. 验收：`npm run build` 通过；`/lab` 能预览 2 个动画、两种复制都可用。

### 明确不做（本期）

- 日常小工具——等动画库模式验证后，复用 `/lab` 区域扩展。
- 机器可读清单 / Agent 直接读仓库的取用方式（当前取用方式是复制粘贴）。
- npm workspaces / Remotion 独立子项目拆分。

## 9. 风险与注意

- 引入 React 集成（`@astrojs/react`）首次进入本仓库——需确认与现有 GSAP/Lenis/three.js 脚本、View Transitions 不冲突；`AnimationCard` 走 island，限定客户端边界。
- `?raw` 导入是 Vite 特性，构建时即可用，注意 TypeScript 类型声明（`*.tsx?raw`）。
- Remotion 依赖体积较大，会进博客依赖树，但不影响最终静态产物。
- Node 要求 `>=22.12.0`（仓库现状），Remotion 满足。
