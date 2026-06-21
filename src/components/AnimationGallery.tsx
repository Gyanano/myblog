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
  const rafId = useRef<number | null>(null);
  const lastFrame = a.durationInFrames - 1;
  const { fps } = a;

  const stop = () => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = null;
  };

  // 不用 Player 的 play()：它被当作媒体播放，受浏览器「用户激活」策略限制——
  // mouseenter / 移动鼠标不算手势，会出现「先点几下页面才肯播」。
  // 改为自己按时间推进帧：每帧用 seekTo 跳到对应帧；seekTo 只是跳帧渲染、不需要手势，
  // 于是首次悬浮即可播放。
  const playOnce = () => {
    stop();
    const startedAt = performance.now();
    const step = (now: number) => {
      const p = ref.current;
      if (!p) {
        // ref 尚未就绪，下一帧再试
        rafId.current = requestAnimationFrame(step);
        return;
      }
      const elapsed = ((now - startedAt) / 1000) * fps;
      if (elapsed >= lastFrame) {
        p.seekTo(lastFrame); // 这一遍放完，停在定格帧
        rafId.current = null;
        if (hovering.current) playOnce(); // 仍在悬浮 → 再来一遍
        return;
      }
      p.seekTo(Math.round(elapsed));
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
  };

  // 卸载时清理（站点用 <ClientRouter />，导航会卸载该 island）
  useEffect(() => stop, []);

  const onEnter = () => {
    hovering.current = true;
    playOnce();
  };
  // 移出只置标志：当前这一遍会自然放完（到末帧时因 hovering=false 不再续播，停在定格帧）
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
