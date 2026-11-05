import { useState } from 'react';
import './color-bg.css';

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

/** 按亮度选舞台上的文字色，任何底色上都读得清 */
function readableOn({ r, g, b }: { r: number; g: number; b: number }): string {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? '#0b0c0d' : '#f4f2ec';
}

export default function ColorBg() {
  const [color, setColor] = useState('#2F6F5E');
  const [hexInput, setHexInput] = useState('#2F6F5E');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(color);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hexValid = normalizeHex(hexInput) !== null;

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
      await navigator.clipboard.writeText(text);
      setCopied(key);
    } catch {
      setCopied(`${key}-fail`);
    }
    setTimeout(() => setCopied(null), 1500);
  };
  const copyLabel = (key: string, text: string) =>
    copied === key ? '已复制' : copied === `${key}-fail` ? '复制失败' : text;

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
    <div className="cg" style={{ background: color, color: readableOn(rgb) }}>
      <div className="cg-read" aria-live="polite">
        <strong>{color}</strong>
        <span>{rgbString}</span>
      </div>

      <div className="cg-panel">
        <div className="cg-row">
          <label className="cg-swatch" style={{ background: color }}>
            <span className="sr">取色器</span>
            <input type="color" value={color} onChange={(e) => onPicker(e.target.value)} />
          </label>
          <label className="cg-field cg-grow">
            <span>HEX</span>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => onHexInput(e.target.value)}
              spellCheck={false}
              aria-invalid={!hexValid}
            />
          </label>
        </div>
        <div className="cg-row">
          <button type="button" className="cg-btn" onClick={() => copy('hex', color)}>{copyLabel('hex', '复制 HEX')}</button>
          <button type="button" className="cg-btn" onClick={() => copy('rgb', rgbString)}>{copyLabel('rgb', '复制 RGB')}</button>
        </div>

        <div className="cg-sep" />

        <div className="cg-presets">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="cg-btn"
              aria-pressed={width === p.w && height === p.h}
              onClick={() => { setWidth(p.w); setHeight(p.h); }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="cg-row">
          <label className="cg-field cg-grow">
            <span>宽</span>
            <input type="number" min={1} max={8192} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          </label>
          <label className="cg-field cg-grow">
            <span>高</span>
            <input type="number" min={1} max={8192} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          </label>
        </div>
        <button type="button" className="cg-export" onClick={exportPng}>导出 PNG</button>
      </div>
    </div>
  );
}
