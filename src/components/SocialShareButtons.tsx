import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877f2',
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#1da1f2',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: '#0077b5',
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25d366',
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#0088cc',
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color: '#ea4335',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/20 to-transparent">
      <div className="max-w-2xl mx-auto">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2 font-medium tracking-wide"
          style={{
            fontSize: '0.9rem',
            letterSpacing: '0.03em'
          }}
        >
          <span>✨</span>
          <span className="mx-2" style={{ 
            background: 'linear-gradient(to right, #ffffff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            Share the magic
          </span>
          <span>✨</span>
        </motion.p>
        <div className="flex justify-center gap-3 flex-wrap">
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
              <span
                className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded 
                          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
              >
                {link.name}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                style={{
                  backgroundColor: link.color,
                  boxShadow: `0 2px 8px ${link.color}40`,
                }}
              >
                <link.icon className="w-4 h-4 text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
