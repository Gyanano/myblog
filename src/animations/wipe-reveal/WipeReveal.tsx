import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type WipeRevealProps = {
  text: string;
  color: string;
  bg: string;
};

export const WipeReveal = ({ text, color, bg }: WipeRevealProps) => {
  const frame = useCurrentFrame();
  // 从右侧 inset 100% 收到 0%，形成由左向右的擦除显现
  const inset = interpolate(frame, [0, 30], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize: 120,
          fontWeight: 700,
          color,
          fontFamily: '"Noto Serif SC", serif',
          clipPath: `inset(0 ${inset}% 0 0)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
