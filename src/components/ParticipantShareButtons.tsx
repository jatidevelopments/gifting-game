import { FaWhatsapp, FaFacebook, FaEnvelope, FaLink } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface ParticipantShareButtonsProps {
  participantName: string;
  gameId: string;
}

export function ParticipantShareButtons({
  participantName,
  gameId,
}: ParticipantShareButtonsProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const textRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const url = `${window.location.origin}/game/${gameId}/game-results`;
  const message =
    `🎄 Hey ${participantName}! You're part of our Secret Santa gift exchange! 🎁\n\n` +
    "Here's what to do:\n" +
    "1. Click the link below\n" +
    "2. Find out who you're gifting to\n" +
    "3. Check their magical gift hints\n" +
    "4. Keep it a secret! 🤫✨\n\n";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const shareLinks = [
    {
      name: "Copy Link",
      icon: FaLink,
      color: "#6B7280",
      hoverColor: "#4B5563",
      onClick: handleCopyLink,
      label: copiedText ? "Copied!" : "Copy Link",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "#25D366",
      hoverColor: "#20bd5a",
      href: `https://wa.me/?text=${encodeURIComponent(message + url)}`,
      label: `Share`,
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "#4267B2",
      hoverColor: "#365899",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
      label: `Share`,
    },
    {
      name: "Email",
      icon: FaEnvelope,
      color: "#EA4335",
      hoverColor: "#D33C2F",
      href: `mailto:?subject=${encodeURIComponent(
        "🎄 Your Secret Santa Assignment is Ready! 🎁"
      )}&body=${encodeURIComponent(message + "\nClick here to join: " + url)}`,
      label: `Share`,
    },
  ];

  useEffect(() => {
    const newWidths: Record<string, number> = {};
    Object.entries(textRefs.current).forEach(([name, ref]) => {
      if (ref) {
        newWidths[name] = ref.offsetWidth + 56; // 36px for icon + 20px padding
      }
    });
  }, [participantName, copiedText]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-gray-400 text-right">Share on...</span>
      <div className="flex flex-wrap justify-end gap-1.5">
        {shareLinks.map((platform, index) => {
          const Icon = platform.icon;
          const ButtonComponent = platform.onClick ? motion.button : motion.a;
          const containerProps = platform.onClick
            ? {
                onClick: platform.onClick,
                type: "button" as const,
              }
            : {
                href: platform.href,
                target: "_blank",
                rel: "noopener noreferrer",
              };

          const isHovered = hoveredButton === platform.name;

          return (
            <motion.div
              key={platform.name}
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredButton(platform.name)}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <ButtonComponent
                {...containerProps}
                className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ease-in-out hover:w-48 sm:hover:w-56`}
                style={{
                  background: `linear-gradient(to right, ${platform.color}, ${platform.hoverColor})`,
                }}
              >
                <div
                  className={`flex items-center justify-center transition-all duration-300 ${isHovered ? "absolute left-3" : "relative"}`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-8 whitespace-nowrap pr-4 text-sm font-medium text-white"
                    >
                      {platform.label}
                      {platform.name !== "Copy Link" && ` via ${platform.name}`}
                    </motion.span>
                  )}
                </AnimatePresence>
              </ButtonComponent>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
