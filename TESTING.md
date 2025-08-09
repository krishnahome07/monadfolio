# 🧪 Testing Monad Chain Switching

## Prerequisites

1. **MetaMask or Compatible Wallet** installed
2. **Farcaster Account** (for full wallet testing)
3. **Local Development Server** running

## Testing Scenarios

### 🔗 **Scenario 1: Farcaster Environment Testing**

#### Setup:
1. Open the app in Farcaster (as a miniapp)
2. Ensure you have MetaMask connected to Farcaster

#### Test Steps:
```bash
# 1. Start development server
npm run dev

# 2. Open in Farcaster miniapp environment
# (This requires the app to be deployed and configured in Farcaster)
```

#### Expected Behavior:
- ✅ Shows "Connected via Farcaster" indicator
- ✅ Displays "Connect Wallet" button
- ✅ After connecting, shows current network status
- ✅ If not on Monad testnet, shows "Switch to Monad Testnet" button

### 🌐 **Scenario 2: Browser Testing (Non-Farcaster)**

#### Setup:
1. Open app directly in browser at `http://localhost:5173`

#### Test Steps:
```bash
# 1. Open browser console to see debug logs
# 2. Enter a test address: 0x742d35Cc6634C0532925a3b8D4C9db96590c4C87
# 3. Check console for network connection attempts
```

#### Expected Behavior:
- ✅ Shows `isInFarcaster: false` in console
- ✅ No wallet connection options
- ✅ Only address input field
- ✅ Direct portfolio display after entering address

### 📱 **Scenario 3: Manual Wallet Testing**

If you want to test wallet functionality outside Farcaster:

#### Temporary Code Modification:
```typescript
// In src/App.tsx, temporarily force Farcaster mode for testing
const { context, isReady, isInFarcaster } = useFarcasterSDK();
// Add this line for testing:
const forceTestMode = true; // Set to true for testing
const isInFarcaster = forceTestMode || isInFarcaster;
```

#### Test Steps:
1. Add the temporary code above
2. Restart dev server
3. Open in browser
4. Should now show wallet connection options

## 🔧 **Manual Chain Addition to MetaMask**

Since Monad testnet RPC is currently unavailable, you can test with a working testnet:

### Add Custom Network to MetaMask:
```json
{
  "Network Name": "Monad Testnet",
  "RPC URL": "https://testnet1.monad.xyz",
  "Chain ID": "10143",
  "Currency Symbol": "MON",
  "Block Explorer": "https://testnet.monadexplorer.com"
}
```

## 🐛 **Debugging Chain Switching**

### Console Commands:
```javascript
// Check current chain
console.log('Current chain:', window.ethereum.chainId);

// Check if MetaMask is available
console.log('MetaMask available:', !!window.ethereum);

// Listen for chain changes
window.ethereum.on('chainChanged', (chainId) => {
  console.log('Chain changed to:', chainId);
});
```

### Debug Logs to Watch:
```
🔌 Auto-connecting to Farcaster wallet...
🔄 Switching to Monad testnet...
✅ Connected to Monad testnet
⚠️ Wrong network detected
```

## 🚨 **Known Issues & Workarounds**

### Issue 1: Monad RPC Not Available
```
Error: POST https://testnet1.monad.xyz/ net::ERR_NAME_NOT_RESOLVED
```

**Workaround**: The app falls back to Ethereum mainnet for demonstration

### Issue 2: Farcaster SDK Not Loading
```
⏰ SDK initialization timeout - proceeding as web app
```

**Expected**: This is normal when testing outside Farcaster

### Issue 3: Chain Switching Fails
```
Error: User rejected the request
```

**Solution**: User needs to approve the network addition in their wallet

## 📊 **Test Cases Checklist**

### ✅ **Farcaster Environment**
- [ ] SDK initializes correctly
- [ ] User context is available
- [ ] Wallet connection works
- [ ] Chain switching prompts appear
- [ ] Network status updates correctly

### ✅ **Browser Environment**
- [ ] Falls back to web app mode
- [ ] Address input works
- [ ] Portfolio loads with real data
- [ ] No wallet connection UI shown

### ✅ **Chain Switching**
- [ ] Detects wrong network
- [ ] Shows switch button
- [ ] Triggers wallet prompt
- [ ] Updates UI after switch

## 🎯 **Success Criteria**

1. **Farcaster users**: Can connect wallet and switch to Monad
2. **Browser users**: Can view portfolios without wallet connection
3. **Error handling**: Graceful fallbacks when services unavailable
4. **Real data**: Shows actual blockchain data, not mock data