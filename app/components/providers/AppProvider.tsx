'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useConnect, useConnectors } from 'wagmi';
import { config } from '@/app/lib/wagmi';

function AutoConnect() {
  const { mutate: connect } = useConnect();
  const connectors = useConnectors();

  useEffect(() => {
    const connector = connectors.find(c => c.id === 'farcaster');
    if (connector) connect({ connector });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
