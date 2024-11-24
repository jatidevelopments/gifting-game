import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

type LoadingMessage = {
  icon: string;
  title: string;
  description: string;
};

const fallbackMessages: LoadingMessage[] = [
  {
    icon: "🎲",
    title: "Shuffling Participants",
    description: "Making sure everyone gets a unique gift buddy...",
  },
  {
    icon: "🎨",
    title: "Creating Gift Ideas",
    description: "Our elves are brainstorming personalized suggestions...",
  },
  {
    icon: "🎁",
    title: "Wrapping Things Up",
    description: "Adding some festive magic to your assignments...",
  },
  {
    icon: "✨",
    title: "Sprinkling Magic Dust",
    description: "Making your Secret Santa experience extra special...",
  },
  {
    icon: "🎄",
    title: "Spreading Holiday Cheer",
    description: "Almost ready to reveal your magical pairings...",
  },
];

export const LoadingAnimation = () => {
  const { t } = useTranslation("game");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const translatedMessages = t("loading_animation.messages", {
    returnObjects: true,
  });

  const loadingMessages: LoadingMessage[] = Array.isArray(translatedMessages) 
    ? translatedMessages 
    : fallbackMessages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  const currentMessage = loadingMessages[currentMessageIndex];

  if (!currentMessage) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
      >
        <div className="space-y-6 text-center">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="relative mx-auto h-24 w-24">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-red-500/20"></div>
              <div className="absolute inset-3 rounded-full bg-gradient-to-r from-purple-500 to-red-500"></div>
              <div className="absolute inset-4 flex items-center justify-center rounded-full bg-gray-900">
                <span className="text-4xl">{currentMessage.icon}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text font-cinzel text-2xl text-transparent">
                {currentMessage.title}
              </h2>
              <p className="text-gray-400">{currentMessage.description}</p>
            </div>
          </motion.div>

          <div className="flex justify-center space-x-2">
            {loadingMessages.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentMessageIndex
                    ? "bg-purple-500"
                    : "bg-white/20"
                }`}
                animate={{
                  scale: index === currentMessageIndex ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
