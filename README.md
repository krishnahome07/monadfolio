# 💼 Monadfolio - Your Monad Portfolio & Identity

A beautiful, production-ready Farcaster mini-app that transforms your Monad wallet into a social, shareable on-chain identity. Visualize your portfolio, earn achievement badges, and stay updated with the latest Monad ecosystem news.

![Monadfolio App](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&crop=center)

## 🎯 App Overview

Monadfolio is a comprehensive Farcaster mini-app designed to be a daily-use tool that enhances your on-chain identity within the Monad ecosystem. It combines portfolio visualization, gamified achievements, and curated news into one seamless experience.

## ✨ Core Features

### 📊 Portfolio Snapshot
- **Visual Portfolio**: Beautiful colored block chart where each block's size is proportional to asset value
- **Real-time Data**: Secure connection to Monad blockchain for up-to-date portfolio information
- **Customization**: Multiple pre-defined color palettes for personalized visualization
- **Privacy Controls**: Hide specific assets and toggle total portfolio value display
- **NFT Showcase**: Rotating display of your digital art and collectibles
- **Social Sharing**: Cast your portfolio directly to Farcaster with one click

### 🏆 Achievement Badges System

#### NFT-Based Badges
- **Monad Pioneer**: Hold NFTs from earliest official Monad collections
- **Collector**: Own NFTs from 3+ distinct collections
- **Artisan**: Mint your own NFT on the Monad network

#### Portfolio-Based Badges
- **Monad Whale**: Portfolio value exceeding significant thresholds
- **Steady Hand**: Long-term holding demonstrating conviction
- **Diversifier**: Balanced portfolio across different token categories
- **Growth Spurt**: Rapid portfolio value increase

#### Chain Usage Badges
- **Active User**: Complete specified number of Monad transactions
- **DeFi Degenerate**: Interact with multiple Monad-native DeFi protocols
- **Validator Supporter**: Delegate tokens to Monad validators

### 📰 Monad News Hub
- **Curated Feed**: Latest updates from official Monad channels
- **Ecosystem News**: Updates from Monad ecosystem projects
- **Industry Coverage**: Relevant news from reputable crypto outlets
- **Real-time Updates**: Stay informed without leaving Farcaster
- **Categorized Content**: Official, ecosystem, and general news sections

### 🎮 Social Features
- **Badge Sharing**: Cast your earned badges to showcase achievements
- **Leaderboards**: Rank users based on portfolio growth and badge count
- **Community Engagement**: Foster competitive environment within Monad ecosystem
- **Farcaster Integration**: Native sharing and social features

## 🚀 Live Demo

**Production URL**: [https://monadfolio.vercel.app](https://monadfolio.vercel.app)

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons

### Blockchain Integration
- **Ethers.js** - Ethereum and Monad blockchain interaction
- **Monad RPC** - Direct connection to Monad network
- **Wallet Integration** - Secure, non-custodial wallet connectivity

### Farcaster Integration
- **Farcaster Miniapp SDK** - Native Farcaster miniapp support
- **Frame Compatibility** - Backward compatibility with Farcaster frames
- **Social Sharing** - Native Farcaster composer integration

### Backend & Database
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security (RLS)** - Secure data access patterns
- **RESTful API** - Clean data fetching with React Query

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
1. **Connect**: Link your Monad wallet through Farcaster or manual entry
2. **Visualize**: View your portfolio as a beautiful colored block chart
3. **Customize**: Choose color palettes and privacy settings
4. **Earn**: Collect achievement badges based on your on-chain activity
5. **Share**: Cast your portfolio and badges to your Farcaster feed
6. **Stay Updated**: Browse the latest Monad ecosystem news

### For Developers
1. **Clone** the repository
2. **Install** dependencies with `npm install`
3. **Configure** environment variables
4. **Run** development server with `npm run dev`
5. **Build** for production with `npm run build`

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

The application uses Supabase with the following schema:

### Users Table
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
- **Validator Tracking**: Monitors staking and delegation activities

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain test coverage for new features
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
- Contact via Farcaster: [@your-username]
- Email: [your-email@domain.com]

## 🔮 Roadmap

### Upcoming Features
- [ ] Advanced portfolio analytics and insights
- [ ] Cross-chain portfolio tracking
- [ ] Social leaderboards and competitions
- [ ] Custom badge creation for projects
- [ ] Portfolio performance tracking over time
- [ ] Integration with more Monad DeFi protocols
- [ ] Mobile app versions (iOS/Android)

### Performance Improvements
- [ ] Service worker for offline functionality
- [ ] Progressive Web App features
- [ ] Advanced caching strategies
- [ ] Bundle size optimization

---

**Built with ❤️ for the Monad ecosystem**

*Monadfolio - Transform your wallet into your identity!*

---

## 📚 Additional Documentation

For detailed technical information:
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)
- [Security Policy](./docs/SECURITY.md)