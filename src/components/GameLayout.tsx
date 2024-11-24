import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface GameLayoutProps {
  children: ReactNode;
  disableNavigation?: boolean;
}

const GameLayout = ({ children, disableNavigation }: GameLayoutProps) => {
  const router = useRouter();
  const { t, ready } = useTranslation("game");
  const gameId = router.query.gameId as string;

  const gameSteps = [
    {
      href: "participants",
      label: ready ? t("layout.navigation.participants.label") : "",
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
      label: ready ? t("layout.navigation.magic_words.label") : "",
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
      label: ready ? t("layout.navigation.game_results.label") : "",
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
  ];

  const currentStep = router.pathname.split("/").pop();

  if (!ready) {
    return null;
  }

  return (
    <div className="pb-32">
      {/* Game Progress Navigation */}
      {!disableNavigation && (
        <nav className="mb-6">
          <ul className="flex items-center justify-center gap-1">
            {gameSteps.map((step, index) => {
              const isActive = currentStep === step.href;
              const isPast =
                gameSteps.findIndex((s) => s.href === currentStep) > index;

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
                    <span className="mb-1">{step.icon}</span>
                    <span className="text-sm">{step.label}</span>
                  </Link>
                  {index < gameSteps.length - 1 && (
                    <div className="mx-1 h-px w-4 bg-white/10" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export { GameLayout };
