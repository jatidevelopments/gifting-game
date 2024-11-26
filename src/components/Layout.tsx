import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LanguageFooter } from "./LanguageFooter";

interface Snowflake {
  id: number;
  left: string;
  top: string;
  scale: number;
  opacity: number;
  duration: number;
  delay: number;
  xMovement: number;
}

interface Decoration {
  id: string;
  type: string;
  left: string;
  top: string;
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
  emoji?: string;
}

// Dynamic import of LanguageSwitcher to avoid hydration issues
const LanguageSwitcher = dynamic(
  () => import("./LanguageSwitcher").then((mod) => mod.LanguageSwitcher),
  {
    ssr: false,
  },
);

// Move animations to a client-side only component
const Animations = dynamic(
  () =>
    Promise.resolve(() => {
      const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
      const [decorations, setDecorations] = useState<Decoration[]>([]);

      useEffect(() => {
        // Generate random positions for snowflakes
        const generateSnowflakes = (count: number): Snowflake[] => {
          return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * -150}vh`,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0.3 + Math.random() * 0.3,
            duration: 20 + Math.random() * 30,
            delay: Math.random() * -30,
            xMovement: Math.random() * 15 - 7.5,
          }));
        };

        const generateDecorations = (): Decoration[] => {
          const decorations: Decoration[] = [];
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

        setSnowflakes(generateSnowflakes(30));
        setDecorations(generateDecorations());
      }, []);

      return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
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
            >
              ❄️
            </motion.div>
          ))}
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
                        opacity: [
                          deco.opacity,
                          deco.opacity * 1.5,
                          deco.opacity,
                        ],
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
              width={200}
              height={200}
              className="h-full w-full object-contain"
              priority
            />
          </motion.div>
        </div>
      );
    }),
  { ssr: false },
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <div className="relative min-h-screen">
      <Animations />
      {/* Header */}
      <header className="relative z-20">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center">
                <Logo href={undefined} />
              </Link>
            </div>

            {/* Language Switcher - Right aligned */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-2 py-8 sm:px-4 lg:px-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto space-y-8 py-8">
        <LanguageFooter />
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {year} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
