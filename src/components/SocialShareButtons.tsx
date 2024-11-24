import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#1877f2",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "#1da1f2",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: "#0077b5",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "#25d366",
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "#0088cc",
    },
    {
      name: "Email",
      icon: FaEnvelope,
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color: "#ea4335",
    },
  ];

  return (
    <div className="p-3">
      <div className="mx-auto max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center font-medium tracking-wide"
          style={{
            fontSize: "0.9rem",
            letterSpacing: "0.03em",
          }}
        >
          <span>✨</span>
          <span
            className="mx-2"
            style={{
              background: "linear-gradient(to right, #ffffff, #e0e7ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Share the magic
          </span>
          <span>✨</span>
        </motion.p>
        <div className="flex flex-wrap justify-center gap-3">
          {shareLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {link.name}
              </span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full transition-transform"
                style={{
                  backgroundColor: link.color,
                  boxShadow: `0 2px 8px ${link.color}40`,
                }}
              >
                <link.icon className="h-4 w-4 text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
