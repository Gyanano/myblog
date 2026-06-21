import { defineAnimation } from '../types';
import { WipeReveal } from './WipeReveal';

export const meta = defineAnimation({
  id: 'wipe-reveal',
  title: '擦除显现',
  category: '转场',
  description: '内容由左向右被擦除遮罩逐渐显现的转场效果',
  prompt: `做一个「擦除显现」转场动画（Remotion 组件）：
效果：内容（默认一行文字）被一个矩形遮罩从左向右擦开逐渐显现，像刷子刷过或卷轴展开。
实现：用 CSS clip-path: inset(0 R% 0 0)，让右侧裁切比例 R 从 100% 收到 0%。
时间轴（默认 30fps）：
- 0–30 帧：inset 右侧 100% → 0%，匀速擦除显现。
可调参数：
- text：要显示的内容（默认「墨痕」）
- color：文字颜色（默认 #1a1a1a）
- bg：背景色（默认 #F2EFE8 宣纸色）
变体：把 inset 改成左侧/上侧/下侧可改变擦除方向。`,
  params: [
    { name: 'text', desc: '显示内容', default: '墨痕' },
    { name: 'color', desc: '文字颜色', default: '#1a1a1a' },
    { name: 'bg', desc: '背景色', default: '#F2EFE8' },
  ],
  component: WipeReveal,
  defaultProps: { text: '墨痕', color: '#1a1a1a', bg: '#F2EFE8' },
  fps: 30,
  durationInFrames: 45,
  width: 1920,
  height: 1080,
});
