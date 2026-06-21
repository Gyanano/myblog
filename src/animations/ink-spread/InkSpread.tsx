import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export type InkSpreadProps = {
  color: string;
  speed: number;
};

export const InkSpread = ({ color, speed }: InkSpreadProps) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const progress = spring({ frame, fps, durationInFrames: speed, config: { damping: 200 } });
  const maxR = Math.hypot(width, height);
  const r = interpolate(progress, [0, 1], [0, maxR]);
  const opacity = interpolate(frame, [0, speed * 0.5, speed], [0, 1, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#F2EFE8', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          backgroundColor: color,
          opacity,
          filter: 'blur(8px)',
        }}
      />
    </AbsoluteFill>
  );
};
