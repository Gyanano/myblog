import { defineAnimation } from '../types';
import { ScalePop } from './ScalePop';

export const meta = defineAnimation({
  id: 'scale-pop',
  title: '缩放弹出',
  category: '强调',
  description: '元素用 spring 从 0 弹出并轻微过冲的强调效果',
  prompt: `做一个「缩放弹出」强调动画（Remotion 组件）：
效果：元素（默认一行文字）从 scale 0 弹出到 1，因为用了低阻尼 spring，会有轻微过冲再回落，像盖章/弹窗的强调感。
时间轴（默认 30fps）：
- 从第 0 帧起用 spring(damping≈9, stiffness≈120, mass≈0.7) 驱动 scale，约 0.6–0.8 秒内完成弹出与回稳。
可调参数：
- text：要显示的内容（默认「术」）
- color：颜色（默认 #BE3A3A 朱砂红）
说明：弹性手感由 spring 的 damping/stiffness/mass 控制，调小 damping 过冲更明显。`,
  params: [
    { name: 'text', desc: '显示内容', default: '术' },
    { name: 'color', desc: '颜色', default: '#BE3A3A' },
  ],
  component: ScalePop,
  defaultProps: { text: '术', color: '#BE3A3A' },
  fps: 30,
  durationInFrames: 40,
  width: 1920,
  height: 1080,
});
