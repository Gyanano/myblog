import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type CountUpProps = {
  to: number;
  durationFrames: number;
  color: string;
  prefix: string;
  suffix: string;
};

export const CountUp = ({ to, durationFrames, color, prefix, suffix }: CountUpProps) => {
  const frame = useCurrentFrame();
  const value = Math.round(
    interpolate(frame, [0, durationFrames], [0, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    // #F2EFE8 = --paper-bg；此处写字面值，因为 Remotion 渲染无法访问站点 CSS 变量
    <AbsoluteFill style={{ backgroundColor: '#F2EFE8', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize: 180,
          fontWeight: 700,
          color,
          fontFamily: '"Noto Serif SC", serif',
          // 等宽数字，避免计数跳动时整体宽度抖动
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {prefix}
        {value.toLocaleString('en-US')}
        {suffix}
      </div>
    </AbsoluteFill>
  );
};
