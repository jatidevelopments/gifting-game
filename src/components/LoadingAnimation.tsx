import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const loadingMessages = [
  {
    icon: "🎲",
    title: "Shuffling Participants",
    description: "Making sure everyone gets a unique gift buddy..."
  },
  {
    icon: "🎨",
    title: "Creating Gift Ideas",
    description: "Our elves are brainstorming personalized suggestions..."
  },
  {
    icon: "🎁",
    title: "Wrapping Things Up",
    description: "Adding some festive magic to your assignments..."
  },
  {
    icon: "✨",
    title: "Sprinkling Magic Dust",
    description: "Making your Secret Santa experience extra special..."
  },
  {
    icon: "🎄",
    title: "Spreading Holiday Cheer",
    description: "Almost ready to reveal your magical pairings..."
  }
];

export const LoadingAnimation = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = loadingMessages[currentMessageIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 max-w-2xl mx-auto"
      >
        <div className="text-center space-y-6">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-3 bg-gradient-to-r from-purple-500 to-red-500 rounded-full"></div>
              <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-4xl">{currentMessage!.icon}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-cinzel bg-gradient-to-r from-purple-400 to-red-400 text-transparent bg-clip-text">
                {currentMessage!.title}
              </h2>
              <p className="text-gray-400">{currentMessage!.description}</p>
            </div>
          </motion.div>

          <div className="flex justify-center space-x-2">
            {loadingMessages.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentMessageIndex ? 'bg-purple-500' : 'bg-white/20'
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
