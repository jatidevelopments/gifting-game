# MySecretSanta 🎁✨

A magical web application that revolutionizes Secret Santa gift exchanges with AI-powered personalization, secure participant management, and delightful user experiences.

🌟 **Try it out: [MySecretSanta App](https://gifting-game.vercel.app/)**

![MySecretSanta Home](/public/product_screens/home.png)

## ✨ Features

### 🎯 Core Features
- **Smart Gift Matching**: Intelligent participant pairing with secure access
- **AI-Powered Gift Ideas**: Personalized gift suggestions using GPT-3.5-turbo and GPT-4o-mini
- **Visual Gift Inspiration**: AI-generated gift visualizations
- **Secure Access**: PIN-based verification system for participants
- **Real-time Status Updates**: Dynamic progress tracking for gift generation
- **Mobile-First Design**: Responsive and beautiful UI for all devices

### 🎨 Gift Description Categories
- **Color**: Visual appearance and aesthetic qualities
- **Texture**: Tactile and physical properties
- **Style**: Design and fashion characteristics
- **Mood**: Emotional and atmospheric qualities
- **Utility**: Practical and functional aspects
- **Interest**: Hobby and activity-related traits
- **Size**: Physical dimensions and proportions

### 🔒 Security Features
- Unique, cryptographically secure access URLs
- PIN-based participant verification
- Protected user data and preferences
- Rate-limited API access

## 🖼️ Product Showcase

### Landing Page
![Landing Page](/public/product_screens/landing.png)
*Welcome to MySecretSanta - Start your gift exchange journey*

### Add Participants
![Add Participants](/public/product_screens/add_participants.png)
*Easily add and manage your Secret Santa participants*

### Magic Words
![Magic Words](/public/product_screens/add_magic_words.png)
*Add personalized magic words to enhance gift suggestions*

### Assignment Creation
![Assignment Overview](/public/product_screens/create_assignment_overview.png)
*Review your Secret Santa setup before proceeding*

### Assignment Progress
![Assignment Progress](/public/product_screens/create_assignment_progress.png)
*Watch as AI generates personalized gift suggestions*

### Assignment Confirmation
![Assignment Confirmation](/public/product_screens/create_assignment_confirm.png)
*Assignments successfully created and ready to share*

### PIN Verification
![PIN Verification](/public/product_screens/pin.png)
*Secure access with personal PIN codes*

### Assignment View
![Assignment](/public/product_screens/assignment.png)
*Beautiful and engaging assignment reveal with AI-generated suggestions*

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL database
- OpenAI API key

### Quick Start
1. Clone and install:
```bash
git clone https://github.com/yourusername/gifting-game.git
cd gifting-game
npm install
```

2. Configure environment:
```bash
# .env file
DATABASE_URL="postgresql://user:password@localhost:5432/gifting-game"
OPENAI_API_KEY="your-openai-api-key"
```

3. Initialize database:
```bash
npx prisma db push
npx prisma db seed
```

4. Run development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
gifting-game/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── game/         # Game-specific components
│   ├── pages/            # Next.js pages
│   │   ├── api/         # API routes
│   │   ├── game/        # Game-related pages
│   │   └── assignment/  # Assignment pages
│   ├── hooks/           # Custom React hooks
│   ├── server/          # Backend logic
│   │   ├── router/      # tRPC routers
│   │   └── types/       # Shared types
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── prisma/              # Database configuration
├── public/              # Static assets
└── ...config files
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Query
- **Toast Notifications**: React Hot Toast

### Backend
- **API Layer**: tRPC
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI Integration**: OpenAI SDK
- **Authentication**: Custom PIN-based system

### Development
- **Type Safety**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git
- **CI/CD**: Vercel

## 🌐 Deployment

The app is deployed on [Vercel](https://vercel.com) with [Supabase](https://supabase.com) PostgreSQL:

### Supabase Setup
1. Create project at [Supabase](https://supabase.com)
2. Configure database:
   - Get connection string from Project Settings → Database
   - Enable Vercel IP access in Network Access settings
   - Set up connection pooling for better performance

### Vercel Setup
1. Import from GitHub
2. Configure environment variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   OPENAI_API_KEY=your-openai-api-key
   ```
3. Deploy and enjoy!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for their powerful AI models
- Vercel for hosting and deployment
- Supabase for database infrastructure
- The amazing open-source community
