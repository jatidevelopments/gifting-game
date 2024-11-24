import {
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
  FaReddit,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

export function SocialShareButtons() {
  const { t } = useTranslation("common");
  const [currentUrl, setCurrentUrl] = useState("");
  const defaultTitle = t(
    "social.defaultTitle",
    "🎁 Discovered MySecretSanta - The Most Magical Way to Organize Secret Santa! ✨",
  );

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareLinks = [
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "bg-[#1DA1F2]",
      hoverColor: "hover:bg-[#1a8cd8]",
      getUrl: (url: string) =>
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(defaultTitle)}`,
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-[#4267B2]",
      hoverColor: "hover:bg-[#385796]",
      getUrl: (url: string) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#20bd5a]",
      getUrl: (url: string) =>
        `https://wa.me/?text=${encodeURIComponent(defaultTitle + "\n\n" + url)}`,
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      color: "bg-[#0088cc]",
      hoverColor: "hover:bg-[#0077b3]",
      getUrl: (url: string) =>
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(defaultTitle)}`,
    },
    {
      name: "Email",
      icon: FaEnvelope,
      color: "bg-[#EA4335]",
      hoverColor: "hover:bg-[#d33c2f]",
      getUrl: (url: string) =>
        `mailto:?subject=${encodeURIComponent(defaultTitle)}&body=${encodeURIComponent("Check this out:\n\n" + url)}`,
    },
    {
      name: "Reddit",
      icon: FaReddit,
      color: "bg-[#FF4500]",
      hoverColor: "hover:bg-[#e53e00]",
      getUrl: (url: string) =>
        `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(defaultTitle)}`,
    },
  ];

  return (
    <div className="space-y-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-3xl font-bold text-transparent">
          {t("social.title")}
        </h2>
        <p className="text-gray-400">{t("social.description")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={currentUrl ? link.getUrl(currentUrl) : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-white transition-colors ${link.color} ${link.hoverColor}`}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.name}</span>
          </a>
        ))}
      </motion.div>
    </div>
  );
}
