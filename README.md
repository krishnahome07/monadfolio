# 💼 Monadfolio - Your Monad Portfolio & Identity

A beautiful, production-ready Farcaster mini-app that transforms your Monad wallet into a social, shareable on-chain identity. Visualize your portfolio with stunning block charts, earn achievement badges based on your on-chain activity, and stay updated with the latest Monad ecosystem news.

![Monadfolio App](https://monadfolio.vercel.app/appicon.png)

## 🎯 App Overview

Monadfolio is a comprehensive Farcaster mini-app designed to be your daily companion for managing and showcasing your Monad on-chain identity. It combines beautiful portfolio visualization, gamified achievement system, and curated ecosystem news into one seamless social experience.

## ✨ Core Features

### 📊 Portfolio
- **Visual Portfolio**: Stunning colored block visualization where each block's size represents your asset allocation
- **Real-time Data**: Live connection to Monad blockchain for up-to-date portfolio information
- **Customization**: Multiple pre-defined color palettes for personalized visualization
- **Privacy Controls**: Hide specific assets and toggle total portfolio value display
- **NFT Showcase**: Beautiful gallery display of your Monad NFT collection
- **Social Sharing**: Cast your portfolio directly to Farcaster with one click

### 🏆 Achievement Badges System

#### NFT-Based Badges
- **🏆 Monad Pioneer**: Hold NFTs from earliest official Monad collections
- **🎨 Collector**: Own NFTs from 3+ distinct Monad collections
- **✨ Artisan**: Mint your own NFT on the Monad network

#### Portfolio-Based Badges
- **🐋 Monad Whale**: Portfolio value exceeding significant thresholds
- **💎 Diamond Hands**: Long-term holding demonstrating conviction
- **📊 Diversifier**: Balanced portfolio across different asset categories
- **🚀 Growth Master**: Achieve significant portfolio growth

#### Chain Usage Badges
- **⚡ Active Trader**: Complete significant number of Monad transactions
- **🔥 DeFi Explorer**: Interact with multiple Monad-native DeFi protocols
- **🛡️ Network Supporter**: Delegate tokens to Monad validators

### 📰 Monad News Hub
- **📢 Official Updates**: Latest announcements from Monad team
- **🌐 Ecosystem News**: Updates from Monad ecosystem projects and partners
- **📰 Industry Coverage**: Relevant blockchain and crypto news
- **Real-time Updates**: Stay informed without leaving Farcaster
- **Smart Filtering**: Organized by official, ecosystem, and industry categories

### 🎮 Social Features
- **🏆 Badge Sharing**: Cast your earned achievements to showcase your progress
- **📊 Portfolio Sharing**: Share beautiful portfolio snapshots with custom styling
- **🤝 Community Features**: Connect with other Monad ecosystem participants
- **💬 Native Integration**: Seamless Farcaster composer and social features

## 🚀 Live Demo

**🌐 Live App**: [https://monadfolio.vercel.app](https://monadfolio.vercel.app)
**📱 Farcaster Frame**: Available in Farcaster as a native mini-app

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons

### Blockchain Integration
- **Ethers.js** - Ethereum and Monad blockchain interaction
- **Monad Network** - Native integration with Monad blockchain
- **Wallet Integration** - Secure, non-custodial wallet connectivity

### Farcaster Integration
- **Farcaster Miniapp SDK** - Native Farcaster miniapp support
- **Frame Compatibility** - Backward compatibility with Farcaster frames
- **Social Sharing** - Native Farcaster composer integration

### Backend & Database
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security (RLS)** - Secure data access patterns
- **React Query** - Efficient data fetching and caching

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing with Autoprefixer

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── WalletConnect.tsx    # Wallet connection interface
│   ├── PortfolioSnapshot.tsx # Main portfolio visualization
│   ├── BadgeCollection.tsx  # Achievement badges display
│   ├── MonadNews.tsx        # News feed component
│   └── MaintenanceMode.tsx  # Maintenance screen
├── hooks/               # Custom React hooks
│   ├── useFarcasterSDK.ts   # Farcaster integration
│   ├── usePortfolio.ts      # Portfolio data management
│   └── useMonadNews.ts      # News data management
├── utils/               # Utility functions
│   └── monadApi.ts          # Monad blockchain API integration
├── types/               # TypeScript type definitions
│   └── portfolio.ts         # Portfolio and badge types
└── App.tsx              # Main application component
```

## 🎮 How to Use

### For Users
1. **🔗 Connect**: Link your Monad wallet through Farcaster or manual entry
2. **👀 Visualize**: View your portfolio as stunning colored block charts
3. **🎨 Customize**: Choose from multiple color palettes and privacy settings
4. **🏆 Achieve**: Earn badges based on your on-chain activity and holdings
5. **📢 Share**: Cast your portfolio and achievements to your Farcaster network
6. **📰 Stay Informed**: Browse curated Monad ecosystem news and updates

### For Developers
1. **📥 Clone** the repository
2. **📦 Install** dependencies with `npm install`
3. **⚙️ Configure** environment variables
4. **🚀 Run** development server with `npm run dev`
5. **🏗️ Build** for production with `npm run build`

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn package manager
- Monad wallet (for testing)

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

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure Environment Variables**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
VITE_APP_ENABLED=true

# NFT Contract Configuration
VITE_NFT_CONTRACT_ADDRESS=your_deployed_contract_address_here

# Deployment Configuration (for contract deployment)
PRIVATE_KEY=your_wallet_private_key_for_deployment
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

## 🗄️ Database Schema

The application uses Supabase for optional user statistics and cross-device sync:

### Optional User Statistics
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  wallet_address text,
  total_portfolio_value numeric DEFAULT 0,
  badges_earned integer DEFAULT 0,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔐 Security Features

### Wallet Security
- **Non-custodial**: Never stores private keys or sensitive data
- **Secure Connection**: Uses established Farcaster wallet infrastructure
- **Privacy Controls**: Users control what data is shared publicly

### Data Protection
- **Input Sanitization**: All user inputs are validated and sanitized
- **SQL Injection Prevention**: Parameterized queries and RLS policies
- **Content Security Policy**: Strict CSP headers preventing XSS attacks

### Farcaster Integration
- **Secure SDK**: Uses official Farcaster miniapp SDK
- **Frame Compatibility**: Backward compatible with existing Farcaster frames
- **Privacy Respect**: Only accesses necessary user data

## 🌐 Deployment

### Vercel (Current)
The app is deployed on Vercel with:
- Automatic builds from Git
- Environment variable management
- Custom headers for security
- SPA routing support

### Netlify (Alternative)
Alternative deployment option with:
- Optimized build settings
- Security headers
- Rewrite rules for SPA

## 🎯 Monad Integration

### Blockchain Features
- **Real-time Data**: Direct connection to Monad RPC endpoints
- **Low Latency**: Leverages Monad's high-speed transaction capabilities
- **Cost Effective**: Benefits from Monad's low transaction costs
- **Full Compatibility**: Native support for Monad ecosystem

### Portfolio Analysis
- **Asset Detection**: Automatically discovers all Monad assets
- **NFT Recognition**: Identifies and displays Monad NFTs
- **DeFi Integration**: Tracks interactions with Monad DeFi protocols
- **Staking Tracking**: Monitors staking and delegation activities

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monad Team** - For building an incredible high-performance blockchain
- **Farcaster Team** - For the excellent miniapp SDK and platform
- **Supabase** - For the robust backend-as-a-service platform
- **Tailwind CSS** - For the beautiful utility-first CSS framework
- **Lucide** - For the comprehensive icon library

## 📞 Support

For support, feature requests, or bug reports:
- Open an issue on GitHub
- Contact via Farcaster
- Join the Monad community discussions

## 🔮 Roadmap

### Upcoming Features
- [ ] 📈 Advanced portfolio analytics and performance tracking
- [ ] 🏆 Social leaderboards and community competitions
- [ ] 🎨 Custom badge creation for Monad projects
- [ ] 📊 Historical portfolio performance charts
- [ ] 🔗 Integration with more Monad DeFi protocols
- [ ] 📱 Enhanced mobile experience and PWA features
- [ ] 🤖 AI-powered portfolio insights and recommendations

### Performance Improvements
- [ ] 🔄 Service worker for offline functionality
- [ ] 📱 Progressive Web App features
- [ ] ⚡ Advanced caching strategies
- [ ] 📦 Bundle size optimization

---

**Built with ❤️ for the Monad ecosystem**

*Monadfolio - Transform your wallet into your identity!*

---

## 📚 Additional Documentation

For detailed technical information:
- [App Flow Documentation](./docs/APP_FLOW.md) - Detailed technical architecture
- [Component Documentation](./src/components/) - Individual component details
- [API Integration](./src/utils/monadApi.ts) - Blockchain integration details
- [Farcaster Integration](./src/hooks/useFarcasterSDK.ts) - Social features implementation