import { type FC } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  href?: string;
  size?: "normal" | "large";
  layout?: "horizontal" | "vertical";
  showImage?: boolean;
}

export const Logo: FC<LogoProps> = ({
  href = "/",
  size = "normal",
  layout = "horizontal",
  showImage = true,
}) => {
  const isLarge = size === "large";
  const isVertical = layout === "vertical";
  const logoSize = isLarge ? "w-40 h-40" : "w-12 h-12";
  const textSize = isLarge ? "text-3xl sm:text-6xl" : "text-md sm:text-2xl";

  const LogoContent = (
    <motion.div
      className={`flex ${isVertical ? "flex-col" : "flex-row"} items-center gap-${isVertical ? "4 sm:gap-8" : "2 sm:gap-4"}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {showImage && (
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`relative ${logoSize}`}>
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-400 to-violet-600 shadow-lg"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% auto" }}
            />
            <div className="absolute inset-0.5 rounded-[10px] bg-gray-900" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/santa_logo.png"
                alt="Santa Logo"
                width={isLarge ? 140 : 40}
                height={isLarge ? 140 : 40}
                className="relative z-10"
              />
            </div>
          </div>
        </motion.div>
      )}
      <motion.span
        className="relative inline-block"
        animate={{
          textShadow: [
            "0 0 20px rgba(168,85,247,0.5)",
            "0 0 30px rgba(168,85,247,0.7)",
            "0 0 20px rgba(168,85,247,0.5)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.span
          className={`whitespace-nowrap bg-gradient-to-r from-purple-500 via-fuchsia-400 to-violet-600 bg-clip-text px-[2px] font-bold text-transparent ${textSize}`}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ backgroundSize: "200% auto" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          MySecretSantas.com
        </motion.span>
      </motion.span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:no-underline">
        {LogoContent}
      </Link>
    );
  }

  return LogoContent;
};
