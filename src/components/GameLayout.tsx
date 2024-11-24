import { useRouter } from "next/router";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface GameLayoutProps {
  children: ReactNode;
}

const gameSteps = [
  {
    href: "participants",
    label: "Participants",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    href: "magic-words",
    label: "Magic Words",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    ),
  },
  {
    href: "game-results",
    label: "Results",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
];

export const GameLayout = ({ children }: GameLayoutProps) => {
  const router = useRouter();
  const { gameId } = router.query;
  const currentPath = router.pathname.split("/")[3]; // Gets 'participants', 'magic-words', or 'game-results'

  // Show loading state while gameId is not available
  if (!gameId || typeof gameId !== "string") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 text-center"
        >
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          <p className="text-gray-400">Loading game...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Game Progress Navigation */}
      <nav className="mb-6">
        <ul className="flex items-center justify-center gap-1">
          {gameSteps.map((step, index) => {
            const isActive = currentPath === step.href;
            const isPast =
              gameSteps.findIndex((s) => s.href === currentPath) > index;

            return (
              <li key={step.href} className="flex items-center">
                <Link
                  href={`/game/${gameId}/${step.href}`}
                  className={`flex flex-col items-center rounded-lg border px-3 py-2 text-center font-cinzel transition-colors ${
                    isActive
                      ? "border-purple-500/30 bg-purple-500/20 text-white"
                      : isPast
                        ? "border-purple-500/20 bg-purple-500/10 text-white/80 hover:bg-purple-500/15"
                        : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  <div className="mb-1 h-5 w-5">{step.icon}</div>
                  <span className="whitespace-nowrap text-xs">
                    {step.label}
                  </span>
                </Link>
                {index < gameSteps.length - 1 && (
                  <span className="mx-1 text-white/30">→</span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      {children}
    </div>
  );
};
