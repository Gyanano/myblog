---
name: Gyanano · 竹言
description: 暗室与一束手电：一位工程师的硬件和软件展厅。
colors:
  touch-green: "#5fd4a0"
  touch-green-hover: "#79e0b3"
  on-green: "#06140e"
  warm-light: "#fff1dc"
  bg: "#060708"
  bg-2: "#101113"
  line: "#222327"
  line-2: "rgba(255, 255, 255, 0.1)"
  ink: "#eeece6"
  ink-2: "#b9b6ae"
  dim: "#85837d"
typography:
  display:
    fontFamily: "Anybody, Hanken Grotesk, sans-serif"
    fontSize: "clamp(56px, 8vw, 110px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 128"
  logo:
    fontFamily: "Anybody, Hanken Grotesk, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 128"
  headline:
    fontFamily: "Hanken Grotesk, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, system-ui, sans-serif"
    fontSize: "clamp(44px, 6vw, 92px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Hanken Grotesk, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, system-ui, sans-serif"
    fontSize: "clamp(22px, 2vw, 28px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Hanken Grotesk, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  prose:
    fontFamily: "Hanken Grotesk, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "Hanken Grotesk, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 450
    lineHeight: 1.3
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  pill: "999px"
spacing:
  page-gutter: "clamp(24px, 10vw, 180px)"
  docs-gutter: "clamp(20px, 2.6vw, 44px)"
  section-top: "clamp(84px, 16vh, 170px)"
  header-height: "64px"
  header-compact-height: "50px"
  sidebar-width: "280px"
  toc-width: "240px"
  row-y: "20px"
  list-row-y: "13px"
components:
  button-primary:
    backgroundColor: "{colors.touch-green}"
    textColor: "{colors.on-green}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.touch-green-hover}"
    textColor: "{colors.on-green}"
  text-link:
    textColor: "{colors.ink-2}"
  text-link-hover:
    textColor: "{colors.ink}"
  nav-link:
    textColor: "{colors.ink-2}"
    padding: "6px 0"
  nav-link-active:
    textColor: "{colors.ink}"
  header-compact:
    backgroundColor: "rgba(26, 27, 30, 0.6)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "{spacing.header-compact-height}"
  list-row:
    textColor: "{colors.ink-2}"
    padding: "13px 0"
  post-row:
    textColor: "{colors.ink}"
    padding: "20px 0"
  post-row-hover:
    textColor: "{colors.touch-green}"
  tool-tile:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "22px"
  sidebar-link:
    textColor: "{colors.dim}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  sidebar-link-active:
    backgroundColor: "rgba(95, 212, 160, 0.09)"
    textColor: "{colors.touch-green}"
    rounded: "{rounded.sm}"
  project-shot:
    backgroundColor: "{colors.bg-2}"
    rounded: "{rounded.sm}"
  flashlight-stage:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    height: "100svh"
  code-block:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.lg}"
  search-box:
    backgroundColor: "#141517"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    width: "min(620px, 92vw)"
---

# Design System: Gyanano · 竹言

## Overview

**Creative North Star: "暗室与一束手电"**

整站是一间近黑的暗室。访客移动指针，就是在移动手电。光落到的地方，物质才显形。字标由粒子组成，粒子被照亮后投下影子，被指针推开时变成绿色。

展示页可以激进，文章页保持安静。两类页面共用同一间暗室、同一组令牌和同一个绿色。区别是：展示页有光锥，文档式页面没有光锥，只用实底顶栏和发丝线。

内容不做浮动入场。元素像被开灯一样从暗处亮起，一次闪烁后稳定。这条动效语法和光源是同一个想法。

**Key Characteristics:**
- 近黑底，暖白光，一个绿色。
- 光只有一个来源，位于视口左上方。
- 用发丝线和分栏组织内容，首页不用内容卡片。
- 中等字重，大字号靠负字距收紧。
- 元素从暗处闪亮，不做位移入场。

## Colors

调色板是暗室中的三种东西：墙（近黑）、光（暖白）、手的痕迹（绿色）。

### Primary
- **Touch Green** (#5fd4a0)：绿色只标记用户碰到的东西和用户所在的位置。用于主按钮、焦点环、输入光标、文字选区、正文链接、悬停状态、当前导航点、目录当前项、阅读进度条，以及被指针推开的粒子。CSS 变量名是 `--cin`。
- **Touch Green Hover** (#79e0b3)：只用于主按钮悬停。
- **On Green** (#06140e)：绿色实底上的文字，用于主按钮和选区。

### Secondary
- **Warm Light** (#fff1dc)：光本身，用于光锥和尘埃。光不用作文字色或控件色。CSS 变量 `--light` 以 RGB 三元组存放，便于组合透明度。粒子亮度分 8 档，从余光走到被照亮的暖白。

### Neutral
- **Dark Room** (#060708)：页面底色，也是加载层底色。
- **Lifted Dark** (#101113)：抬高一层的面，用于工具方块、代码块、项目图的占位底。
- **Hairline** (#222327)：分隔线，用于列表行、栏目边界、页脚和页头。对比度只有 1.27:1，只作分隔，不承载信息。
- **Glass Line** (rgba(255, 255, 255, 0.1))：浮层和面板的描边，用于胶囊顶栏、搜索框、弹层和图片框。
- **Ink** (#eeece6)：标题和主文字。
- **Ink Soft** (#b9b6ae)：正文、项目说明、导航默认态。
- **Dim** (#85837d)：日期、分组名、次要说明。它在页面底色上的对比度是 5.26:1，在抬高的面上不低于 4.82:1。不得用比它更暗的颜色写文字。

### Named Rules
**The Touch Green Rule.** 绿色只用于交互、动作和当前状态。一块元素如果不能被碰到，也不表示当前位置，就不得使用绿色。

**The One Light Rule.** 一页只有一个光源，位置固定在左上方。首页用手电舞台，作品页的光束随滚动移动，其他展示型内页用页顶静态光锥。文档式页面和工具工作台没有光。

## Typography

**Display Font:** Anybody（回退 Hanken Grotesk），宽度轴 128%
**Body Font:** Hanken Grotesk（中文回退 PingFang SC、Hiragino Sans GB、Microsoft YaHei、Noto Sans SC）
**Label/Mono Font:** JetBrains Mono（回退 ui-monospace、SF Mono）

**Character:** Hanken Grotesk 在中等字重下冷静耐读。Anybody 加宽后像一块铭牌，只在站名这一层出现。三种拉丁字体都本地托管，`font-display` 为 `swap`。

中文走系统字体，是为了让正文不等待网络。这条取舍只针对正文。大号中文标题目前也回退到系统字体，这是现状，不是设计决定。新页面不得扩大这种用法。

### Hierarchy
- **Display**（800，clamp(56px, 8vw, 110px)，行高 1）：粒子字标、无脚本回退字标、加载百分比。粒子字标由遮罩图 `public/hero-mask.png` 采样生成，不是文字。
- **Logo**（800，15px，行高 1，字距 -0.02em）：顶栏站名。
- **Headline**（500，clamp(44px, 6vw, 92px)，行高 1.05，字距 -0.03em）：内页页头。文章标题和系列标题用 500 字重和 clamp(30px, 3.4vw, 44px)。
- **Title**（500，clamp(22px, 2vw, 28px)，行高 1.2，字距 -0.015em）：首页分节标题。项目名用 clamp(22px, 2.1vw, 30px)。
- **Body**（400，16px，行高 1.75）：默认文字。说明段限宽 56ch 到 60ch。
- **Prose**（400，17px，行高 1.9）：文章正文，放在 720px 的栏内。
- **Label**（450，14px，行高 1.3）：分组名、次要链接、面包屑。列表项用 15px。
- **Mono**（400，13px，等宽数字）：日期、计数、快捷键、代码。

### Named Rules
**The Expanded Nameplate Rule.** Anybody 只用于站名和加载数字。标题、正文和控件都不得使用 Anybody。

**The Medium Weight Rule.** 标题默认 500。层级靠字号和负字距建立，字重不超过 600。Anybody 的 800 不受此条限制。

**The Mono Is Data Rule.** JetBrains Mono 只用于机器性数据：日期、计数、快捷键、代码。

## Layout

全站有两种骨架。

展示页用页面外边距 `page-gutter`。首页分节是 2:7 的两栏：左栏放标题并粘附在距顶 92px 处，右栏放内容。栏目之间的上间距是 `section-top`。关于页沿用同一比例。

文档式页面是三栏：左侧栏 `sidebar-width`，中间正文，右侧目录 `toc-width`。侧栏和目录都粘附滚动，正文宽度上限是 720px。外边距和其他内页一样用 `page-gutter`，所以 Logo、导航和页脚在所有内页都在同一位置。索引页和文章页的正文左缘也相同，点进文章时内容不横移。

文章索引页、标签页和系列页没有右侧目录，只有两栏。索引页的列表在正文，侧栏改列标签，同一批文章不出现两次。标签由博主在 `src/data/blog.json` 指定，顺序照写，没有公开文章的标签不显示，当前所在的标签例外。公开文章的侧栏和索引页完全相同，系列文章的侧栏列本系列章节。侧栏的吸顶位置等于自然位置，滚动和换页时都不移动。

每个栏目用自己的版式：技术栈是四列发丝线列表，作品页是暗墙上左右交错的陈列，GitHub 项目是带小图的整行索引，文章是整行索引，工具是自动填充的方块网格。

响应式断点：

- 1360px 以下，文档页去掉右侧目录，改为正文上方可折叠的目录。
- 1100px 以下，文档侧栏隐藏，索引页顶部显示搜索框，标签变成横向滚动条。
- 960px 以下，两栏分节合成一栏，标题取消粘附，「全部」链接移到标题右侧。
- 860px 以下，四列列表变两列。主导航在任何宽度都可见。
- 640px 以下，顶栏收紧到 20px 内边距，导航字号降到 14px。
- 竖屏（宽高比不超过 1:1）时，首屏换竖版遮罩，字标折成两行，文字带改成上下排列。

## Elevation & Depth

深度来自光，不来自堆叠的卡片。系统是混合式：大多数面贴在墙上，用内描边勾出轮廓；只有图片和真正浮起的层才有柔和的投影。投影向下扩散，颜色为黑色，半径为负值，只在暗底上留下很轻的落差。

全局有一层 5% 不透明度的静态颗粒，用来抖掉暗部渐变的色带。

### Shadow Vocabulary
- **Panel Line** (`box-shadow: inset 0 0 0 1px var(--line-2)`)：工具方块、上下篇面板、代码块的轮廓。悬停时换成绿色或半透明绿色。
- **Shot Fall** (`box-shadow: inset 0 0 0 1px var(--line-2), 0 40px 80px -48px #000`)：项目大图。
- **Dialog Fall** (`box-shadow: inset 0 0 0 1px var(--line-2), 0 40px 90px -30px #000`)：搜索弹层。
- **Pill Float** (`box-shadow: 0 12px 40px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.06)`)：滚动后的胶囊顶栏，配合 `saturate(180%) blur(20px)` 背景模糊。

### Named Rules
**The Hairline Panel Rule.** 内容面板的轮廓用内描边，包括工具方块、上下篇面板、代码块、项目图和搜索框。悬停只改描边颜色，面不上浮。悬浮控件和胶囊顶栏用 1px `line-2` 实线边框，不受此条限制。

**The Frost Is Earned Rule.** 背景模糊只用于内容从下方滚过的层：顶栏和搜索遮罩。静止的面不得使用背景模糊。

**The Switch-On Rule.** 元素进入视口时只亮起一次，从 6% 不透明度经过 0.85 秒的闪烁到全亮。入场不做位移。减少动效时，元素直接全亮。

## Shapes

形状语言是圆角矩形加胶囊，没有切角和异形。圆角随层级增大：行内代码最小，图片框次之，面板再大，弹层最大。可点击的独立控件都是胶囊：主按钮、搜索按钮、菜单按钮、灯箱按钮。圆形只用于返回顶部按钮、当前导航点和粒子。

粒子和网点是系统的第二种形状：圆点。字标、转场和当前导航标记都由圆点构成。

## Components

### Buttons
控件的性格是安静、明确，靠颜色而不是体积说话。

- **Shape:** 全胶囊（`rounded.pill`），高 44px。
- **Primary:** 绿底深字，600 字重，15px。一屏最多一个。
- **Hover / Focus:** 悬停变亮并上移 2px，上移用 `--ease` 走 0.5 秒。焦点是 2px 绿色外轮廓，偏移 3px。
- **Secondary:** 透明底，1px `line-2` 描边，高 34px，用于搜索和菜单。悬停时描边提亮。
- **Text Link:** 无底无框，15px，配一条线性箭头。悬停时文字变亮，箭头右移 3px。

### Cards / Containers
- **Work Cover:** 作品页的 4:3 封面，圆角 `rounded.lg`，1px 暖白内描边。比例与首页牌堆相同，同一张图可以两处共用。亮度只由光束决定，悬停时图片放大到 1.025 倍。
- **Project Row:** GitHub 项目的整行索引：名称、说明和技术、4:3 小图。小图默认压到 72% 亮度，悬停时恢复全亮，这是开灯语法在图片上的形式。
- **Tool Tile:** 只用于内页。底色 `bg-2`，圆角 `rounded.lg`，内边距 22px，用 Panel Line，悬停时描边变绿。
- **Prev/Next:** 只用于文章页。两列，顶部一条发丝线，不用面板。悬停时标题变绿。

### Inputs / Fields
- **Style:** 搜索框没有独立边框，只有一条底部 `line` 分隔线。透明底，17px，占位文字用 `dim`。
- **Focus:** 输入光标是绿色。
- **Results:** 结果项圆角 `rounded.md`，选中或悬停时铺 10% 绿色。

### Navigation
- **Top Bar:** 顶部时透明，高 64px。首页顶栏内边距与字标同边。滚动超过 40px 后，顶栏在 0.6 秒内缩成悬浮胶囊，宽度不超过 720px，高 50px。
- **Links:** 15px，450 字重，默认 `ink-2`，悬停和当前页为 `ink`。当前页下方有一个 4px 绿色圆点。
- **One Header:** 所有页面共用一个顶栏，跨页保留不重绘，内容和几何完全相同。搜索不进顶栏，入口在文档侧栏最上方。
- **Docs Sidebar:** 14px，`dim` 色，悬停铺 4% 白色，当前项变绿并铺 9% 绿色。文章页列文章，分组用可折叠标题，带等宽计数。索引页列标签，带等宽计数。
- **Table of Contents:** 13px，左侧一条发丝线，当前项的文字和线段变绿。

### Index Rows
文字列表都用整行发丝线，不用项目符号和卡片。

- **List Row:** 用于技术栈，单色图标 19px，默认 72% 不透明度。悬停时文字变亮，图标变绿。
- **Post Row:** 用于文章索引。用于首页随笔。悬停时标题变绿。文章索引页的写法见 Post Index。

### Post Index
文章索引按年份分组。年份在左，等宽小字，滚动时粘附。标题 clamp(19px, 1.7vw, 25px)，说明 15px，等宽月日靠右。指针停在一行上时，其他行降到 50% 不透明度，这是手电在文字列表上的形式。系列页把右侧日期换成序号，因为阅读顺序是读者需要的信息。文字列表这里不再有标题和简介：导航和侧栏已经说明了位置。

### Code And Prose
- **Links:** 绿色文字，下划线用 40% 绿色，悬停时下划线变实。
- **Code Block:** 14px 等宽，底色 `bg-2`，圆角 `rounded.lg`，用 1px `line` 内描边。右上角显示语言，悬停时换成复制按钮，触屏设备上复制按钮常显。
- **Code Colors:** 由 `global.css` 的 `--astro-code-*` 变量控制。主体用墨色分级，字符串和常量用偏暖的沙色。这是 Warm Light 不作文字色这条规则的唯一例外。代码里不得出现绿色，绿色留给能碰的东西。
- **Inline Code:** 7% 白底，圆角 `rounded.xs`。
- **Image:** 圆角 `rounded.md`，默认压到 90% 亮度以减少白底图的眩光，悬停时恢复全亮，点击进入灯箱。图表要让人读清，不得压到 72%。

### Flashlight Stage

The hero is one large wordmark and nothing else in plain sight: no tagline, no intro, no buttons; the nav carries the entries. The upper wall holds up to 10 keywords (`KEYWORDS`) scattered at random in three sizes and drifting slowly. They are invisible until the beam lands on them and fade with distance like the rest of the light. Do not add a second large name to the wall or devices and circuits as decoration: the owner rejected both, the first because it reads as self-promotion and the second because it pins them to one identity. Anything visitors must read goes in real text, not in the beam. Home sections do not announce themselves: no large section titles, because the owner finds labelling obvious content patronising. The only title is a small 我的随笔 at the head of the right column of the writing, set like the stack column titles; 更多 sits under the list it belongs to. Nothing floats centred over a two-column layout. The first screen hands over to the next section without an edge: the descender of `y` finishes below the fold and the beam fades across the boundary. The works stage below is a sticky section inside the page margins: left, a ruled list of work names with the active one opened in place; right, a small diagonal deck of 4:3 cards with only a corner of each back card showing. On a switch the top card lifts away, the rest move forward and it slides back in behind them. Works never flicker; `switch-on` belongs to section entrances only. Writing shows the latest post large on the left and four short rows on the right. The footer is one quiet ruled bar: name on the left, copyright centred, contact on the right.
系统的标志组件。一块画布和一个 CSS 光锥共用同一个光源与朝向。

- **Light:** 光源在视口左上方之外。光锥是平面锥形渐变，只旋转，运行在合成层。指针离开或静止 2.6 秒后，光锥自己缓慢扫动。
- **Particles:** 字标由泊松圆盘采样的粒子组成，桌面约 9000 个，宽度不足 800px 时约 3200 个。粒子亮度由所受光照决定。被照亮的粒子朝背离光源的方向投影。
- **Touch:** 指针推开粒子。偏离原位的粒子变成 `touch-green`，这是绿色规则在物质上的形式。
- **Dust:** 尘埃只在光锥内可见。
- **Band:** 一条文字带压在字标上方，放角色说明和动作。文字带、顶栏和字标共用同一条边（`--edge`）。修改这些比例时，应当同时修改 `global.css` 的首屏变量和 `HeroStage.astro` 的画布比例。
- **Still State:** 减少动效时，舞台渲染一帧静止画面，粒子在原位，光锥亮起。
- **Fallback:** 遮罩图加载失败时只保留光锥。无脚本时显示 Anybody 文字字标。

### Work Wall
作品页的标志组件。页面没有可见标题，第一屏就是第一幅作品（`<h1>` 只给读屏软件）。作品左右交错，封面占 8 份，文字占 5 份，文字贴封面底边。

- **Light:** 光源在视口左上方之外，比首屏更远，光斑才盖得住整幅封面。朝向是滚动位置的纯函数，再加一次低通，所以快滚和回滚都不跳。光束停在当前封面上，两幅之间的中段才摆过去。指针只把光束带偏 25%，作品不会因为指针移开而变暗。
- **Layers:** `.wg-air` 是空气里的光束，在封面下面。`.wg-dark` 是暗层，在封面上面、文字下面。光到的地方封面全亮，其余地方压暗 86%。文字不受光影响，任何时候都可读。不得给这些层的祖先元素加 `z-index`、`transform` 或 `opacity`，否则层序会失效。
- **Exit:** 走过最后一幅作品后，两层一起淡出，GitHub 项目在普通暗底上。
- **Entrance:** 进入页面时光从左边墙根摆到第一幅作品上。封面不用 `switch-on`，作品不闪烁。
- **Still State:** 减少动效和无脚本时，两层不显示，退回页顶静态光锥，所有封面全亮。

### Preloader
本会话首次进入首页时显示，减少动效时跳过。Display 字号的百分比配一条 1px 进度线，最短 1.1 秒。结束时进度线展开到全宽，然后舞台开灯。

### Page Transition
换页有两种语法。栏目之间（首页、作品、文章、工具、关于）用网点：深绿网点（#0f1f19）从点击处扩散，500ms 盖满屏幕，同时开始加载，盖满且加载完成后换页，再用 620ms 收起，总时长约 1.15 秒。同一栏目内用淡入：内容淡出 200ms，同时开始加载，新内容在 500ms 内淡入，顶栏不动。前进和后退只淡入。链接在指针停留时预取。文章区内部换页时只替换正文和目录，顶栏、侧栏和页脚的节点不动，只更新当前项，不做任何动画。从文章索引点进文章时，点击的标题飞到文章标题的位置，这是全站唯一的共享元素。减少动效时直接换页。

### Series Page
系列是一本按顺序读的书。系列页有标题、简介、「从第一篇开始」和篇数，下面是带序号的章节列表。系列文章的元信息显示「第 N 篇，共 M 篇」，侧栏展开章节，上一篇和下一篇按阅读顺序走。系列简介存放在 `src/data/blog.json`。公开系列会出现在索引页侧栏的「系列」分组。未列出的系列只对已经进入的读者显示，它的页面不放公开标签。

### About Letter
关于页是一段写给读者的话，没有标题和模块。大字段落左右交错，每个词随滚动从 16% 亮到全亮，回滚时重新变暗。这页不用首页组件，也不重复技术栈。文案只写来源可查的事实。

### Tool Workbench
工具索引是整行大字列表，同标签页打开工具。工具页顶栏和全站一致，返回条以下归工具自己，样式放在 `src/tools/<id>/`，没有页脚。站外工具在 `meta.ts` 填 `external`，索引页才用新标签页打开。

### Nine Gate
`/blog` 列表末尾有一个线色九点按钮，几乎看不见，指针碰到才变亮。点开后按后天九宫数序（坎坤震巽中乾兑艮离）点击洛书方位的九宫格，点对的格子被光照亮。全部点对后进入未列出的系列。点错时弹窗爆红并抖动，然后重置。红色 #e5484d 是博主指定的警告色，只用于这里和表单校验。这是彩蛋，不是访问控制。

## Do's and Don'ts

### Do:
- **Do** 把新页面放进两种骨架之一：展示页或文档式页面。
- **Do** 给每个栏目设计自己的版式，用发丝线、分栏和整行列表组织内容。
- **Do** 用 `switch-on` 让内容进入视口时亮起一次，播放后不再重复。
- **Do** 让图片默认压暗，悬停时恢复全亮。
- **Do** 为每个动效提供减少动效下的静止状态。
- **Do** 把文字色限定在 `ink`、`ink-2`、`dim` 三档。

### Don't:
- **Don't** 在控件上使用渐变。光锥是世界本身的材料，不受此条限制。
- **Don't** 使用硬边偏移阴影。柔和投影和粒子影子不受此条限制。
- **Don't** 在首页使用内容卡片。工具方块和上下篇面板是内页形式，不受此条限制。
- **Don't** 使用衬线字体。
- **Don't** 在文档式页面加光锥或粒子。
- **Don't** 大面积铺绿色。主按钮是绿色实底的上限，转场网点用深绿。
- **Don't** 增加第二个强调色或第二个光源。九宫入口的红色警告是博主指定的例外。
- **Don't** 让页面内容以滑入方式入场。侧栏抽屉和返回顶部按钮的位移不受此条限制。
