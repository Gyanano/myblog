import type { ComponentType } from 'react';

export type AnimationParam = {
  name: string;
  desc: string;
  default: string | number | boolean;
};

export type AnimationMeta = {
  /** 必须与所在文件夹名一致 */
  id: string;
  title: string;
  /** 入场 / 退场 / 强调 / 转场 / 背景 … */
  category: string;
  description: string;
  /** 「复制 Prompt」吐出的自然语言描述，遵循固定模板 */
  prompt: string;
  params: AnimationParam[];
  component: ComponentType<any>;
  /** Player 的 inputProps 与 Composition 的 defaultProps 共用 */
  defaultProps: Record<string, unknown>;
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
};

/**
 * 定义一个动画。借助泛型 P，在定义处即校验 `component` 的 props 与 `defaultProps`
 * 是否一致（少字段/类型不符会在这里报错），对外仍擦除成松散的 `AnimationMeta`，
 * 让 registry 能把不同 props 形状的动画放进同一个数组。
 */
export function defineAnimation<P>(
  def: Omit<AnimationMeta, 'component' | 'defaultProps'> & {
    component: ComponentType<P>;
    defaultProps: P;
  }
): AnimationMeta {
  return def as unknown as AnimationMeta;
}
