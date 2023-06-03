import { useEffect, useMemo, useState } from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'
import { AppProvider } from '../context/context'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { goerli } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { chains, provider } = configureChains(
  [goerli],
  [
    infuraProvider({ apiKey: process.env.INFURA_API_KEY, priority: 1 }),
    jsonRpcProvider({
      priority: 2,
      rpc: chain => ({
        http: `HTTP://127.0.0.1:7545`,
      }),
    }),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
