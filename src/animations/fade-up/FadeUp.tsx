import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type FadeUpProps = {
  text: string;
  color: string;
  /** 入场时从下方上移的距离（px） */
  distance: number;
};

export const FadeUp = ({ text, color, distance }: FadeUpProps) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [0, 20], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    // #F2EFE8 = --paper-bg；此处写字面值，因为 Remotion 渲染无法访问站点 CSS 变量
    <AbsoluteFill style={{ backgroundColor: '#F2EFE8', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize: 120,
          fontWeight: 700,
          color,
          fontFamily: '"Noto Serif SC", serif',
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
