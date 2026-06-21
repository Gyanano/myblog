import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { animations } from '../animations/registry';
import type { AnimationMeta } from '../animations/types';

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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 卸载时清掉计时器：站点用 <ClientRouter />，导航会卸载该 island
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const copy = async (kind: CopyKind, text: string) => {
    try {
      if (!navigator.clipboard) throw new Error('clipboard API unavailable (需 HTTPS 或 localhost)');
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 1500);
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

/**
 * 悬浮即播放：鼠标移入从头播放（悬浮期间手动循环）；移出后让当前这一遍自然放完，
 * 再停在「结束定格帧」。不用 Player 自带的 controls / loop，避免播放器外壳与无谓的持续算力。
 */
function AnimationPreview({ a }: { a: AnimationMeta }) {
  const ref = useRef<PlayerRef>(null);
  const hovering = useRef(false);
  const lastFrame = a.durationInFrames - 1;

  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    const onEnded = () => {
      if (hovering.current) {
        // 仍在悬浮：回到开头继续播，形成「悬浮即循环」
        player.seekTo(0);
        player.play();
      } else {
        // 已移开：停在结束定格帧（文字/数字已显现，作为静态海报）
        player.pause();
        player.seekTo(lastFrame);
      }
    };
    player.addEventListener('ended', onEnded);
    return () => player.removeEventListener('ended', onEnded);
  }, [lastFrame]);

  const onEnter = () => {
    hovering.current = true;
    const player = ref.current;
    if (!player) return;
    player.seekTo(0);
    player.play();
  };
  // 移出只置标志：当前这一遍会自然放完，再由 'ended' 收尾停住（至少完整播完一次）
  const onLeave = () => {
    hovering.current = false;
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid var(--ink-wash, rgba(42,40,37,0.1))',
        cursor: 'pointer',
      }}
    >
      <Player
        ref={ref}
        component={a.component}
        durationInFrames={a.durationInFrames}
        fps={a.fps}
        compositionWidth={a.width}
        compositionHeight={a.height}
        inputProps={a.defaultProps}
        initialFrame={lastFrame}
        clickToPlay={false}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default function AnimationGallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
      {animations.map((a) => (
        <article key={a.id} style={{ display: 'flex', flexDirection: 'column' }}>
          <AnimationPreview a={a} />
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
