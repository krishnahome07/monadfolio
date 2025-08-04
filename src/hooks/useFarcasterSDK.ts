import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export const useFarcasterSDK = () => {
  const [context, setContext] = useState<any>();
  const [isReady, setIsReady] = useState(false);
  const [isInFarcaster, setIsInFarcaster] = useState(false);

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
        
        setIsReady(true);
        
      } catch (error) {
        console.log('⚠️ Farcaster SDK initialization failed:', error);
        // Still set ready to true so app loads normally for non-Farcaster users
        setIsReady(true);
      }
    };

    initializeSDK();
  }, []);

  return {
    context,
    isReady,
    isInFarcaster
  };
};