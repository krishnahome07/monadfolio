# 🔢 Number Crunch - Math Puzzle Game

A beautiful, production-ready math puzzle game built with React, TypeScript, and Tailwind CSS. Challenge your mind with daily number puzzles where you combine numbers using basic operations to reach a target value.

![Number Crunch Game](https://raw.githubusercontent.com/smbalaji27/appIcons/main/appicon.jpg)

## 🎮 Game Overview

Number Crunch is an engaging math puzzle game where players:
- Receive a set of random numbers (1-10)
- Get a target number to reach (10-50)
- Use basic operations (+, -, ×) to combine numbers
- Track their progress with time and move counters
- Share their solutions with friends

## ✨ Features

### 🎯 Core Gameplay
- **Smart Puzzle Generation**: Every puzzle is guaranteed to be solvable
- **Real-time Timer**: Track how long it takes to solve each puzzle
- **Move Counter**: Monitor efficiency with move tracking
- **Solution Path**: Visual display of all steps taken to reach the target
- **Instant Feedback**: Immediate validation of moves and operations

### 📊 User Statistics
- **Progress Tracking**: Total puzzles solved, best time, average moves
- **Persistent Storage**: Stats saved using Supabase database
- **Guest Mode**: Play without registration with local storage fallback
- **Cross-Platform Sync**: Stats sync across devices when using Farcaster

### 🎨 User Experience
- **Beautiful Design**: Modern gradient-based UI with smooth animations
- **Responsive Layout**: Optimized for all screen sizes
- **Interactive Tutorial**: First-time user onboarding with "How to Play" popup
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized React components with minimal re-renders
- **Loading States**: Smooth loading experience with proper feedback

### 🔗 Social Features
- **Share Solutions**: Multiple sharing options (Farcaster, Web Share API, clipboard)
- **Farcaster Miniapp**: Native integration with Farcaster ecosystem
- **Smart Onboarding**: Automatic tutorial for new users, manual access for returning users
- **Social Metadata**: Rich preview cards for social sharing
- **Guest User Support**: Seamless experience for non-Farcaster users

## 🚀 Live Demo

**Production URL**: [https://numbers-crunch.vercel.app](https://numbers-crunch.vercel.app)

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons

### Backend & Database
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security (RLS)** - Secure data access patterns
- **RESTful API** - Clean data fetching with React Query

### Integrations
- **Farcaster Miniapp SDK** - Native Farcaster miniapp support
- **Web Share API** - Native sharing capabilities
- **Local Storage** - Guest user persistence and fallback

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing with Autoprefixer

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── GameBoard.tsx    # Main game interface
│   ├── GameComplete.tsx # Victory screen
│   ├── HowToPlay.tsx    # Interactive tutorial popup
│   ├── SolutionPath.tsx # Solution display
│   ├── UserStats.tsx    # Statistics component
│   └── MaintenanceMode.tsx # Maintenance screen
├── hooks/               # Custom React hooks
│   ├── useGame.ts       # Game state management
│   └── useFarcasterSDK.ts # Farcaster integration
├── lib/                 # External service integrations
│   └── supabase.ts      # Database client and operations
├── types/               # TypeScript type definitions
│   └── game.ts          # Game-related types
├── utils/               # Utility functions
│   └── gameLogic.ts     # Core game logic and algorithms
└── App.tsx              # Main application component
```

## 🎮 How to Play

1. **Start**: Click "New Game" to generate a fresh puzzle
2. **Select**: Choose two numbers from the available set
3. **Operate**: Pick an operation (+, -, ×) to combine them
4. **Continue**: Keep combining until you reach the target
5. **Win**: Celebrate and share your solution!

### Game Rules
- Select exactly 2 numbers before choosing an operation
- Operations replace the selected numbers with the result
- Subtraction always returns the absolute difference
- Game ends when the target number appears in your available numbers
- First-time users see an automatic tutorial popup explaining the rules
- Returning users can access tutorial via "How to Play" button

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd number-crunch-game
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
# Supabase Configuration (optional for basic gameplay)
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous access
CREATE POLICY "Allow anonymous users to create users" ON users
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous users to read user data" ON users
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous users to update user stats" ON users
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
```

## 🔐 Security Features

### Content Security Policy
- Strict CSP headers preventing XSS attacks
- Whitelisted domains for external resources
- Frame ancestors limited to trusted domains

### Data Validation
- Input sanitization for usernames and game data
- SQL injection prevention through parameterized queries
- Rate limiting on database operations

### Privacy
- No personal data collection beyond game statistics
- Guest mode for anonymous play
- Tutorial preferences stored locally (no server tracking)
- Secure token handling for Farcaster integration

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

### Manual Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🎯 Game Algorithm

### Puzzle Generation
1. **Number Generation**: Random numbers within difficulty range
2. **Solvability Check**: Recursive algorithm ensures every puzzle has a solution
3. **Target Selection**: Picks achievable targets from possible combinations
4. **Fallback System**: Guarantees puzzle generation even in edge cases

### Operation Logic
- **Addition**: Standard arithmetic with overflow protection
- **Subtraction**: Always returns absolute difference (no negatives)
- **Multiplication**: With result limits to prevent huge numbers

## 🔄 Application Flow

### Initialization Sequence
1. **SDK Initialization**: Farcaster miniapp SDK setup
2. **User Identification**: Create stable user ID (Farcaster or guest)
3. **Database Connection**: Load user stats from Supabase
4. **Game Generation**: Create first solvable puzzle
5. **UI Rendering**: Display game interface

### User Experience Flow
- **Farcaster Users**: Enhanced experience with profile integration
- **Guest Users**: Full functionality with local storage
- **New Users**: Automatic tutorial popup on first visit
- **Returning Users**: Clean interface with optional tutorial access
- **Database Unavailable**: Graceful degradation to local-only mode

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
- [ ] Daily challenges with leaderboards
- [ ] Multiple difficulty levels
- [ ] Advanced tutorial with interactive examples
- [ ] Achievement system
- [ ] Multiplayer competitions
- [ ] Custom puzzle creation
- [ ] Mobile app versions

### Performance Improvements
- [ ] Service worker for offline play
- [ ] Progressive Web App features
- [ ] Advanced caching strategies
- [ ] Bundle size optimization

---

**Built with ❤️ for the Farcaster community**

*Number Crunch - Where numbers meet their match!*

---

## 📚 Documentation

For detailed technical documentation about the application architecture and flow:

**[📖 App Flow Overview](./docs/APP_FLOW.md)** - Comprehensive guide to how the application initializes, loads, and operates. Essential reading for developers who need to understand the codebase structure and data flow.