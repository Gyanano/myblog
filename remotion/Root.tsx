import type React from 'react';
import { Composition } from 'remotion';
import { animations } from '../src/animations/registry';

export const RemotionRoot = () => {
  return (
    <>
      {animations.map((a) => (
        <Composition
          key={a.id}
          id={a.id}
          component={a.component as React.ComponentType<Record<string, unknown>>}
          durationInFrames={a.durationInFrames}
          fps={a.fps}
          width={a.width}
          height={a.height}
          defaultProps={a.defaultProps}
        />
      ))}
    </>
  );
};
