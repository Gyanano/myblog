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
}

export const PROJECTS: Project[] = [];
