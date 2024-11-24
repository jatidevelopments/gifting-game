import { CheckIcon, ShareIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

interface FloatingGameLinkProps {
  gameId: string;
  currentPage?: "participants" | "magic-words" | "game-results";
}

export const FloatingGameLink: React.FC<FloatingGameLinkProps> = ({
  gameId,
  currentPage = "participants",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const baseUrl = `${window.location.origin}/game/${gameId}`;
    let pageUrl: string;
    let message = "Join our magical gift exchange! 🎁✨\n\n";

    switch (currentPage) {
      case "participants":
        pageUrl = `${baseUrl}/participants`;
        message +=
          "We're gathering participants for a special gift exchange. Click the link to join:";
        break;
      case "magic-words":
        pageUrl = `${baseUrl}/magic-words`;
        message +=
          "We're adding magical words to make our gift exchange special. Join us:";
        break;
      case "game-results":
        pageUrl = `${baseUrl}/game-results`;
        message +=
          "Our gift exchange is ready! Click to see your secret gift recipient:";
        break;
      default:
        pageUrl = `${baseUrl}/participants`;
        message += "Join our Secret Santa gift exchange:";
    }

    const fullMessage = `${message}\n${pageUrl}`;

    try {
      await navigator.clipboard.writeText(fullMessage);
      setIsCopied(true);
      toast.success("Game link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link. Please try again.", {
        style: {
          background: "#1a1f35",
          color: "#ff4e4e",
          border: "1px solid rgba(255,78,78,0.2)",
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-purple-500/20 bg-gradient-to-r from-purple-600/90 to-purple-500/90 px-6 py-3 backdrop-blur-sm"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20"
          animate={{
            x: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/20 to-purple-500/0"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <CheckIcon className="h-5 w-5 text-white" />
              <span className="relative text-sm font-medium text-white">
                Copied!
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <ShareIcon className="h-5 w-5 text-white" />
              <span className="relative text-sm font-medium text-white">
                Share Game
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};
