import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type TextFadeInProps = {
  text: string;
  color: string;
  staggerFrames: number;
};

export const TextFadeIn = ({ text, color, staggerFrames }: TextFadeInProps) => {
  const frame = useCurrentFrame();
  const chars = [...text];

  return (
    <AbsoluteFill style={{ backgroundColor: '#F2EFE8', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', fontSize: 120, fontWeight: 700, color, fontFamily: 'serif' }}>
        {chars.map((ch, i) => {
          const start = i * staggerFrames;
          const opacity = interpolate(frame, [start, start + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [start, start + 12], [24, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span key={i} style={{ opacity, transform: `translateY(${y}px)`, whiteSpace: 'pre' }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
