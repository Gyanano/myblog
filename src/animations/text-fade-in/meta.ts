import { defineAnimation } from '../types';
import { TextFadeIn } from './TextFadeIn';

export const meta = defineAnimation({
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
});
