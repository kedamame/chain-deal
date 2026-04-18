import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

export const config = createConfig({
  chains: [base],
  connectors: [
    farcasterMiniApp(),
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: 'Chain Deal', preference: { options: 'all' } }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
  multiInjectedProviderDiscovery: true,
});
