import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Logo } from "./Logo";

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
      xMovement: Math.random() * 15 - 7.5,
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
    { x: 75, y: 85 },
  ];

  // Shuffle grid cells
  const shuffledCells = [...gridCells].sort(() => Math.random() - 0.5);

  // Add Santa
  decorations.push({
    id: "santa",
    type: "santa",
    left: "-20vw",
    top: "20vh",
    duration: 30,
    delay: 0,
    scale: 1,
    opacity: 1,
  });

  // Add 3 presents in different grid cells
  for (let i = 0; i < 3; i++) {
    const cell = shuffledCells[i];
    decorations.push({
      id: `present-${i}`,
      type: "emoji",
      emoji: "🎁",
      left: `${cell!.x + (Math.random() * 10 - 5)}vw`,
      top: `${cell!.y + (Math.random() * 10 - 5)}vh`,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * -20,
      scale: 0.8 + Math.random() * 0.4,
      opacity: 0.15 + Math.random() * 0.1,
    });
  }

  // Add 4 stars in remaining grid cells
  for (let i = 0; i < 4; i++) {
    const cell = shuffledCells[i + 3];
    decorations.push({
      id: `star-${i}`,
      type: "emoji",
      emoji: "✨",
      left: `${cell!.x + (Math.random() * 10 - 5)}vw`,
      top: `${cell!.y + (Math.random() * 10 - 5)}vh`,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * -20,
      scale: 0.7 + Math.random() * 0.6,
      opacity: 0.15 + Math.random() * 0.1,
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
    href: "/",
    label: "New Game",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
];

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      {/* Animated background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Snowflakes */}
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            style={{
              position: "fixed",
              left: flake.left,
              top: flake.top,
              scale: flake.scale,
              opacity: flake.opacity,
              filter: "blur(0.3px)",
              zIndex: 0,
            }}
            animate={{
              y: ["0vh", "120vh"],
              x: ["0vw", `${flake.xMovement}vw`, "0vw"],
              rotate: [0, 360],
            }}
            transition={{
              y: {
                duration: flake.duration,
                repeat: Infinity,
                ease: "linear",
                delay: flake.delay,
              },
              x: {
                duration: flake.duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: flake.delay,
              },
              rotate: {
                duration: flake.duration / 3,
                repeat: Infinity,
                ease: "linear",
                delay: flake.delay,
              },
            }}
            className="select-none text-3xl will-change-transform"
          >
            ❄️
          </motion.div>
        ))}

        {/* Additional floating decorations */}
        {decorations.map((deco) => (
          <motion.div
            key={deco.id}
            style={{
              position: "fixed",
              left: deco.left,
              top: deco.top,
              scale: deco.scale,
              opacity: deco.opacity,
              zIndex: 0,
            }}
            animate={
              deco.type === "santa"
                ? {
                    x: ["-20vw", "120vw"],
                    y: ["20vh", "10vh", "30vh", "15vh", "20vh"],
                    rotate: [-10, 10, -5, 15, -10],
                  }
                : deco.type === "emoji" && deco.emoji === "✨"
                  ? {
                      scale: [deco.scale, deco.scale * 1.2, deco.scale],
                      rotate: [0, 180, 360],
                      opacity: [deco.opacity, deco.opacity * 1.5, deco.opacity],
                    }
                  : {
                      rotate: [0, -360],
                      x: [-10, 10, -10],
                      y: [-5, 5, -5],
                    }
            }
            transition={{
              duration: deco.duration,
              repeat: Infinity,
              ease: "linear",
              delay: deco.delay,
              times: deco.type === "santa" ? [0, 1] : undefined,
            }}
            className="select-none will-change-transform"
          >
            <span className="text-3xl">{deco.emoji}</span>
          </motion.div>
        ))}

        {/* Flying Santa */}
        <motion.div
          initial={{ x: -100, y: "50vh" }}
          animate={{
            x: ["calc(-10vw)", "calc(110vw)"],
            y: ["50vh", "30vh", "50vh"],
            rotate: [0, -10, 0, 10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "linear",
            y: {
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 7.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="fixed z-0 h-24 w-24 -scale-x-100 transform drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        >
          <Image
            src="/santa.png"
            alt="Flying Santa"
            width={96}
            height={96}
            className="h-full w-full object-contain"
            priority
          />
        </motion.div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <Logo href="/" size="normal" layout="horizontal" />

            {/* Navigation (shown on all screen sizes) */}
            <nav className="flex items-center space-x-1">
              {menuItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-cinzel text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-green-400/10 text-green-400"
                        : "text-gray-400 hover:bg-white/5 hover:text-green-400"
                    }`}
                  >
                    <span className="h-6 w-6">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="mx-auto max-w-7xl px-2 py-8 sm:px-4 lg:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
