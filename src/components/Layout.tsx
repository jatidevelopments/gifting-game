import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MobileMenu } from './MobileMenu';

// Generate random positions for snowflakes
const generateSnowflakes = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const startX = Math.random() * 100;
    const startY = Math.random() * -150;
    const depth = Math.random();
    
    return {
      id: i,
      left: `${startX}vw`,
      top: `${startY}vh`,
      scale: 0.5 + depth * 0.5,
      opacity: 0.3 + depth * 0.3,
      duration: 20 + depth * 30,
      delay: Math.random() * -30,
      xMovement: Math.random() * 15 - 7.5
    };
  });
};

const snowflakes = generateSnowflakes(30);

// Generate random decorations
const generateDecorations = () => {
  const decorations = [];
  const gridCells = [
    { x: 10, y: 15 },
    { x: 85, y: 20 },
    { x: 15, y: 70 },
    { x: 80, y: 65 },
    { x: 45, y: 40 },
    { x: 20, y: 45 },
    { x: 75, y: 85 }
  ];
  
  // Shuffle grid cells
  const shuffledCells = [...gridCells].sort(() => Math.random() - 0.5);
  
  // Add 3 presents in different grid cells
  for (let i = 0; i < 3; i++) {
    const cell = shuffledCells[i];
    decorations.push({
      id: `present-${i}`,
      emoji: '🎁',
      left: `${cell!.x + (Math.random() * 10 - 5)}vw`, // Add small random offset
      top: `${cell!.y + (Math.random() * 10 - 5)}vh`,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * -20,
      scale: 0.8 + Math.random() * 0.4,
      opacity: 0.15 + Math.random() * 0.1
    });
  }
  
  // Add 4 stars in remaining grid cells
  for (let i = 0; i < 4; i++) {
    const cell = shuffledCells[i + 3];
    decorations.push({
      id: `star-${i}`,
      emoji: '✨',
      left: `${cell!.x + (Math.random() * 10 - 5)}vw`,
      top: `${cell!.y + (Math.random() * 10 - 5)}vh`,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * -20,
      scale: 0.7 + Math.random() * 0.6,
      opacity: 0.15 + Math.random() * 0.1
    });
  }
  return decorations;
};

const decorations = generateDecorations();

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { 
    href: '/', 
    label: 'Start',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  { 
    href: '/participants', 
    label: 'Participants',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    href: '/adjectives', 
    label: 'Adjectives',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    )
  },
  { 
    href: '/game-results', 
    label: 'Results',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  }
];

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      {/* Animated background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Snowflakes */}
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            style={{
              position: 'fixed',
              left: flake.left,
              top: flake.top,
              scale: flake.scale,
              opacity: flake.opacity,
              filter: "blur(0.3px)",
              zIndex: 0
            }}
            animate={{
              y: ["0vh", "120vh"],
              x: [
                "0vw",
                `${flake.xMovement}vw`,
                "0vw"
              ],
              rotate: [0, 360]
            }}
            transition={{
              y: {
                duration: flake.duration,
                repeat: Infinity,
                ease: "linear",
                delay: flake.delay
              },
              x: {
                duration: flake.duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: flake.delay
              },
              rotate: {
                duration: flake.duration / 3,
                repeat: Infinity,
                ease: "linear",
                delay: flake.delay
              }
            }}
            className="text-3xl will-change-transform select-none"
          >
            ❄️
          </motion.div>
        ))}

        {/* Additional floating decorations */}
        {decorations.map((deco) => (
          <motion.div
            key={deco.id}
            style={{
              position: 'fixed',
              left: deco.left,
              top: deco.top,
              scale: deco.scale,
              opacity: deco.opacity,
              zIndex: 0
            }}
            animate={deco.emoji === '✨' ? {
              scale: [deco.scale, deco.scale * 1.2, deco.scale],
              rotate: [0, 180, 360],
              opacity: [deco.opacity, deco.opacity * 1.5, deco.opacity]
            } : {
              rotate: [0, -360],
              x: [-10, 10, -10],
              y: [-5, 5, -5]
            }}
            transition={{
              duration: deco.duration,
              repeat: Infinity,
              ease: "linear",
              delay: deco.delay,
              times: [0, 0.5, 1]
            }}
            className="text-4xl will-change-transform select-none"
          >
            {deco.emoji}
          </motion.div>
        ))}

        {/* Flying Santa */}
        <motion.div
          initial={{ x: -100, y: "50vh" }}
          animate={{
            x: ["calc(-10vw)", "calc(110vw)"],
            y: ["50vh", "30vh", "50vh"],
            rotate: [0, -10, 0, 10, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "linear",
            y: {
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 7.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="fixed text-6xl transform -scale-x-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0"
        >
          🎅
        </motion.div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center space-x-3 text-red-500 hover:text-red-400 transition-colors font-christmas"
            >
              <span className="text-2xl">🎁</span>
              <span className="font-bold text-xl">GiftWhisper</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-gray-400 hover:text-green-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="w-6 h-6">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
