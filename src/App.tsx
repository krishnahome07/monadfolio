import React, { useState, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GameBoard } from './components/GameBoard';
import { SolutionPath } from './components/SolutionPath';
import { UserStats } from './components/UserStats';
import { GameComplete } from './components/GameComplete';
import { MaintenanceMode } from './components/MaintenanceMode';
import { HowToPlay } from './components/HowToPlay';
import { useGame } from './hooks/useGame';
import { useFarcasterSDK } from './hooks/useFarcasterSDK';
import { generateShareText } from './utils/gameLogic';
import { updateUserStats, getUserStats } from './lib/supabase';
import { sdk } from '@farcaster/miniapp-sdk';

const queryClient = new QueryClient();

function GameApp() {
  const { gameState, startNewGame, selectNumber, selectOperation } = useGame();
  const { context, isReady, isInFarcaster } = useFarcasterSDK();
  const [statsUpdated, setStatsUpdated] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'success' | 'error'>('idle');
  const [userStats, setUserStats] = useState<any>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Check if app is enabled (default to true if not set)
  const appEnabledEnv = import.meta.env.VITE_APP_ENABLED;
  const isAppEnabled = appEnabledEnv !== 'false';

  // Create a stable user identifier
  const userIdentifier = useMemo(() => {
    if (context?.user) {
      const farcasterUser = context.user.username || context.user.displayName || `fid_${context.user.fid}`;
      return farcasterUser.replace(/[<>\"'&]/g, '').substring(0, 50);
    }
    
    let guestId = localStorage.getItem('number-crunch-guest-id');
    if (!guestId) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      guestId = 'guest_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      localStorage.setItem('number-crunch-guest-id', guestId);
    }
    return guestId;
  }, [context?.user]);

  // Load user stats when user identifier changes
  useEffect(() => {
    const loadStats = async () => {
      if (userIdentifier) {
        try {
          const stats = await getUserStats(userIdentifier);
          setUserStats(stats);
        } catch (error) {
          console.error('Failed to load user stats:', error);
        }
      }
    };
    loadStats();
  }, [userIdentifier, refreshStats]);

  // Show how to play on first visit for new users
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem('number-crunch-seen-instructions');
    if (!hasSeenInstructions && userIdentifier) {
      setShowHowToPlay(true);
      localStorage.setItem('number-crunch-seen-instructions', 'true');
    }
  }, [userIdentifier]);

  const handleShare = async () => {
    setShareStatus('sharing');
    
    try {
      const totalPuzzlesSolved = userStats?.total_puzzles_solved || 0;
      const shareText = generateShareText(
        gameState.target,
        gameState.moves,
        gameState.time,
        gameState.solutionPath,
        gameState.difficulty,
        totalPuzzlesSolved
      );

      console.log('📤 Attempting to share solution...');
      console.log('🔍 Is in Farcaster:', isInFarcaster);

      // Try Farcaster sharing first if in Farcaster
      if (isInFarcaster && sdk && sdk.actions) {
        console.log('🎯 Attempting Farcaster share via miniapp SDK...');
        try {
          const encodedText = encodeURIComponent(shareText);
          const encodedUrl = encodeURIComponent(window.location.origin);
          await sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedUrl}`);
          console.log('✅ Farcaster composer opened successfully');
          setShareStatus('success');
          setTimeout(() => setShareStatus('idle'), 3000);
          return;
        } catch (farcasterError) {
          console.log('❌ Farcaster SDK share failed:', farcasterError);
        }
      }

      // Try Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
        console.log('📱 Using Web Share API');
        try {
          await navigator.share({
            title: 'Number Crunch - Math Puzzle',
            text: shareText,
            url: window.location.origin
          });
          console.log('✅ Web Share API successful');
          setShareStatus('success');
          return;
        } catch (shareError: any) {
          console.log('❌ Web Share API failed:', shareError);
          if (shareError.name === 'AbortError') {
            setShareStatus('idle');
            return;
          }
        }
      }

      // Fallback to clipboard
      console.log('📋 Falling back to clipboard');
      let clipboardSuccess = false;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareText);
          console.log('✅ Clipboard write successful');
          clipboardSuccess = true;
        } catch (clipboardError) {
          console.log('❌ Clipboard API failed:', clipboardError);
        }
      }
      
      if (!clipboardSuccess) {
        console.log('📝 Using fallback text selection method');
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        textArea.setAttribute('aria-hidden', 'true');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            console.log('✅ Fallback copy successful');
            clipboardSuccess = true;
          }
        } catch (err) {
          console.error('❌ Fallback copy failed:', err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
      
      if (clipboardSuccess) {
        setShareStatus('success');
        alert('🎉 Solution copied to clipboard! Share it with your friends!');
      } else {
        console.log('📄 Using prompt as final fallback');
        const userCopied = prompt('Copy this text to share your solution:', shareText);
        if (userCopied !== null) {
          setShareStatus('success');
        } else {
          setShareStatus('error');
        }
      }
    } catch (error) {
      console.error('❌ Share failed completely:', error);
      setShareStatus('error');
      
      const totalPuzzlesSolved = userStats?.total_puzzles_solved || 0;
      const shareText = generateShareText(
        gameState.target,
        gameState.moves,
        gameState.time,
        gameState.solutionPath,
        gameState.difficulty,
        totalPuzzlesSolved
      );
      
      alert('Share failed. Here\'s your solution text:\n\n' + shareText);
    }

    setTimeout(() => setShareStatus('idle'), 3000);
  };

  const handleNewGame = async () => {
    setStatsUpdated(false);
    startNewGame();
  };

  const handleShowHelp = () => {
    setShowHowToPlay(true);
  };

  const handleCloseHelp = () => {
    setShowHowToPlay(false);
  };

  // Update stats when game is completed
  useEffect(() => {
    const updateStats = async () => {
      if (gameState.isComplete && userIdentifier && !statsUpdated) {
        console.log('🎯 Game completed! Updating stats...');
        
        try {
          const result = await updateUserStats(userIdentifier, gameState.time, gameState.moves);
          console.log('✅ Stats update successful:', result);
          setStatsUpdated(true);
          setUserStats(result);
          setRefreshStats(prev => prev + 1);
        } catch (error) {
          console.error('❌ Error updating user stats:', error);
        }
      }
    };

    updateStats();
  }, [gameState.isComplete, userIdentifier, gameState.time, gameState.moves, statsUpdated]);

  // Show loading screen until SDK is ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Number Crunch...</p>
          <p className="text-sm text-gray-500 mt-2">Initializing Farcaster SDK...</p>
        </div>
      </div>
    );
  }

  // Show maintenance mode if app is disabled
  if (!isAppEnabled) {
    return <MaintenanceMode />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto py-8">
        <UserStats 
          userIdentifier={userIdentifier}
          farcasterUser={context?.user}
          isInFarcaster={isInFarcaster}
          refreshTrigger={refreshStats}
        />
        
        {gameState.isComplete ? (
          <div className="space-y-6">
            <GameComplete
              time={gameState.time}
              moves={gameState.moves}
              target={gameState.target}
              difficulty={gameState.difficulty}
              onNewGame={handleNewGame}
              onShare={handleShare}
              shareStatus={shareStatus}
            />
            <SolutionPath
              solutionPath={gameState.solutionPath}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <GameBoard
              gameState={gameState}
              onNumberSelect={selectNumber}
              onOperationSelect={selectOperation}
              onNewGame={handleNewGame}
              onShowHelp={handleShowHelp}
            />
            {gameState.solutionPath.length > 0 && (
              <SolutionPath
                solutionPath={gameState.solutionPath}
              />
            )}
          </div>
        )}
        
        <HowToPlay 
          isOpen={showHowToPlay} 
          onClose={handleCloseHelp} 
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameApp />
    </QueryClientProvider>
  );
}

export default App;