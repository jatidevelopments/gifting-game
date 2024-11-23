import { type FC } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  href?: string;
  size?: 'normal' | 'large';
  layout?: 'horizontal' | 'vertical';
  showImage?: boolean;
}

export const Logo: FC<LogoProps> = ({ 
  href = "/", 
  size = 'normal', 
  layout = 'horizontal',
  showImage = true 
}) => {
  const isLarge = size === 'large';
  const isVertical = layout === 'vertical';
  const logoSize = isLarge ? 'w-40 h-40' : 'w-12 h-12';
  const textSize = isLarge ? 'text-5xl' : 'text-2xl';
  
  const LogoContent = (
    <motion.div
      className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-${isVertical ? '8' : '4'}`}
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#6B46C1] to-[#9F7AEA] rounded-xl shadow-lg" />
            <div className="absolute inset-0.5 bg-gray-900 rounded-[10px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/santa_logo.png"
                alt="Santa Logo"
                width={isLarge ? 140 : 40}
                height={isLarge ? 140 : 40}
                className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                priority
              />
            </div>
          </div>
        </motion.div>
      )}
      <motion.div
        className={`${textSize} font-cinzel font-bold relative`}
        whileHover={{ scale: 1.05 }}
      >
        {/* Text stroke effect using multiple shadows */}
        <span className="absolute inset-0 bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] text-transparent bg-clip-text
          [text-shadow:_-1px_-1px_0_rgba(0,0,0,0.15),_1px_-1px_0_rgba(0,0,0,0.15),_-1px_1px_0_rgba(0,0,0,0.15),_1px_1px_0_rgba(0,0,0,0.15)]
          animate-gradient-shift">
          MySecretSanta
        </span>
        {/* Main text with gradient */}
        <span className="relative bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] text-transparent bg-clip-text
          animate-gradient-shift">
          MySecretSanta
        </span>
      </motion.div>
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
