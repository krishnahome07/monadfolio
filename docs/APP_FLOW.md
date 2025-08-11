# 🔄 Monadfolio - App Flow Overview

This document provides a comprehensive overview of how the Monadfolio application initializes, loads, and operates. It's designed for developers who need to understand the application architecture and flow.

## 📋 Table of Contents

1. [Initial Load Sequence](#1-initial-load-sequence)
2. [File Loading Order](#2-file-loading-order)
3. [Initialization Flow](#3-initialization-flow-in-monadfolioapp)
4. [Component Rendering Flow](#4-component-rendering-flow)
5. [Key Components Called Initially](#5-key-components-called-initially)
6. [State Management](#6-state-management)
7. [Farcaster Integration](#7-farcaster-integration)
8. [Database Integration](#8-database-integration)
9. [Environment Configuration](#9-environment-configuration)
10. [Responsive Flow](#10-responsive-flow)
11. [Error Handling](#11-error-handling)
12. [Data Flow Architecture](#12-data-flow-architecture)

---

## 1. **Initial Load Sequence**

```
index.html → src/main.tsx → src/App.tsx → MonadfolioApp()
```

The application follows a standard React initialization pattern with Farcaster miniapp integration for portfolio visualization and social features.

### **Entry Point Details:**
1. **`index.html`** loads with Farcaster miniapp metadata and CSP headers
2. **`src/main.tsx`** creates React root and renders App component with error boundaries
3. **`src/App.tsx`** provides React Query context and renders MonadfolioApp
4. **`MonadfolioApp()`** contains all application logic and state management

---

## 2. **File Loading Order**

### **Critical Path:**
- **`index.html`** - Contains meta tags, CSP headers, and Farcaster miniapp configuration
- **`src/main.tsx`** - React entry point with error handling
- **`src/App.tsx`** - Main application wrapper with QueryClientProvider

### **Hook Dependencies:**
- **`src/hooks/useFarcasterSDK.ts`** - Farcaster SDK initialization (loads first)
- **`src/hooks/usePortfolio.ts`** - Portfolio data management (depends on address)
- **`src/hooks/useMonadNews.ts`** - News feed management (independent)

### **Component Dependencies:**
- **`src/components/WalletConnect.tsx`** - Wallet connection interface
- **`src/components/PortfolioSnapshot.tsx`** - Main portfolio visualization
- **`src/components/BadgeCollection.tsx`** - Achievement system
- **`src/components/MonadNews.tsx`** - News feed display

---

## 3. **Initialization Flow in MonadfolioApp()**

### **Hook Initialization Order:**
```typescript
// 1. Farcaster SDK (always first)
const { context, isReady, isInFarcaster } = useFarcasterSDK();

// 2. State management
const [activeTab, setActiveTab] = useState<'portfolio' | 'badges' | 'news'>('portfolio');
const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

// 3. Auto-connection effect (depends on Farcaster context)
useEffect(() => {
  // Auto-connect logic for Farcaster users
}, [isReady, isInFarcaster, context?.user, connectedAddress]);

// 4. Portfolio data (depends on connected address)
const { portfolio, badges, loading, error, settings, updateSettings } = usePortfolio(connectedAddress, context?.user);

// 5. News data (independent)
const { news, loading: newsLoading, error: newsError, refreshNews } = useMonadNews();
```

### **Detailed Initialization Steps:**

#### **Step 1: Farcaster SDK Setup**
- `useFarcasterSDK.ts` initializes with 3-second timeout
- Attempts to get Farcaster context
- Calls `sdk.actions.ready()` to hide splash screen if successful
- Sets `isInFarcaster` flag based on context availability

#### **Step 2: Auto-Connection Logic**
```typescript
useEffect(() => {
  if (isReady && isInFarcaster && context?.user && !connectedAddress) {
    // Priority 1: Verified addresses
    if (context.user.verifications && context.user.verifications.length > 0) {
      setConnectedAddress(context.user.verifications[0]);
    }
    // Priority 2: Custody address
    else if (context.user.custodyAddress) {
      setConnectedAddress(context.user.custodyAddress);
    }
  }
}, [isReady, isInFarcaster, context?.user, connectedAddress]);
```

#### **Step 3: Portfolio Data Loading**
- `usePortfolio.ts` triggers when `connectedAddress` changes
- Loads portfolio data via `fetchPortfolio()`
- Calculates badges via `fetchUserBadges()`
- Manages settings from localStorage

#### **Step 4: News Feed Setup**
- `useMonadNews.ts` loads independently
- Sets up auto-refresh every 30 minutes
- Categorizes news into official, ecosystem, and general

---

## 4. **Component Rendering Flow**

### **Loading State Hierarchy:**
```typescript
// 1. SDK Loading
if (!isReady) {
  return <LoadingScreen />; // Purple gradient with spinner
}

// 2. Maintenance Mode Check
if (!isAppEnabled) {
  return <MaintenanceMode />; // Maintenance screen
}

// 3. Main Application Flow
return (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    {/* Header with Farcaster status */}
    {/* Wallet connection or main interface */}
  </div>
);
```

### **Main Interface Structure:**
```typescript
{!connectedAddress ? (
  <WalletConnect 
    onConnect={handleConnect}
    isInFarcaster={isInFarcaster}
    farcasterUser={context?.user}
  />
) : (
  <>
    {/* Navigation Tabs */}
    <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    
    {/* Tab Content */}
    {activeTab === 'portfolio' && <PortfolioSnapshot {...portfolioProps} />}
    {activeTab === 'badges' && <BadgeCollection badges={badges} />}
    {activeTab === 'news' && <MonadNews {...newsProps} />}
    
    {/* Connected Address Info */}
    <ConnectedAddressDisplay />
  </>
)}
```

---

## 5. **Key Components Called Initially**

### **1. `src/components/WalletConnect.tsx`**
**Purpose**: Handles wallet connection and user onboarding
**Props**:
- `onConnect: (address: string) => void`
- `isInFarcaster: boolean`
- `farcasterUser?: Context.User`

**Behavior**:
- Shows Farcaster user info if available
- Provides manual address input
- Includes demo address functionality
- Validates Monad addresses using `validateMonadAddress()`

### **2. `src/components/PortfolioSnapshot.tsx`**
**Purpose**: Main portfolio visualization with colored blocks
**Props**:
- `portfolio: Portfolio`
- `settings: PortfolioSettings`
- `onSettingsChange: (settings: Partial<PortfolioSettings>) => void`
- `onToggleAsset: (symbol: string) => void`
- `onRefresh: () => void`
- `loading?: boolean`
- `userAddress?: string`

**Features**:
- 5 color palette options
- Asset visibility controls
- Social sharing integration
- Settings panel with real-time updates

### **3. `src/components/BadgeCollection.tsx`**
**Purpose**: Achievement system displaying earned and available badges
**Props**:
- `badges: Badge[]`
- `onShareBadges?: () => void`

**Features**:
- Category filtering (all, nft, portfolio, usage)
- Progress tracking with visual progress bar
- Rarity-based styling (common, rare, legendary)
- Earned vs unearned badge distinction

### **4. `src/components/MonadNews.tsx`**
**Purpose**: Curated news feed from Monad ecosystem
**Props**:
- `news: NewsItem[]`
- `loading?: boolean`
- `onRefresh?: () => void`

**Features**:
- Category filtering (all, official, ecosystem, news)
- Time-based formatting ("2h ago", "3d ago")
- External link handling
- Auto-refresh functionality

---

## 6. **State Management**

### **Global State (App Level):**
```typescript
// Navigation state
const [activeTab, setActiveTab] = useState<'portfolio' | 'badges' | 'news'>('portfolio');

// Connection state
const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

// Environment state
const isAppEnabled = import.meta.env.VITE_APP_ENABLED !== 'false';
```

### **Portfolio State (`usePortfolio` hook):**
```typescript
const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
const [badges, setBadges] = useState<Badge[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [settings, setSettings] = useState<PortfolioSettings>({
  colorPalette: 'purple',
  hiddenAssets: [],
  showTotalValue: true,
  showBadges: true
});
```

### **News State (`useMonadNews` hook):**
```typescript
const [news, setNews] = useState<NewsItem[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### **Farcaster State (`useFarcasterSDK` hook):**
```typescript
const [context, setContext] = useState<any>();
const [isReady, setIsReady] = useState(false);
const [isInFarcaster, setIsInFarcaster] = useState(false);
```

### **State Persistence:**
- **Settings**: Stored in localStorage as `monadfolio-settings`
- **Portfolio Data**: Fetched fresh on each load
- **News Data**: Cached with 30-minute refresh interval

---

## 7. **Farcaster Integration**

### **SDK Initialization Process:**
```typescript
const initializeSDK = async () => {
  // 1. Set 3-second timeout to prevent infinite loading
  const timeout = setTimeout(() => {
    setIsInFarcaster(false);
    setIsReady(true);
  }, 3000);
  
  // 2. Check if SDK is available
  if (!sdk) {
    clearTimeout(timeout);
    setIsInFarcaster(false);
    setIsReady(true);
    return;
  }

  // 3. Attempt to get context
  try {
    const frameContext = await sdk.context;
    if (frameContext && (frameContext.user || frameContext.client)) {
      setContext(frameContext);
      setIsInFarcaster(true);
      await sdk.actions.ready(); // Hide splash screen
    }
  } catch (error) {
    // Fallback to web app mode
  }
  
  clearTimeout(timeout);
  setIsReady(true);
};
```

### **Context-Aware Features:**
- **Auto-connection**: Automatically connects verified wallet addresses
- **User Display**: Shows Farcaster profile information
- **Social Sharing**: Native Farcaster composer integration
- **Graceful Degradation**: Full functionality without Farcaster

### **Social Sharing Implementation:**
```typescript
const handleSharePortfolio = async () => {
  const shareText = `🚀 My Monadfolio Portfolio\n\n💼 ${visibleAssets.length} tokens • ${settings.showTotalValue ? `$${totalVisibleValue.toLocaleString()}` : 'Portfolio value hidden'}\n🏆 ${portfolio.userStats?.totalTransactions || 0} Monad transactions`;
  
  if (isInFarcaster && sdk) {
    await sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`);
  } else {
    // Fallback to Web Share API or clipboard
  }
};
```

---

## 8. **Database Integration**

### **Supabase Configuration:**
- **File**: `src/lib/supabase.ts`
- **Status**: Configured but not actively used
- **Purpose**: Future user statistics and cross-device sync

### **Database Schema:**
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  total_puzzles_solved integer DEFAULT 0,
  best_time integer DEFAULT 0,
  average_moves integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **Current Usage:**
- Database functions are implemented but not called
- All data is currently managed in-memory and localStorage
- Ready for future integration when user accounts are needed

---

## 9. **Environment Configuration**

### **Environment Variables:**
```env
# App Control
VITE_APP_ENABLED=true  # Controls maintenance mode

# Database (Optional)
VITE_SUPABASE_URL=     # Supabase project URL
VITE_SUPABASE_ANON_KEY= # Supabase anonymous key
```

### **Configuration Validation:**
```typescript
// App enabled check
const appEnabledEnv = import.meta.env.VITE_APP_ENABLED;
const isAppEnabled = appEnabledEnv !== 'false';

// Supabase validation
const hasValidConfig = supabaseUrl && supabaseKey && 
                      supabaseUrl !== 'undefined' && supabaseKey !== 'undefined' &&
                      isValidUrl(supabaseUrl) && isValidKey(supabaseKey);
```

### **Graceful Degradation:**
- Invalid Supabase config → Local storage only
- App disabled → Maintenance mode
- Missing variables → Console warnings but app continues

---

## 10. **Responsive Flow**

### **Context-Aware Behavior:**

#### **In Farcaster Environment:**
```typescript
if (isInFarcaster && context?.user) {
  // Show Farcaster user profile
  // Use miniapp SDK for native sharing
  // Display connection status indicator
  // Auto-connect verified addresses
}
```

#### **Standalone Web Application:**
```typescript
if (!isInFarcaster) {
  // Show manual wallet connection
  // Use Web Share API or clipboard fallback
  // Full functionality without social features
}
```

#### **Demo Mode:**
```typescript
const handleDemoAddress = () => {
  const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c4C87';
  setManualAddress(demoAddress);
  onConnect(demoAddress);
};
```

---

## 11. **Error Handling**

### **Application-Level Error Boundaries:**
```typescript
// Main App wrapper with try-catch
function MonadfolioApp() {
  try {
    // Main application logic
  } catch (error) {
    return <ErrorFallback error={error} />;
  }
}
```

### **Hook-Level Error Handling:**
```typescript
// Portfolio loading errors
const loadPortfolio = async () => {
  try {
    const portfolioData = await fetchPortfolio(address, farcasterUser);
    setPortfolio(portfolioData);
  } catch (err) {
    setError('Failed to load portfolio data');
  } finally {
    setLoading(false);
  }
};
```

### **Graceful Degradation Strategies:**
- **SDK Initialization Fails**: App loads as standalone web app
- **Wallet Connection Issues**: Demo mode with sample data
- **API Failures**: Show error messages with retry buttons
- **Share Failures**: Multiple fallback methods (SDK → Web Share → Clipboard)

### **User-Friendly Error Messages:**
- Loading states with spinners and descriptive text
- Error states with actionable retry buttons
- Success messages for completed actions
- Timeout handling for long-running operations

---

## 12. **Data Flow Architecture**

### **Data Sources:**
```typescript
// Current Implementation (Mock Data)
src/utils/monadApi.ts:
- fetchPortfolio() → Returns empty portfolio
- fetchUserBadges() → Returns badge definitions (only Farcaster badge earned)
- fetchMonadNews() → Returns empty news array
- validateMonadAddress() → Validates Ethereum address format
```

### **Data Flow Diagram:**
```
User Action → Hook Updates → Component Re-render → API Call (Mock) → State Update
     ↓
Local Storage ← Settings Persistence
     ↓
UI Update → Social Sharing (if applicable)
```

### **Badge Calculation Logic:**
```typescript
// Only Farcaster connection badge is currently achievable
const badges = [
  {
    id: 'monad-social',
    name: 'Monad Social',
    description: 'Connected wallet via Farcaster',
    earned: !!farcasterUser, // Only this badge can be earned
    rarity: 'rare'
  },
  // ... other badges (all earned: false)
];
```

---

## 🔧 Development Notes

### **Key Files for Debugging:**
- **App initialization**: `src/hooks/useFarcasterSDK.ts`
- **Portfolio loading**: `src/utils/monadApi.ts` (currently mock data)
- **Wallet connection**: `src/components/WalletConnect.tsx`
- **State management**: `src/hooks/usePortfolio.ts`
- **Settings persistence**: localStorage operations in `usePortfolio.ts`

### **Common Development Scenarios:**

#### **Adding New Portfolio Features:**
1. Update types in `src/types/portfolio.ts`
2. Modify `fetchPortfolio()` in `src/utils/monadApi.ts`
3. Update `usePortfolio.ts` hook
4. Modify `PortfolioSnapshot.tsx` component

#### **Adding New Badge Types:**
1. Update badge definitions in `fetchUserBadges()`
2. Add calculation logic based on portfolio data
3. Update badge icons and descriptions
4. Test badge earning conditions

#### **Database Integration:**
1. Uncomment database calls in hooks
2. Update environment variables
3. Test with real Supabase instance
4. Add error handling for database operations

#### **Live Data Integration:**
1. Replace mock functions in `monadApi.ts`
2. Add real Monad RPC endpoints
3. Implement caching strategies
4. Add loading states for real API calls

### **Performance Considerations:**
- Portfolio data is fetched only when address changes
- News feed auto-refreshes every 30 minutes
- Settings are persisted to localStorage immediately
- Farcaster SDK initialization has 3-second timeout
- Components use React.memo where appropriate

### **Testing Strategies:**
- Test both Farcaster and standalone modes
- Verify graceful degradation when services fail
- Test all badge earning conditions
- Validate address input handling
- Test social sharing across different platforms

---

## 🚀 Architecture Benefits

This architecture provides:

### **Modularity**
- Each component has a single, well-defined responsibility
- Hooks encapsulate related state and logic
- Clear separation between UI and business logic

### **Scalability**
- Easy to add new portfolio features and badge types
- Modular news system ready for multiple sources
- Database integration ready for user accounts

### **User Experience**
- Seamless onboarding for both Farcaster and web users
- Graceful degradation when services are unavailable
- Persistent settings across sessions
- Fast loading with proper loading states

### **Developer Experience**
- Comprehensive TypeScript types
- Clear error handling and logging
- Well-documented code with inline comments
- Easy-to-understand file structure

### **Cross-Platform Compatibility**
- Works seamlessly in Farcaster and standalone
- Responsive design for all screen sizes
- Progressive enhancement approach
- Fallback strategies for all features

---

*This documentation is maintained alongside the codebase. For the most up-to-date information, refer to the actual source code and inline comments.*