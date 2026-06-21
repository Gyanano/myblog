import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Player } from '@remotion/player';
import { animations } from '../animations/registry';

// 以文件夹名(=id)为键，读取每个动画组件的源码字符串（Vite 专属，仅画廊侧使用）
const codeModules = import.meta.glob('../animations/*/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const codeById: Record<string, string> = {};
for (const [path, src] of Object.entries(codeModules)) {
  const folder = path.split('/').slice(-2)[0];
  codeById[folder] = src;
}

if (import.meta.env.DEV) {
  for (const a of animations) {
    if (!codeById[a.id]) {
      console.warn(
        `[AnimationGallery] 找不到动画 "${a.id}" 的源码——请确认 meta.id 与其文件夹名一致。`
      );
    }
  }
}

const btnStyle: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.85rem',
  padding: '0.4rem 0.9rem',
  border: '1px solid var(--ink-light, #8A857D)',
  background: 'transparent',
  color: 'var(--ink-dark, #2A2825)',
  cursor: 'pointer',
  borderRadius: 2,
};

const tagStyle: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.7rem',
  color: 'var(--cinnabar, #BE3A3A)',
  border: '1px solid var(--cinnabar, #BE3A3A)',
  padding: '0.1rem 0.5rem',
  borderRadius: 2,
};

type CopyKind = 'code' | 'prompt';

function CopyButtons({ code, prompt }: { code: string; prompt: string }) {
  const [copied, setCopied] = useState<CopyKind | null>(null);
  const copy = async (kind: CopyKind, text: string) => {
    try {
      if (!navigator.clipboard) throw new Error('clipboard API unavailable (需 HTTPS 或 localhost)');
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error('[AnimationGallery] 复制失败：', err);
    }
  };
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
      <button style={btnStyle} onClick={() => copy('code', code)}>
        {copied === 'code' ? '已复制 ✓' : '复制代码'}
      </button>
      <button style={btnStyle} onClick={() => copy('prompt', prompt)}>
        {copied === 'prompt' ? '已复制 ✓' : '复制 Prompt'}
      </button>
    </div>
  );
}

export default function AnimationGallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
      {animations.map((a) => (
        <article key={a.id} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', border: '1px solid var(--ink-wash, rgba(42,40,37,0.1))' }}>
            <Player
              component={a.component}
              durationInFrames={a.durationInFrames}
              fps={a.fps}
              compositionWidth={a.width}
              compositionHeight={a.height}
              inputProps={a.defaultProps}
              style={{ width: '100%' }}
              controls
              loop
              autoPlay
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <span style={tagStyle}>{a.category}</span>
            <h3 style={{ margin: '0.4rem 0 0.2rem', fontFamily: 'var(--font-serif, serif)', color: 'var(--ink-dark)' }}>
              {a.title}
            </h3>
            <p style={{ margin: 0, color: 'var(--ink-light)', fontSize: '0.9rem' }}>{a.description}</p>
          </div>
          <CopyButtons code={codeById[a.id] ?? ''} prompt={a.prompt} />
        </article>
      ))}
    </div>
  );
}
