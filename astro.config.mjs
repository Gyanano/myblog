// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // 代码配色交给 CSS 变量，放在 global.css，和全站令牌一起管理
  markdown: { shikiConfig: { theme: 'css-variables' } },
  // 指针停留时预取，点击后几乎不用等网络
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // 启动时预构建，避免开发中才发现依赖、导致旧缓存返回 504
  vite: {
    optimizeDeps: {
      include: [
        'gsap',
        'lenis',
        'react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/client',
        'astro/virtual-modules/transitions-router.js',
        'astro/virtual-modules/transitions-types.js',
        'astro/virtual-modules/transitions-events.js',
        'astro/virtual-modules/transitions-swap-functions.js',
      ],
    },
  },
});
