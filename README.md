# 💼 Monadfolio - Your Monad Portfolio & Identity

A beautiful, production-ready Farcaster mini-app that transforms your Monad wallet into a social, shareable on-chain identity. Visualize your portfolio with stunning block charts, earn achievement badges based on your on-chain activity, and stay updated with the latest Monad ecosystem news.

## 🎯 App Overview

Monadfolio is a comprehensive Farcaster mini-app designed to showcase your Monad on-chain identity. It combines beautiful portfolio visualization, gamified achievement system, and curated ecosystem news into one seamless social experience.

**Current Status**: The app is fully functional with seamless Farcaster wallet integration using the official Wagmi connector. Portfolio data and news feeds are ready for live blockchain integration.

## ✨ Core Features

### 🔗 Farcaster Wallet Integration
- **Seamless Connection**: One-click wallet connection using official Farcaster miniapp connector
- **Auto-Connection**: Automatically connects to your Farcaster wallet when available
- **Multi-Chain Support**: Ready for Base, Ethereum Mainnet, and Monad Testnet
- **Portfolio Viewing**: View any Monad address portfolio with manual entry option

### 📊 Portfolio Visualization
- **Visual Portfolio**: Stunning colored block visualization where each block's size represents your asset allocation
- **Multiple Color Palettes**: Choose from 5 beautiful pre-defined color schemes (Purple Haze, Ocean Blue, Forest Green, Sunset Orange, Rose Pink)
- **Privacy Controls**: Hide specific assets and toggle total portfolio value display
- **Asset Management**: Show/hide individual tokens from your portfolio view
- **Responsive Design**: Beautiful visualization that works on all screen sizes
- **Social Sharing**: Share your portfolio directly to Farcaster with one click

### 🏆 Achievement Badges System

#### Available Badge Categories
- **🏆 Portfolio Badges**: Based on token holdings and portfolio value
  - Monad Holder: Hold MON tokens in wallet
  - Monad Collector: Hold multiple Monad ecosystem tokens
  - Monad Whale: Portfolio value exceeding significant thresholds
  - Monad Pioneer: Early adopter recognition

- **⚡ Usage Badges**: Based on on-chain activity
  - Monad Active: Complete 10+ transactions on Monad
  - Monad DeFi User: Active in Monad DeFi ecosystem
  - Monad Social: Connected wallet via Farcaster (currently achievable)

#### Badge Features
- **Rarity System**: Common, Rare, and Legendary badges with distinct visual styling
- **Progress Tracking**: Visual progress bar showing badge completion percentage
- **Category Filtering**: Filter badges by NFT, Portfolio, or Usage categories
- **Social Sharing**: Share earned achievements to your Farcaster network

### 📰 Monad News Hub
- **Organized Categories**: Official updates, ecosystem news, and industry coverage
- **Smart Filtering**: Filter news by category (Official, Ecosystem, General)
- **Real-time Updates**: Auto-refresh functionality (framework ready)
- **External Links**: Direct access to full articles and announcements
- **Clean Interface**: Easy-to-read news feed with publication timestamps

### 🎮 Social Features
- **🔗 Farcaster Integration**: Native miniapp experience within Farcaster
- **📱 Standalone Web App**: Full functionality outside of Farcaster
- **🤝 Wallet Connection**: Seamless Wagmi-based wallet integration
- **💬 Social Sharing**: Native Farcaster composer integration for sharing portfolios and badges
- **👤 User Profiles**: Display Farcaster user information when connected
- **🎯 Simplified UX**: Clean, focused interface without unnecessary controls

## 🚀 Live Demo

**🌐 Live App**: [https://monadfolio.vercel.app](https://monadfolio.vercel.app)
**📱 Farcaster Frame**: Available in Farcaster as a native mini-app

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with comprehensive type definitions
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons

### Wallet Integration
- **Wagmi** - React hooks for Ethereum wallet integration
- **@farcaster/miniapp-wagmi-connector** - Official Farcaster wallet connector
- **Viem** - TypeScript interface for Ethereum

### State Management
- **React Query (@tanstack/react-query)** - Efficient data fetching and caching
- **Custom Hooks** - Modular state management with `usePortfolio`, `useFarcasterSDK`, `useMonadNews`, `useWalletConnection`
- **Local Storage** - Persistent user settings and preferences

### Farcaster Integration
- **@farcaster/miniapp-sdk** - Native Farcaster miniapp support
- **Frame Compatibility** - Backward compatibility with Farcaster frames
- **Social Sharing** - Native Farcaster composer integration

### Backend & Database (Optional)
- **Supabase** - PostgreSQL database with real-time features (configured but not actively used)
- **Row Level Security (RLS)** - Secure data access patterns
- **Migration System** - Database schema versioning

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **PostCSS** - CSS processing with Autoprefixer
- **Vercel** - Deployment and hosting platform

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── WalletConnect.tsx       # Wallet connection interface with Farcaster integration
│   ├── PortfolioSnapshot.tsx   # Main portfolio visualization
│   ├── BadgeCollection.tsx     # Achievement badges display
│   ├── MonadNews.tsx           # News feed component
│   └── MaintenanceMode.tsx     # Maintenance screen
├── hooks/                   # Custom React hooks
│   ├── useFarcasterSDK.ts      # Farcaster SDK initialization and context
│   ├── useWalletConnection.ts  # Wagmi wallet connection management
│   ├── usePortfolio.ts         # Portfolio data management
│   └── useMonadNews.ts         # News data management
├── lib/                     # External service integrations
│   ├── wagmi.ts                # Wagmi configuration with Farcaster connector
│   └── supabase.ts             # Database client configuration
├── utils/                   # Utility functions
│   └── monadApi.ts             # Blockchain API integration (mock data)
├── types/                   # TypeScript type definitions
│   └── portfolio.ts            # Portfolio, badge, and news types
└── App.tsx                  # Main application component with providers
```

## 🎮 How to Use

### For Users
1. **🔗 Connect**: 
   - **In Farcaster**: Automatic wallet detection and connection
   - **Web App**: Manual wallet address entry or use demo mode
2. **👀 Visualize**: View your portfolio as stunning colored block charts
3. **🎨 Customize**: Choose from 5 color palettes and manage asset visibility
4. **🏆 Achieve**: Earn badges based on your wallet activity (Farcaster connection badge currently available)
5. **📢 Share**: Cast your portfolio and achievements to your Farcaster network
6. **📰 Stay Informed**: Browse the news section (framework ready for live data)

### For Developers
1. **📥 Clone** the repository
2. **📦 Install** dependencies with `npm install`
3. **⚙️ Configure** environment variables (optional)
4. **🚀 Run** development server with `npm run dev`
5. **🏗️ Build** for production with `npm run build`

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd monadfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup (Optional)**
```bash
cp .env.example .env
```

4. **Configure Environment Variables (Optional)**
```env
# Supabase Configuration (Optional - for future user stats)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
VITE_APP_ENABLED=true
```

5. **Start Development Server**
```bash
npm run dev
```

6. **Open in Browser**
Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🗄️ Database Schema (Optional)

The application includes optional Supabase integration for future user statistics:

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

## 🔐 Security Features

### Application Security
- **Content Security Policy**: Strict CSP headers preventing XSS attacks
- **Input Sanitization**: All user inputs are validated and sanitized
- **Environment Validation**: Proper validation of configuration variables
- **Error Boundaries**: Graceful error handling throughout the application

### Farcaster Integration Security
- **Official SDK**: Uses official Farcaster miniapp SDK and Wagmi connector
- **Context Validation**: Proper validation of Farcaster user context
- **Privacy Respect**: Only accesses necessary user data
- **Timeout Handling**: Prevents infinite loading states

### Wallet Security
- **Non-custodial**: Never stores private keys or sensitive wallet data
- **Address Validation**: Validates Ethereum address format
- **Privacy Controls**: Users control what portfolio data is shared
- **Official Connectors**: Uses official Wagmi and Farcaster connectors

## 🌐 Deployment

### Vercel (Current)
The app is deployed on Vercel with:
- Automatic builds from Git
- Environment variable management
- Custom security headers
- SPA routing support
- Farcaster frame configuration

### Configuration Files
- `vercel.json`: Deployment configuration with security headers
- `public/.well-known/farcaster.json`: Farcaster frame metadata

## 🎯 Current Implementation Status

### ✅ Fully Implemented
- **Farcaster Wallet Integration**: Complete with official Wagmi connector
- **Portfolio Visualization**: Complete with color palettes and asset management
- **Badge System**: Complete badge collection with progress tracking and social sharing
- **Farcaster Integration**: Native miniapp support with social sharing
- **Responsive Design**: Works perfectly on all devices
- **Settings Management**: Persistent user preferences
- **Clean UX**: Streamlined interface focused on core functionality

### 🚧 In Development
- **Live Blockchain Data**: Currently using mock data, ready for Monad integration
- **News Feed**: Framework ready, awaiting news source integration
- **Real-time Updates**: Portfolio refresh functionality implemented

### 🔮 Future Enhancements
- **Historical Data**: Portfolio performance tracking over time
- **Advanced Analytics**: Detailed portfolio insights and recommendations
- **Enhanced Social Features**: Community leaderboards and competitions
- **Mobile App**: Progressive Web App features
- **Advanced Wallet Management**: Multi-wallet support and switching

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write clean, documented code
- Use semantic commit messages
- Update documentation for API changes
- Test both Farcaster and standalone modes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monad Team** - For building an incredible high-performance blockchain
- **Farcaster Team** - For the excellent miniapp SDK and platform
- **Wagmi Team** - For the robust wallet integration library
- **Supabase** - For the robust backend-as-a-service platform
- **Tailwind CSS** - For the beautiful utility-first CSS framework
- **Lucide** - For the comprehensive icon library

## 📞 Support

For support, feature requests, or bug reports:
- Open an issue on GitHub
- Contact via Farcaster
- Join the Monad community discussions

## 🔮 Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Portfolio visualization system
- [x] Badge collection and progress tracking
- [x] Farcaster miniapp integration with seamless wallet connection
- [x] Responsive design implementation
- [x] Social sharing functionality
- [x] Streamlined user interface

### Phase 2: Data Integration 🚧
- [ ] Live Monad blockchain data integration
- [ ] Real-time portfolio updates
- [ ] News feed with live sources
- [ ] Historical portfolio tracking

### Phase 3: Advanced Features 🔮
- [ ] Advanced portfolio analytics
- [ ] Social leaderboards and competitions
- [ ] Enhanced wallet management features
- [ ] Custom badge creation for projects
- [ ] AI-powered portfolio insights
- [ ] Cross-chain portfolio support

### Phase 4: Mobile & Performance 🔮
- [ ] Progressive Web App features
- [ ] Enhanced mobile optimizations
- [ ] Offline functionality
- [ ] Advanced caching strategies

---

**Built with ❤️ for the Monad ecosystem**

*Monadfolio - Transform your wallet into your identity!*

---

## 📚 Additional Documentation

For detailed technical information:
- [App Flow Documentation](./docs/APP_FLOW.md) - Detailed technical architecture and initialization flow
- [Component Documentation](./src/components/) - Individual component details and props
- [API Integration](./src/utils/monadApi.ts) - Mock API implementation ready for live data
- [Farcaster Integration](./src/hooks/useFarcasterSDK.ts) - Social features implementation details