export const SITE = {
  title: "Gyanano · 竹言",
  author: "Gyanano",
  description: "嵌入式与全栈工程师 — 在硬件与软件之间架桥。",
  email: "1624055384@qq.com",
  github: "https://github.com/gyanano",
};

export const NAV = [
  { href: "/about", label: "道", en: "About" },
  { href: "/work", label: "术", en: "Work" },
  { href: "/lab", label: "演", en: "Lab" },
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

export interface Project {
  no: string;
  tag: string;
  title: string;
  boot: string;
  desc: string;
  stack: string[];
  code: string;
  image?: string; // 预览图/截图/Logo（public/ 下的绝对路径）
}

export const PROJECTS: Project[] = [
  {
    no: "01",
    tag: "AI · 设计工具",
    title: "Bower",
    boot: "init bower --local-first",
    desc: "本地优先的设计资料归档与策展工具——像园丁鸟收集藏品一样收集灵感、整理看板，并借助 AI 从参考图中提取视觉线索（style DNA）以便复用。含 Next.js Web 应用、FastAPI 后端、SQLite 本地存储，以及一个把网页图片直接送入工作流的浏览器扩展。",
    stack: ["Next.js 15", "FastAPI", "SQLite", "LLM", "浏览器扩展"],
    code: "https://github.com/Gyanano/Bower",
    image: "/projects/bower.png",
  },
  {
    no: "02",
    tag: "嵌入式 · 桌面工具",
    title: "RSerialDebugAssistant",
    boot: "connect /dev/serial --tauri",
    desc: "面向嵌入式开发者的现代串口调试助手：基于 Tauri + React + Rust 构建的跨平台桌面应用，把日常的串口收发与调试做得更顺手、更现代。",
    stack: ["Tauri", "Rust", "React", "TypeScript"],
    code: "https://github.com/Gyanano/RSerialDebugAssistant",
    image: "/projects/rserial.png",
  },
  {
    no: "03",
    tag: "数据爬虫 · LLM",
    title: "Feedback Spider",
    boot: "crawl --source all | llm-filter",
    desc: "实时抓取 Steam / TapTap / Bilibili / 贴吧 上关于「AI 生成 Galgame / 可交互游戏」的中文用户反馈，用 LLM 过滤闲聊、归类需求与痛点，自动生成静态看板（高赞评论榜 + 需求/痛点词云 + 统计），由 GitHub Actions 每日定时驱动。",
    stack: ["Python", "LLM", "爬虫", "GitHub Actions", "词云可视化"],
    code: "https://github.com/Gyanano/feedback_spider",
    image: "/projects/feedback.png",
  },
];
