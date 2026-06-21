import { defineAnimation } from '../types';
import { FadeUp } from './FadeUp';

export const meta = defineAnimation({
  id: 'fade-up',
  title: '淡入上移',
  category: '入场',
  description: '元素一边淡入一边从下方上移就位的入场效果',
  prompt: `做一个「淡入上移」入场动画（Remotion 组件）：
效果：一个元素（默认一行文字）从下方略微上移到最终位置，同时不透明度从 0 渐显到 1。最常用的入场原语。
时间轴（默认 30fps）：
- 0–20 帧：不透明度 0 → 1；纵向位移 distance(px) → 0，用 clamp 让 20 帧后保持稳定。
可调参数：
- text：要显示的内容（默认「水墨」）
- color：颜色（默认 #1a1a1a）
- distance：起始下移距离 px，越大入场幅度越明显（默认 40）`,
  params: [
    { name: 'text', desc: '显示内容', default: '水墨' },
    { name: 'color', desc: '颜色', default: '#1a1a1a' },
    { name: 'distance', desc: '起始下移距离(px)', default: 40 },
  ],
  component: FadeUp,
  defaultProps: { text: '水墨', color: '#1a1a1a', distance: 40 },
  fps: 30,
  durationInFrames: 45,
  width: 1920,
  height: 1080,
});
