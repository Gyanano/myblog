import type { AnimationMeta } from '../types';
import { InkSpread } from './InkSpread';

export const meta: AnimationMeta = {
  id: 'ink-spread',
  title: '墨点扩散',
  category: '入场',
  description: '一滴墨从中心晕开扩散到全屏的入场效果',
  prompt: `做一个「墨点扩散」入场动画（Remotion 组件）：
效果：画面中心出现一个墨点，快速向外晕染扩散直到覆盖全屏，像水墨在宣纸上渗开。
时间轴（默认 30fps，约 60 帧）：
- 0–30 帧：墨点用 spring 缓动从 0 放大到覆盖全屏对角线半径，呈「先快后慢」的渗透感，边缘用 blur 制造水墨毛刺。
- 0–15 帧：不透明度 0 → 1；30–60 帧：稳定在约 0.85。
可调参数：
- color：墨色（默认 #1a1a1a）
- speed：扩散持续帧数，越小越快（默认 30）`,
  params: [
    { name: 'color', desc: '墨色', default: '#1a1a1a' },
    { name: 'speed', desc: '扩散持续帧数(越小越快)', default: 30 },
  ],
  component: InkSpread,
  defaultProps: { color: '#1a1a1a', speed: 30 },
  fps: 30,
  durationInFrames: 60,
  width: 1920,
  height: 1080,
};
