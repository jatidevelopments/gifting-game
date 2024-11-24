import {
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
  FaReddit,
} from "react-icons/fa";
import { motion } from "framer-motion";

export function SocialShareButtons() {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const defaultTitle =
    "🎁 Discovered MySecretSanta - The Most Magical Way to Organize Secret Santa! ✨";

  const shareLinks = [
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "bg-[#1DA1F2]",
      hoverColor: "hover:bg-[#1a8cd8]",
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(
        "🎄 Just found the perfect Secret Santa organizer!\n\n✨ Magical UI\n🎁 Easy to use\n🤫 Truly anonymous\n\nJoin our gift exchange adventure at"
      )}`,
    },
    {
      name: "Reddit",
      icon: FaReddit,
      color: "bg-[#FF4500]",
      hoverColor: "hover:bg-[#e63e00]",
      link: `https://www.reddit.com/submit?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(
        "🎁 Found an amazing Secret Santa organizer app - MySecretSanta"
      )}&text=${encodeURIComponent(
        "Hey gift-givers! 🎄\n\nJust discovered this awesome app for organizing Secret Santa exchanges. It's got:\n\n" +
        "✨ Beautiful, magical UI\n" +
        "🎁 Super intuitive interface\n" +
        "🤫 True anonymity\n" +
        "🎯 Smart gift suggestions\n\n" +
        "Perfect for family, friends, or office parties. Check it out!"
      )}`,
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-[#4267B2]",
      hoverColor: "hover:bg-[#365899]",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(
        "🎄 Make your holiday gift exchange magical with MySecretSanta! Join us for a delightful Secret Santa experience ✨"
      )}`,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#20bd5a]",
      link: `https://wa.me/?text=${encodeURIComponent(
        "🎄 Hey! Let's organize our Secret Santa gift exchange with this amazing app!\n\n✨ It's magical, easy, and fun!\n\n"
      )}${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      color: "bg-[#0088cc]",
      hoverColor: "hover:bg-[#0077b3]",
      link: `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(
        "🎄 Found the perfect Secret Santa organizer!\n\n✨ Beautiful design\n🎁 Easy to use\n🤫 Keeps the secret in Secret Santa\n\nJoin our gift exchange:"
      )}`,
    },
    {
      name: "Email",
      icon: FaEnvelope,
      color: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
      link: `mailto:?subject=${encodeURIComponent(
        "Join our Magical Secret Santa Gift Exchange! 🎄✨"
      )}&body=${encodeURIComponent(
        "Hi!\n\nI've found this amazing app for organizing our Secret Santa gift exchange!\n\n" +
          "✨ It's beautifully designed\n" +
          "🎁 Super easy to use\n" +
          "🤫 Keeps everything secret and fun\n\n" +
          "Join our gift exchange here:\n" +
          url
      )}`,
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
          Spread the Holiday Magic!
        </h2>
        <p className="text-gray-400">
          Share MySecretSanta with friends and family to make gift-giving more magical
        </p>
      </motion.div>

      <motion.div 
        className="flex flex-wrap items-center justify-center gap-4"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {shareLinks.map((platform, index) => {
          const Icon = platform.icon;
          return (
            <motion.a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 rounded-full ${platform.color} ${platform.hoverColor} px-6 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-lg font-medium">
                Share on {platform.name}
              </span>
            </motion.a>
          );
        })}
      </motion.div>
    </div>
  );
}
