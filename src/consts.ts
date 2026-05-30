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

export interface Project {
  no: string;
  tag: string;
  title: string;
  boot: string;
  desc: string;
  stack: string[];
  code: string;
}

export const PROJECTS: Project[] = [
  {
    no: "01",
    tag: "嵌入式",
    title: "STM32 RTOS 无人机飞控",
    boot: "initializing stm32_rtos_drone_controller...",
    desc: "用 C++ 与 FreeRTOS 编写的自定义飞控固件。包含 PID 稳定、传感器融合（IMU）与自定义无线协议。",
    stack: ["C++", "STM32", "FreeRTOS", "I2C/SPI"],
    code: "https://github.com/gyanano",
  },
  {
    no: "02",
    tag: "全栈 & IoT",
    title: "IoT 智能温室",
    boot: "initializing iot_smart_greenhouse...",
    desc: "自动化气候控制系统。ESP32 节点经 MQTT 推送数据到 Node.js 后端，React 仪表盘通过 WebSocket 实时可视化。",
    stack: ["React", "Node.js", "MQTT", "ESP32", "InfluxDB"],
    code: "https://github.com/gyanano",
  },
  {
    no: "03",
    tag: "Web",
    title: "极简作品集 V1",
    boot: "initializing minimalist_portfolio_v1...",
    desc: "个人站的上一代。聚焦排版与粗野主义美学，纯 CSS 与原生 JS 实现。",
    stack: ["HTML", "SCSS", "JavaScript"],
    code: "https://github.com/gyanano",
  },
];
