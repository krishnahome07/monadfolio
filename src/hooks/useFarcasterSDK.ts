import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export const useFarcasterSDK = () => {
  const [context, setContext] = useState<any>();
  const [isReady, setIsReady] = useState(false);
  const [isInFarcaster, setIsInFarcaster] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [autoConnecting, setAutoConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log('🚀 Initializing Farcaster Miniapp SDK...');
        
        // Check if SDK is available
        if (!sdk) {
          console.log('❌ Farcaster SDK not available - running as standalone web app');
          setIsReady(true);
          return;
        }

        // Get context from the SDK
        const frameContext = await sdk.context;
        console.log('📱 Farcaster context received:', {
          user: frameContext?.user ? {
            fid: frameContext.user.fid,
            username: frameContext.user.username,
            displayName: frameContext.user.displayName
          } : null,
          location: frameContext?.location
        });
        
        setContext(frameContext);
        setIsInFarcaster(true);
        
        // Call ready to hide the splash screen
        console.log('✅ Calling sdk.actions.ready() to hide splash screen...');
        await sdk.actions.ready();
        console.log('🎉 Splash screen dismissed successfully!');
        
        // Auto-connect Farcaster wallet after SDK is ready
        if (frameContext?.user) {
          console.log('🔌 Auto-connecting Farcaster wallet for user:', frameContext.user.fid);
          await autoConnectFarcasterWallet(frameContext);
        } else {
          console.log('⚠️ No Farcaster user context available');
          setIsReady(true);
        }
        
      } catch (error) {
        console.log('⚠️ Farcaster SDK initialization failed:', error);
        setConnectionError('Failed to initialize Farcaster SDK');
        // Still set ready to true so app loads normally for non-Farcaster users
        setIsReady(true);
      }
    };

    const autoConnectFarcasterWallet = async (frameContext: any) => {
      setAutoConnecting(true);
      setConnectionError(null);
      
      try {
        console.log('🔗 Attempting automatic Farcaster wallet connection...');
        
        // Try to get the user's connected wallet address from Farcaster
        let walletAddress = null;
        
        // Method 1: Try to get wallet from Farcaster context
        if (frameContext.user?.custodyAddress) {
          walletAddress = frameContext.user.custodyAddress;
          console.log('✅ Found custody address from Farcaster:', walletAddress);
        }
        
        // Method 2: Try to connect via browser wallet if available
        if (!walletAddress && typeof window !== 'undefined' && window.ethereum) {
          try {
            console.log('🦊 Attempting to connect browser wallet...');
            
            // Request account access
            const accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            });
            
            if (accounts && accounts.length > 0) {
              walletAddress = accounts[0];
              console.log('✅ Connected browser wallet:', walletAddress);
              
              // Try to switch to Monad testnet
              try {
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: '0x279F' }], // 10143 in hex
                });
                console.log('✅ Switched to Monad testnet');
              } catch (switchError: any) {
                // If switch fails, try to add the network
                if (switchError.code === 4902) {
                  try {
                    await window.ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [{
                        chainId: '0x279F',
                        chainName: 'Monad Testnet',
                        nativeCurrency: {
                          name: 'Monad',
                          symbol: 'MON',
                          decimals: 18
                        },
                        rpcUrls: ['https://testnet1.monad.xyz'],
                        blockExplorerUrls: ['https://testnet.monadexplorer.com']
                      }]
                    });
                    console.log('✅ Added and switched to Monad testnet');
                  } catch (addError) {
                    console.warn('⚠️ Failed to add Monad testnet:', addError);
                  }
                }
              }
            }
          } catch (walletError) {
            console.warn('⚠️ Browser wallet connection failed:', walletError);
          }
        }
        
        // Method 3: Check if user has verified addresses
        if (!walletAddress && frameContext.user?.verifiedAddresses?.eth_addresses?.length > 0) {
          walletAddress = frameContext.user.verifiedAddresses.eth_addresses[0];
          console.log('✅ Found verified ETH address from Farcaster:', walletAddress);
        }
        
        if (walletAddress) {
          console.log('🎉 Successfully connected Farcaster wallet:', walletAddress);
          setConnectedAddress(walletAddress);
        } else {
          console.log('⚠️ No wallet address found in Farcaster context');
          setConnectionError('No wallet connected to your Farcaster account');
        }
        
      } catch (error) {
        console.error('❌ Auto wallet connection failed:', error);
        setConnectionError('Failed to connect Farcaster wallet');
      } finally {
        setAutoConnecting(false);
        setIsReady(true);
      }
    };

    initializeSDK();
  }, []);

  const retryConnection = async () => {
    if (context?.user) {
      setConnectionError(null);
      await autoConnectFarcasterWallet(context);
    }
  };

  return {
    context,
    isReady,
    isInFarcaster,
    connectedAddress,
    autoConnecting,
    connectionError,
    retryConnection
  };
};