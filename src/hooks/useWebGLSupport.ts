'use client';

import { useEffect, useState } from 'react';

/** Three.js requires WebGL 2; a WebGL 1 context is not sufficient. */
export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let context: WebGL2RenderingContext | null = null;
    try {
      context = document.createElement('canvas').getContext('webgl2', {
        antialias: false,
        powerPreference: 'default',
      });
      setSupported(Boolean(context && !context.isContextLost()));
    } catch {
      // Browser policies, GPU failures, and privacy settings can also throw.
      setSupported(false);
    } finally {
      // Do not retain a second GPU context just to detect support.
      try { context?.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* Optional browser extension. */ }
    }
  }, []);

  return supported;
}
