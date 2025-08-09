import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { connectWallet } from '../utils/monadApi';

export const useFarcasterSDK = () => {
  const [context, setContext] = useState<any>();
  const [isReady, setIsReady] = useState(false);
  const [isInFarcaster, setIsInFarcaster] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [autoConnecting, setAutoConnecting] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log('🚀 Initializing Farcaster Miniapp SDK...');
        
        // Check if SDK is available
        if (!sdk) {
          console.log('❌ Farcaster SDK not available');
          setIsReady(true);
          return;
        }

        // Get context from the SDK
        const frameContext = await sdk.context;
        console.log('📱 Farcaster context received:', frameContext);
        
        setContext(frameContext);
        setIsInFarcaster(true);
        
        // Call ready to hide the splash screen
        console.log('✅ Calling sdk.actions.ready() to hide splash screen...');
        await sdk.actions.ready();
        console.log('🎉 Splash screen dismissed successfully!');
        
        // Auto-connect wallet after SDK is ready
        if (frameContext?.user) {
          console.log('🔌 Auto-connecting Farcaster wallet for user:', frameContext.user.fid);
          await autoConnectFarcasterWallet();
        }
        
        setIsReady(true);
        
      } catch (error) {
        console.log('⚠️ Farcaster SDK initialization failed:', error);
        // Still set ready to true so app loads normally for non-Farcaster users
        setIsReady(true);
      }
    };

    const autoConnectFarcasterWallet = async () => {
      setAutoConnecting(true);
      try {
        console.log('🔗 Attempting automatic Farcaster wallet connection...');
        
        // Try to connect to the user's wallet
        const address = await connectWallet();
        
        if (address) {
          console.log('✅ Farcaster wallet connected automatically:', address);
          setConnectedAddress(address);
        } else {
          console.log('⚠️ No wallet detected in Farcaster context');
        }
      } catch (error) {
        console.error('❌ Auto wallet connection failed:', error);
      } finally {
        setAutoConnecting(false);
      }
    };

    initializeSDK();
  }, []);

  return {
    context,
    isReady,
    isInFarcaster,
    connectedAddress,
    autoConnecting
  };
};