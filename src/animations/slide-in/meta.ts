import { defineAnimation } from '../types';
import { SlideIn } from './SlideIn';

export const meta = defineAnimation({
  id: 'slide-in',
  title: '滑入',
  category: '入场',
  description: '元素从指定方向用 spring 缓动滑入就位',
  prompt: `做一个「滑入」入场动画（Remotion 组件）：
效果：元素（默认一行文字）从画面某一侧（左/右/上/下）滑动到中心就位，用 spring 缓动让停止时自然减速。
时间轴（默认 30fps）：
- 0–25 帧：位移从「整屏宽/高 × 方向符号」spring 收敛到 0。
可调参数：
- text：要显示的内容（默认「序」）
- color：颜色（默认 #1a1a1a）
- from：滑入方向，'left' | 'right' | 'top' | 'bottom'（默认 'left'）`,
  params: [
    { name: 'text', desc: '显示内容', default: '序' },
    { name: 'color', desc: '颜色', default: '#1a1a1a' },
    { name: 'from', desc: "滑入方向 left/right/top/bottom", default: 'left' },
  ],
  component: SlideIn,
  defaultProps: { text: '序', color: '#1a1a1a', from: 'left' },
  fps: 30,
  durationInFrames: 45,
  width: 1920,
  height: 1080,
});
