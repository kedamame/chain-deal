'use client';

import { useEffect, useState, useRef } from 'react';

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface FarcasterState {
  isInMiniApp: boolean;
  isLoading: boolean;
  user: FarcasterUser | null;
}

export function useFarcasterMiniApp(): FarcasterState {
  const [state, setState] = useState<FarcasterState>({
    isInMiniApp: false,
    isLoading: true,
    user: null,
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    import('@farcaster/miniapp-sdk')
      .then(async ({ sdk }) => {
        const isMiniApp = await sdk.isInMiniApp();
        if (!isMiniApp) {
          setState({ isInMiniApp: false, isLoading: false, user: null });
          return;
        }
        sdk.actions.ready();
        let user: FarcasterUser | null = null;
        try {
          const context = await sdk.context;
          if (context?.user) {
            const u = context.user as {
              fid: number;
              username?: string;
              displayName?: string;
              pfpUrl?: string;
            };
            user = { fid: u.fid, username: u.username, displayName: u.displayName, pfpUrl: u.pfpUrl };
          }
        } catch { /* context not available */ }
        setState({ isInMiniApp: true, isLoading: false, user });
      })
      .catch(() => setState({ isInMiniApp: false, isLoading: false, user: null }));
  }, []);

  return state;
}
