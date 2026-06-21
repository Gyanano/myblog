import type { AnimationMeta } from './types';
import { meta as inkSpread } from './ink-spread/meta';
import { meta as textFadeIn } from './text-fade-in/meta';
import { meta as fadeUp } from './fade-up/meta';
import { meta as scalePop } from './scale-pop/meta';
import { meta as wipeReveal } from './wipe-reveal/meta';
import { meta as slideIn } from './slide-in/meta';
import { meta as countUp } from './count-up/meta';

// 注意：本文件被 Remotion(webpack) 与 Astro(vite) 共用，
// 禁止使用 ?raw / import.meta.glob 等 Vite 专属语法。
export const animations: AnimationMeta[] = [
  inkSpread,
  textFadeIn,
  fadeUp,
  scalePop,
  wipeReveal,
  slideIn,
  countUp,
];
