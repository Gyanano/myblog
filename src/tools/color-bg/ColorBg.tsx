import { useState } from 'react';
import type { CSSProperties } from 'react';

const PRESETS = [
  { label: '1920×1080', w: 1920, h: 1080 },
  { label: '3840×2160', w: 3840, h: 2160 },
  { label: '1080×1080', w: 1080, h: 1080 },
  { label: '1080×1920', w: 1080, h: 1920 },
];

/** 归一化为 #RRGGBB（接受 #RGB / RGB / #RRGGBB / RRGGBB，大小写均可）；无效返回 null */
function normalizeHex(input: string): string | null {
  let s = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(s)) {
    s = s.split('').map((c) => c + c).join('');
  }
  if (/^[0-9a-fA-F]{6}$/.test(s)) return '#' + s.toUpperCase();
  return null;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const s = hex.replace(/^#/, '');
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const btn: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.85rem',
  padding: '0.4rem 0.9rem',
  border: '1px solid var(--ink-light, #8A857D)',
  background: 'transparent',
  color: 'var(--ink-dark, #2A2825)',
  cursor: 'pointer',
  borderRadius: 2,
};

const field: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.9rem',
  padding: '0.35rem 0.5rem',
  border: '1px solid var(--ink-wash, rgba(42,40,37,0.2))',
  borderRadius: 2,
  background: 'transparent',
  color: 'var(--ink-dark, #2A2825)',
};

const label: CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.7rem',
  color: 'var(--ink-light, #8A857D)',
  display: 'block',
  marginBottom: '0.3rem',
};

export default function ColorBg() {
  const [color, setColor] = useState('#BE3A3A');
  const [hexInput, setHexInput] = useState('#BE3A3A');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [copied, setCopied] = useState<string | null>(null);

  const { r, g, b } = hexToRgb(color);
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  const onHexInput = (v: string) => {
    setHexInput(v);
    const norm = normalizeHex(v);
    if (norm) setColor(norm);
  };
  const onPicker = (v: string) => {
    const up = v.toUpperCase();
    setColor(up);
    setHexInput(up);
  };

  const copy = async (key: string, text: string) => {
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable (需 HTTPS 或 localhost)');
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error('[ColorBg] 复制失败：', err);
    }
  };

  const exportPng = () => {
    const w = clamp(Math.round(width) || 1, 1, 8192);
    const h = clamp(Math.round(height) || 1, 1, 8192);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `color-${color.replace('#', '').toUpperCase()}-${w}x${h}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 实时预览 */}
      <div
        style={{
          height: '38vh',
          minHeight: 220,
          borderRadius: 2,
          border: '1px solid var(--ink-wash, rgba(42,40,37,0.15))',
          background: color,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '0.8rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.85)',
            mixBlendMode: 'difference',
          }}
        >
          {color} · {rgbString}
        </span>
      </div>

      {/* 取色 + 色值 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', alignItems: 'flex-end' }}>
        <div>
          <span style={label}>取色器</span>
          <input
            type="color"
            value={color}
            onChange={(e) => onPicker(e.target.value)}
            style={{ width: 56, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }}
          />
        </div>
        <div>
          <span style={label}>HEX</span>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => onHexInput(e.target.value)}
            spellCheck={false}
            style={{ ...field, width: 110 }}
          />
        </div>
        <div>
          <span style={label}>RGB</span>
          <input type="text" value={rgbString} readOnly style={{ ...field, width: 160 }} />
        </div>
        <button style={btn} onClick={() => copy('hex', color)}>
          {copied === 'hex' ? '已复制 ✓' : '复制 HEX'}
        </button>
        <button style={btn} onClick={() => copy('rgb', rgbString)}>
          {copied === 'rgb' ? '已复制 ✓' : '复制 RGB'}
        </button>
      </div>

      {/* 分辨率 + 导出 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              style={{
                ...btn,
                borderColor:
                  width === p.w && height === p.h ? 'var(--cinnabar, #BE3A3A)' : 'var(--ink-light, #8A857D)',
                color:
                  width === p.w && height === p.h ? 'var(--cinnabar, #BE3A3A)' : 'var(--ink-dark, #2A2825)',
              }}
              onClick={() => {
                setWidth(p.w);
                setHeight(p.h);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', alignItems: 'flex-end' }}>
          <div>
            <span style={label}>宽 (px)</span>
            <input
              type="number"
              min={1}
              max={8192}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              style={{ ...field, width: 100 }}
            />
          </div>
          <div>
            <span style={label}>高 (px)</span>
            <input
              type="number"
              min={1}
              max={8192}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              style={{ ...field, width: 100 }}
            />
          </div>
          <button style={{ ...btn, borderColor: 'var(--cinnabar)', color: 'var(--cinnabar)' }} onClick={exportPng}>
            导出 PNG
          </button>
        </div>
      </div>
    </div>
  );
}
