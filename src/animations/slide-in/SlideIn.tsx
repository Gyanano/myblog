import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export type SlideInProps = {
  text: string;
  color: string;
  /** 从哪个方向滑入 */
  from: 'left' | 'right' | 'top' | 'bottom';
};

export const SlideIn = ({ text, color, from }: SlideInProps) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const progress = spring({ frame, fps, durationInFrames: 25, config: { damping: 200 } });

  const horizontal = from === 'left' || from === 'right';
  const dist = horizontal ? width : height;
  const sign = from === 'left' || from === 'top' ? -1 : 1;
  const offset = interpolate(progress, [0, 1], [sign * dist, 0]);

  return (
    // #F2EFE8 = --paper-bg；此处写字面值，因为 Remotion 渲染无法访问站点 CSS 变量
    <AbsoluteFill style={{ backgroundColor: '#F2EFE8', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize: 120,
          fontWeight: 700,
          color,
          fontFamily: '"Noto Serif SC", serif',
          transform: horizontal ? `translateX(${offset}px)` : `translateY(${offset}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
