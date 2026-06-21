import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export type ScalePopProps = {
  text: string;
  color: string;
};

export const ScalePop = ({ text, color }: ScalePopProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 低 damping 的 spring 会有轻微过冲，形成「弹一下」的强调感
  const scale = spring({ frame, fps, config: { damping: 9, stiffness: 120, mass: 0.7 } });

  return (
    // #F2EFE8 = --paper-bg；此处写字面值，因为 Remotion 渲染无法访问站点 CSS 变量
    <AbsoluteFill style={{ backgroundColor: '#F2EFE8', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize: 120,
          fontWeight: 700,
          color,
          fontFamily: '"Noto Serif SC", serif',
          transform: `scale(${scale})`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
