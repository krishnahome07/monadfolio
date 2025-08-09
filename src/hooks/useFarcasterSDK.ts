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
        
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          console.log('⏰ SDK initialization timeout - proceeding as web app');
          setIsInFarcaster(false);
          setIsReady(true);
        }, 3000);
        
        if (!sdk) {
          console.log('❌ Farcaster SDK not available - running as standalone web app');
          clearTimeout(timeout);
          setIsInFarcaster(false);
          setIsReady(true);
          return;
        }

        try {
          const frameContext = await sdk.context;
          console.log('📱 Farcaster context received:', {
            user: frameContext?.user ? {
              fid: frameContext.user.fid,
              username: frameContext.user.username,
              displayName: frameContext.user.displayName
            } : null
          });
          
          // Only set isInFarcaster to true if we actually have a valid context
          if (frameContext && (frameContext.user || frameContext.client)) {
            setContext(frameContext);
            setIsInFarcaster(true);
            
            console.log('✅ Calling sdk.actions.ready() to hide splash screen...');
            await sdk.actions.ready();
            console.log('🎉 Splash screen dismissed successfully!');
          } else {
            console.log('⚠️ No valid Farcaster context - running as web app');
            setIsInFarcaster(false);
          }
          
          clearTimeout(timeout);
          setIsReady(true);
        } catch (contextError) {
          console.log('⚠️ Failed to get Farcaster context - running as web app:', contextError);
          clearTimeout(timeout);
          setIsInFarcaster(false);
          setIsReady(true);
        }
        
      } catch (error) {
        console.log('⚠️ Farcaster SDK initialization failed:', error);
        setIsInFarcaster(false);
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