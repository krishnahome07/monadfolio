# 🔄 Monadfolio - App Flow Overview

This document provides a comprehensive overview of how the Monadfolio application initializes, loads, and operates. It's designed for developers who need to understand the application architecture and flow.

## 📋 Table of Contents

1. [Initial Load Sequence](#1-initial-load-sequence)
2. [File Loading Order](#2-file-loading-order)
3. [Initialization Flow](#3-initialization-flow-in-monadfolioapp)
4. [Component Rendering Flow](#4-component-rendering-flow)
5. [Key Components Called Initially](#5-key-components-called-initially)
6. [Database Integration](#6-database-integration)
7. [Farcaster Integration](#7-farcaster-integration)
8. [State Management](#8-state-management)
9. [Environment Configuration](#9-environment-configuration)
10. [Responsive Flow](#10-responsive-flow)
11. [Error Handling](#11-error-handling)

---

## 1. **Initial Load Sequence**

```
index.html → src/main.tsx → src/App.tsx → Components
```

The application follows a standard React initialization pattern with Farcaster miniapp integration for portfolio visualization and social features.

---

## 2. **File Loading Order**

### **Entry Point:**
- **`index.html`** - Contains meta tags, CSP headers, and Farcaster miniapp configuration
- **`src/main.tsx`** - React entry point that renders the App component

### **Main Application:**
- **`src/App.tsx`** - Main application component with two wrapper functions:
  - `App()` - Provides React Query context
  - `MonadfolioApp()` - Contains all the portfolio logic and state management

---

## 3. **Initialization Flow in MonadfolioApp()**

### **Hook Initialization:**
```typescript
const { context, isReady, isInFarcaster } = useFarcasterSDK();
const { portfolio, badges, loading, error, settings, updateSettings } = usePortfolio(connectedAddress);
const { news, loading: newsLoading, error: newsError } = useMonadNews();
```

### **Detailed Initialization Steps:**

1. **Farcaster SDK Setup:**
   - `src/hooks/useFarcasterSDK.ts` initializes the Farcaster miniapp SDK
   - Calls `sdk.actions.ready()` to hide the splash screen
   - Determines if running inside Farcaster or as standalone web app

2. **Wallet Connection:**
   - Auto-connects wallet if user has Farcaster context
   - Falls back to manual wallet connection or demo mode
   - Creates stable user identifier for portfolio tracking

3. **Portfolio Initialization:**
   - `src/hooks/usePortfolio.ts` loads portfolio data when wallet is connected
   - Fetches assets, NFTs, and calculates badge eligibility
   - Loads user settings from localStorage

4. **News Feed Setup:**
   - `src/hooks/useMonadNews.ts` fetches latest Monad ecosystem news
   - Categorizes news into official, ecosystem, and general news
   - Sets up auto-refresh every 30 minutes

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

### **Main Application Interface:**
```typescript
{!connectedAddress ? (
  <WalletConnect />
) : (
  <>
    <NavigationTabs />
    {activeTab === 'portfolio' && <PortfolioSnapshot />}
    {activeTab === 'badges' && <BadgeCollection />}
    {activeTab === 'news' && <MonadNews />}
  </>
)}
```

---

## 5. **Key Components Called Initially**

### **1. `src/components/WalletConnect.tsx`**
- **Purpose**: Handles wallet connection and user onboarding
- **Features**: Auto-connect, manual address entry, demo mode
- **Behavior**: Shows different UI based on Farcaster vs standalone usage

### **2. `src/components/Portfolio.tsx`**
- **Purpose**: Main portfolio visualization with colored blocks
- **Functionality**: Asset visualization, privacy controls, sharing
- **State**: Manages portfolio settings and asset visibility

### **3. `src/components/BadgeCollection.tsx`**
- **Purpose**: Achievement system displaying earned and available badges
- **Features**: Category filtering, progress tracking, social sharing
- **Data**: Calculates badge eligibility based on portfolio and activity

### **4. `src/components/MonadNews.tsx`**
- **Purpose**: Curated news feed from Monad ecosystem
- **Features**: Category filtering, external link handling, refresh functionality
- **Behavior**: Auto-refreshes and categorizes news content

### **5. `src/utils/monadApi.ts`**
- **Purpose**: Core API integration and data fetching
- **Key Functions**:
  - `fetchPortfolio()` - Retrieves wallet portfolio data
  - `fetchUserBadges()` - Calculates achievement badges
  - `fetchMonadNews()` - Gets latest ecosystem news
  - `connectWallet()` - Handles wallet connectivity

---

## 6. **Database Integration**

### **Supabase Configuration:**
- **File**: `src/lib/supabase.ts`
- **Schema**: User statistics and portfolio tracking
- **Operations**: Currently used for user stats, expandable for portfolio caching

### **Database Operations:**
```typescript
// Get user statistics (if needed for future features)
const stats = await getUserStats(userIdentifier);

// Update user activity (for badge calculations)
const result = await updateUserStats(userIdentifier, activity);
```

### **Data Flow:**
1. User connects wallet
2. Portfolio data fetched from blockchain
3. Badge eligibility calculated
4. Settings stored in localStorage
5. Optional database sync for cross-device features

---

## 7. **Farcaster Integration**

### **Miniapp Features:**
- **Native Sharing**: Direct integration with Farcaster composer
- **User Context**: Access to Farcaster user profile and social graph
- **Frame Compatibility**: Backward compatibility with Farcaster frames

### **Social Features:**
```typescript
// Portfolio sharing
const shareText = `🚀 My Monadfolio Portfolio\n\n💼 ${assets.length} assets • $${totalValue}\n🏆 ${badges.length} badges earned`;

// Badge sharing
const badgeText = earnedBadges.map(badge => `${badge.icon} ${badge.name}`).join('\n');
```

---

## 8. **State Management**

### **Portfolio State (`usePortfolio` hook):**
- **Assets Array**: Token balances and values
- **NFT Collection**: Digital collectibles
- **Badge System**: Achievement tracking
- **Settings**: Privacy and display preferences
- **Loading States**: UI feedback during data fetching

### **Application State:**
- **Wallet Connection**: Connected address and user context
- **Active Tab**: Current view (portfolio, badges, news)
- **Farcaster Context**: User info and social features
- **News Feed**: Latest ecosystem updates

### **State Flow:**
```
User Action → Hook Updates → Component Re-render → Blockchain/API Sync
```

---

## 9. **Environment Configuration**

### **Required Environment Variables:**
- **`VITE_APP_ENABLED`** - Controls maintenance mode (default: true)
- **`VITE_SUPABASE_URL`** - Database connection URL (optional)
- **`VITE_SUPABASE_ANON_KEY`** - Database authentication key (optional)

### **Configuration Validation:**
The app validates environment variables and gracefully degrades:
- Invalid Supabase config → Local storage only
- App disabled → Maintenance mode
- Missing variables → Console warnings but app still functions

---

## 10. **Responsive Flow**

### **Context-Aware Behavior:**

#### **In Farcaster Environment:**
- Shows Farcaster user profile and social features
- Uses miniapp SDK for native sharing
- Enhanced social engagement features

#### **Standalone Web Application:**
- Uses manual wallet connection
- Falls back to Web Share API or clipboard
- Full functionality without Farcaster

#### **Demo Mode:**
- Portfolio visualization with mock data
- All features accessible for exploration
- No persistent data storage

---

## 11. **Error Handling**

### **Graceful Degradation:**
- **SDK Initialization Fails**: App loads normally without Farcaster features
- **Wallet Connection Issues**: Demo mode with sample portfolio
- **API Failures**: Cached data and retry mechanisms
- **Share Failures**: Multiple fallback methods

### **Error Boundaries:**
- Try-catch blocks around all async operations
- Console logging for debugging
- User-friendly error messages
- Automatic retry for transient failures

---

## 🔧 Development Notes

### **Key Files for Debugging:**
- **App initialization issues**: `src/hooks/useFarcasterSDK.ts`
- **Portfolio loading problems**: `src/utils/monadApi.ts`
- **Wallet connection issues**: `src/components/WalletConnect.tsx`
- **Database issues**: `src/lib/supabase.ts`
- **State management**: `src/hooks/usePortfolio.ts`

### **Common Development Scenarios:**
1. **Adding new portfolio features**: Modify `usePortfolio.ts` and `monadApi.ts`
2. **Database schema changes**: Create new migration in `supabase/migrations/`
3. **New badge types**: Update badge calculation logic in `fetchUserBadges()`
4. **UI updates**: Components are modular and can be updated independently
5. **Farcaster integration**: All SDK logic is contained in `useFarcasterSDK.ts`

### **Performance Considerations:**
- Portfolio data is cached and refreshed on demand
- News feed auto-refreshes every 30 minutes
- Settings are stored locally for instant loading
- Farcaster SDK initialization is non-blocking

---

## 🚀 Architecture Benefits

This architecture provides:
- **Modularity**: Each component has a single responsibility
- **Scalability**: Easy to add new portfolio features and badge types
- **User-Friendly**: Seamless onboarding for both Farcaster and web users
- **Reliability**: Graceful degradation when services are unavailable
- **Maintainability**: Clear separation of concerns and well-documented code
- **Cross-Platform**: Works seamlessly in Farcaster and standalone environments
- **Social Integration**: Native sharing and community features

---

*This documentation is maintained alongside the codebase. For the most up-to-date information, refer to the actual source code and inline comments.*