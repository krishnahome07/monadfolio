import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';
import { useFarcasterSDK } from './useFarcasterSDK';

export const useWalletConnection = () => {
  const { isConnected, address, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { isInFarcaster, isReady } = useFarcasterSDK();
  const [hasAttemptedAutoConnect, setHasAttemptedAutoConnect] = useState(false);

  // Auto-connect when in Farcaster and SDK is ready
  useEffect(() => {
    if (isReady && isInFarcaster && !isConnected && !hasAttemptedAutoConnect && connectors.length > 0) {
      console.log('🔗 Attempting auto-connect with Farcaster wallet...');
      setHasAttemptedAutoConnect(true);
      
      // Use the first (and likely only) connector which should be the Farcaster miniapp connector
      const farcasterConnector = connectors[0];
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    }
  }, [isReady, isInFarcaster, isConnected, hasAttemptedAutoConnect, connectors, connect]);

  const handleConnect = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setHasAttemptedAutoConnect(false);
  };

  return {
    isConnected,
    address,
    isConnecting: isConnecting || isPending,
    connect: handleConnect,
    disconnect: handleDisconnect,
    isInFarcaster,
    hasWalletAvailable: connectors.length > 0
  };
};