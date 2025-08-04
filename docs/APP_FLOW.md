# 🔄 Number Crunch - App Flow Overview

This document provides a comprehensive overview of how the Number Crunch application initializes, loads, and operates. It's designed for developers who need to understand the application architecture and flow.

## 📋 Table of Contents

1. [Initial Load Sequence](#1-initial-load-sequence)
2. [File Loading Order](#2-file-loading-order)
3. [Initialization Flow](#3-initialization-flow-in-gameapp)
4. [Component Rendering Flow](#4-component-rendering-flow)
5. [Key Components Called Initially](#5-key-components-called-initially)
6. [Database Integration](#6-database-integration)
7. [Tutorial System](#7-tutorial-system)
8. [State Management](#8-state-management)
9. [Environment Configuration](#9-environment-configuration)
10. [Responsive Flow](#10-responsive-flow)
11. [Error Handling](#11-error-handling)

---

## 1. **Initial Load Sequence**

```
index.html → src/main.tsx → src/App.tsx → Components
```

The application follows a standard React initialization pattern with additional Farcaster miniapp integration.

---

## 2. **File Loading Order**

### **Entry Point:**
- **`index.html`** - Contains meta tags, CSP headers, and Farcaster miniapp configuration
- **`src/main.tsx`** - React entry point that renders the App component

### **Main Application:**
- **`src/App.tsx`** - Main application component with two wrapper functions:
  - `App()` - Provides React Query context
  - `GameApp()` - Contains all the game logic and state management

---

## 3. **Initialization Flow in GameApp()**

### **Hook Initialization:**
```typescript
const { gameState, startNewGame, selectNumber, selectOperation } = useGame();
const { context, isReady, isInFarcaster } = useFarcasterSDK();
const [showHowToPlay, setShowHowToPlay] = useState(false);
```

### **Detailed Initialization Steps:**

1. **Farcaster SDK Setup:**
   - `src/hooks/useFarcasterSDK.ts` initializes the Farcaster miniapp SDK
   - Calls `sdk.actions.ready()` to hide the splash screen
   - Determines if running inside Farcaster or as standalone web app

2. **User Identification:**
   - Creates stable user identifier (Farcaster user or guest ID)
   - Loads user stats from Supabase database

3. **Game Initialization:**
   - `src/hooks/useGame.ts` automatically starts a new game on mount
   - Calls `generatePuzzle()` from `src/utils/gameLogic.ts`

4. **Tutorial System Setup:**
   - Checks localStorage for `'number-crunch-seen-instructions'`
   - Shows tutorial popup automatically for first-time users
   - Sets localStorage flag to prevent repeated automatic displays

---

## 4. **Component Rendering Flow**

### **Loading State:**
```typescript
if (!isReady) {
  return <LoadingScreen />; // Shows while SDK initializes
}
```

### **Maintenance Mode Check:**
```typescript
if (!isAppEnabled) {
  return <MaintenanceMode />; // If VITE_APP_ENABLED=false
}
```

### **Main Game Interface:**
```typescript
<UserStats /> // Always shown at top
{gameState.isComplete ? (
  <GameComplete /> + <SolutionPath />
) : (
  <GameBoard /> + <SolutionPath />
)}
<HowToPlay /> // Tutorial popup (conditional rendering)
```

---

## 5. **Key Components Called Initially**

### **1. `src/components/UserStats.tsx`**
- **Purpose**: Displays user profile and statistics
- **Data Source**: Loads data from Supabase via `src/lib/supabase.ts`
- **Behavior**: Shows different UI based on Farcaster vs guest user

### **2. `src/components/GameBoard.tsx`**
- **Purpose**: Main game interface with numbers and operations
- **Functionality**: Handles user interactions (number selection, operations)
- **State**: Manages selected numbers and operations

### **3. `src/utils/gameLogic.ts`**
- **Purpose**: Core game logic and puzzle generation
- **Key Functions**:
  - `generatePuzzle()` - Creates solvable puzzles
  - `performOperation()` - Handles mathematical operations
  - `applyOperation()` - Updates game state after operations

### **4. `src/components/HowToPlay.tsx`**
- **Purpose**: Interactive tutorial popup for new users
- **Features**: 
  - Compact, mobile-friendly design
  - Step-by-step game instructions
  - Example walkthrough
  - Prominent close button
- **Behavior**: Shows automatically for new users, accessible via button for all users

---

## 6. **Database Integration**

### **Supabase Configuration:**
- **File**: `src/lib/supabase.ts`
- **Schema**: Defined in `supabase/migrations/20250702090608_black_frost.sql`
- **Operations**: Automatically creates/updates user stats when games are completed

### **Database Operations:**
```typescript
// Get user statistics
const stats = await getUserStats(userIdentifier);

// Update stats after game completion
const result = await updateUserStats(userIdentifier, time, moves);
```

### **Data Flow:**
1. User completes puzzle
2. `updateUserStats()` called with game results
3. Database calculates new averages and best times
4. UI refreshes with updated statistics

---

## 7. **Tutorial System**

### **First-Time User Detection:**
```typescript
useEffect(() => {
  const hasSeenInstructions = localStorage.getItem('number-crunch-seen-instructions');
  if (!hasSeenInstructions && userIdentifier) {
    setShowHowToPlay(true);
    localStorage.setItem('number-crunch-seen-instructions', 'true');
  }
}, [userIdentifier]);
```

### **Tutorial Flow:**
1. **New User Visit**: No localStorage flag → Popup shows automatically
2. **Flag Setting**: Immediately marks as seen to prevent re-display
3. **Manual Access**: "How to Play" button available for all users
4. **Persistence**: localStorage remembers preference across sessions

### **User Experience Benefits:**
- **Non-intrusive**: Only shows once automatically
- **Always accessible**: Manual button always available
- **Device-specific**: Each device/browser tracks separately
- **Immediate feedback**: Clear instructions with examples

---

## 8. **State Management**

### **Game State (`useGame` hook):**
- **Numbers Array**: Available numbers for operations
- **Target**: Goal number to reach
- **Moves & Time**: Performance tracking
- **Selected Numbers**: Currently selected numbers for operations
- **Solution Path**: History of all operations performed
- **Game Status**: Playing, complete, etc.

### **User State:**
- **Farcaster Context**: User info if in Farcaster environment
- **User Statistics**: Persistent stats from database
- **Tutorial State**: Local storage for tutorial display preferences
- **Guest Identification**: Stable ID for non-Farcaster users

### **State Flow:**
```
User Action → Hook Updates → Component Re-render → Database Sync (if needed)
```

---

## 9. **Environment Configuration**

### **Required Environment Variables:**
- **`VITE_APP_ENABLED`** - Controls maintenance mode (default: true)
- **`VITE_SUPABASE_URL`** - Database connection URL
- **`VITE_SUPABASE_ANON_KEY`** - Database authentication key

### **Configuration Validation:**
The app validates environment variables and gracefully degrades:
- Invalid Supabase config → Local storage only
- App disabled → Maintenance mode
- Missing variables → Console warnings but app still functions

---

## 10. **Responsive Flow**

### **Context-Aware Behavior:**

#### **In Farcaster Environment:**
- Shows Farcaster user profile and info
- Uses miniapp SDK for sharing (`sdk.actions.openUrl()`)
- Enhanced social features

#### **Standalone Web Application:**
- Uses guest mode with local storage
- Falls back to Web Share API or clipboard
- Full functionality without Farcaster

#### **No Database Connection:**
- Game still fully functional
- Stats stored locally
- Tutorial system works independently
- No persistent cross-device sync

---

## 11. **Error Handling**

### **Graceful Degradation:**
- **SDK Initialization Fails**: App loads normally without Farcaster features
- **Database Unavailable**: Local storage fallback for stats
- **Share Failures**: Multiple fallback methods (Web Share API → Clipboard → Manual copy)

### **Error Boundaries:**
- Try-catch blocks around all async operations
- Console logging for debugging
- User-friendly error messages

---

## 🔧 Development Notes

### **Key Files for Debugging:**
- **App initialization issues**: `src/hooks/useFarcasterSDK.ts`
- **Game logic problems**: `src/utils/gameLogic.ts`
- **Tutorial display issues**: `src/components/HowToPlay.tsx`
- **Database issues**: `src/lib/supabase.ts`
- **State management**: `src/hooks/useGame.ts`

### **Common Development Scenarios:**
1. **Adding new game features**: Modify `useGame.ts` and `gameLogic.ts`
2. **Database schema changes**: Create new migration in `supabase/migrations/`
3. **Tutorial content updates**: Edit `HowToPlay.tsx` component
3. **UI updates**: Components are modular and can be updated independently
4. **Farcaster integration**: All SDK logic is contained in `useFarcasterSDK.ts`

### **Performance Considerations:**
- Game state updates are optimized to prevent unnecessary re-renders
- Database operations are batched and cached
- Tutorial popup uses conditional rendering for optimal performance
- Farcaster SDK initialization is non-blocking

---

## 🚀 Architecture Benefits

This architecture provides:
- **Modularity**: Each component has a single responsibility
- **Scalability**: Easy to add new features without breaking existing functionality
- **User-Friendly**: Smart onboarding that doesn't overwhelm returning users
- **Reliability**: Graceful degradation when services are unavailable
- **Maintainability**: Clear separation of concerns and well-documented code
- **Cross-Platform**: Works seamlessly in Farcaster and standalone environments

---

*This documentation is maintained alongside the codebase. For the most up-to-date information, refer to the actual source code and inline comments.*