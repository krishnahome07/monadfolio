import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';
import { useFarcasterSDK } from './useFarcasterSDK';

export const useWalletConnection = () => {
  const { isConnected, address, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { isInFarcaster, isReady } = useFarcasterSDK();
  const [hasAttemptedAutoConnect, setHasAttemptedAutoConnect] = useState(false);

  useEffect(() => {
    if (isReady && isInFarcaster && !isConnected && !hasAttemptedAutoConnect && connectors.length > 0) {
      setHasAttemptedAutoConnect(true);
      
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