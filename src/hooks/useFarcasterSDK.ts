import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export const useFarcasterSDK = () => {
  const [context, setContext] = useState<any>();
  const [isReady, setIsReady] = useState(false);
  const [isInFarcaster, setIsInFarcaster] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const timeout = setTimeout(() => {
          setIsInFarcaster(false);
          setIsReady(true);
        }, 3000);
        
        if (!sdk) {
          clearTimeout(timeout);
          setIsInFarcaster(false);
          setIsReady(true);
          return;
        }

        try {
          const frameContext = await sdk.context;
          
          if (frameContext && (frameContext.user || frameContext.client)) {
            setContext(frameContext);
            setIsInFarcaster(true);
            
            await sdk.actions.ready();
          } else {
            setIsInFarcaster(false);
          }
          
          clearTimeout(timeout);
          setIsReady(true);
        } catch (contextError) {
          clearTimeout(timeout);
          setIsInFarcaster(false);
          setIsReady(true);
        }
        
      } catch (error) {
        console.error('Farcaster SDK initialization failed:', error);
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