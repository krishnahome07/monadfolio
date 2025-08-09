import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { useEffect, useState } from 'react'
import { monadTestnet } from '../config/wagmi'

export const useFarcasterWallet = () => {
  const { isConnected, address, chain } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false)

  // Auto-connect when component mounts
  useEffect(() => {
    if (!isConnected && !autoConnectAttempted && connectors.length > 0) {
      console.log('🔌 Auto-connecting to Farcaster wallet...')
      setAutoConnectAttempted(true)
      connect({ connector: connectors[0] })
    }
  }, [isConnected, autoConnectAttempted, connectors, connect])

  // Auto-switch to Monad testnet when connected
  useEffect(() => {
    if (isConnected && chain?.id !== monadTestnet.id && !isSwitching) {
      console.log('🔄 Switching to Monad testnet...')
      switchChain({ chainId: monadTestnet.id })
    }
  }, [isConnected, chain?.id, switchChain, isSwitching])

  const connectWallet = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] })
    }
  }

  const switchToMonad = () => {
    switchChain({ chainId: monadTestnet.id })
  }

  return {
    isConnected,
    address,
    chain,
    isConnecting,
    isSwitching,
    connectWallet,
    disconnect,
    switchToMonad,
    isOnMonad: chain?.id === monadTestnet.id
  }
}