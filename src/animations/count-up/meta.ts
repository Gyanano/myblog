import { defineAnimation } from '../types';
import { CountUp } from './CountUp';

export const meta = defineAnimation({
  id: 'count-up',
  title: '数字滚动',
  category: '强调',
  description: '数字从 0 递增滚动到目标值的数据强调效果',
  prompt: `做一个「数字滚动」强调动画（Remotion 组件，数据类视频常用）：
效果：一个大数字从 0 平滑递增到目标值 to，用等宽数字避免宽度抖动，可加前后缀（如 ￥、%、+）。
时间轴（默认 30fps）：
- 0–durationFrames 帧：数值从 0 线性插值到 to，每帧四舍五入显示。
可调参数：
- to：目标数值（默认 2024）
- durationFrames：递增持续帧数，越大越慢（默认 50）
- color：颜色（默认 #1a1a1a）
- prefix：前缀（默认空，如 ￥ / $）
- suffix：后缀（默认空，如 % / +）`,
  params: [
    { name: 'to', desc: '目标数值', default: 2024 },
    { name: 'durationFrames', desc: '递增持续帧数', default: 50 },
    { name: 'color', desc: '颜色', default: '#1a1a1a' },
    { name: 'prefix', desc: '前缀', default: '' },
    { name: 'suffix', desc: '后缀', default: '+' },
  ],
  component: CountUp,
  defaultProps: { to: 2024, durationFrames: 50, color: '#1a1a1a', prefix: '', suffix: '+' },
  fps: 30,
  durationInFrames: 60,
  width: 1920,
  height: 1080,
});
