export const SITE = {
  title: "Gyanano · 竹言",
  author: "Gyanano",
  description: "Gyanano 的作品和开发笔记，方向是嵌入式与全栈开发。",
  email: "1624055384@qq.com",
  github: "https://github.com/gyanano",
};

export const NAV = [
  { href: "/work", label: "作品" },
  { href: "/blog", label: "文章" },
  { href: "/tools", label: "工具" },
  { href: "/about", label: "关于" },
];

// 首屏墙上的水印：只有被光照到才显现。前 3 个字最大，顺序决定字号
export const KEYWORDS = ["嵌入式", "全栈", "INTP", "MCU", "RTOS", "极简", "类型安全", "深入底层", "清晰的抽象", "内存管理"];

export const SKILLS = [
  { no: "01", group: "前端", items: ["React", "TypeScript", "Tailwind", "Framer Motion", "Next.js"] },
  { no: "02", group: "后端", items: ["Node.js", "Python", "Go", "PostgreSQL", "Docker"] },
  { no: "03", group: "嵌入式", items: ["C/C++", "RTOS", "STM32", "ESP32", "PCB Design"] },
  { no: "04", group: "工具", items: ["Git", "Linux", "VS Code", "PlatformIO", "Oscilloscopes"] },
];
