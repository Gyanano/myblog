import type { ToolMeta } from './types';
import { meta as colorBg } from './color-bg/meta';

// 仅汇总元数据：禁止 import 任何工具组件，保持索引页轻量。
export const tools: ToolMeta[] = [colorBg];
