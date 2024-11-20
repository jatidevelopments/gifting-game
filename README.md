# Gifting Game

A modern web application for organizing festive gift exchanges with AI-powered adjective generation and secure participant interactions.

## Features

- **Smart Gift Matching**: Automated participant pairing system
- **AI-Powered Descriptions**: Generate creative gift descriptions using OpenAI
- **Secure Access**: PIN-based verification for participants
- **Responsive Design**: Mobile-first approach with modern UI
- **Category System**: Organized gift descriptions with six distinct categories:
  - Color (visual appearance)
  - Texture (tactile qualities)
  - Style (design aesthetic)
  - Mood (emotional qualities)
  - Utility (practical aspects)
  - Interest (target audience)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gifting-game.git
cd gifting-game
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file and add:
DATABASE_URL="postgresql://user:password@localhost:5432/gifting-game"
OPENAI_API_KEY="your-openai-api-key"
```

4. Initialize the database:
```bash
npx prisma db push
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
gifting-game/
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Next.js pages and API routes
│   ├── server/            # tRPC router definitions
│   ├── styles/            # Global styles and Tailwind config
│   └── utils/             # Utility functions and helpers
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── public/                # Static assets
└── ...config files
```

## Built With

- **Framework**: [Next.js](https://nextjs.org/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **API**: [tRPC](https://trpc.io/)
- **AI Integration**: [OpenAI](https://openai.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## Deployment

The application can be deployed on [Vercel](https://vercel.com) with a [Neon](https://neon.tech) PostgreSQL database:

1. Create a Neon database and get the connection string
2. Deploy to Vercel and set up environment variables:
   - `DATABASE_URL`: Neon PostgreSQL connection string
   - `OPENAI_API_KEY`: OpenAI API key

## Mobile-First Design

The application features a responsive, mobile-first design with:
- Touch-friendly interfaces
- Smooth animations
- Adaptive layouts
- Mobile navigation menu

## Security Features

- PIN-based authentication
- Secure database queries with Prisma
- Environment variable protection
- Type-safe API routes

## Game Flow

1. **Setup**: Add participants to the gift exchange
2. **Adjectives**: Generate or manually add gift descriptions
3. **Assignment**: Automatic gift pair matching
4. **Access**: Participants use PINs to view their assignments
5. **Results**: View all gift pairings after the exchange

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [T3 Stack](https://create.t3.gg/)
- Powered by [OpenAI](https://openai.com/)
- Hosted on [Vercel](https://vercel.com)
