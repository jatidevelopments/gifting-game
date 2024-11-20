import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const menuItems = [
  { 
    href: '/', 
    label: 'Home',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    href: '/participants', 
    label: 'Participants',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    href: '/adjectives', 
    label: 'Adjectives',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    )
  },
  { 
    href: '/game-results', 
    label: 'Results',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  }
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors text-green-400"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 bg-[#1a1f35] z-[100] lg:hidden"
          >
            <div className="relative flex flex-col min-h-screen">
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a1f35]">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center space-x-3 text-red-500 hover:text-red-400 transition-colors font-christmas"
                >
                  <span className="text-2xl">🎄</span>
                  <span className="font-bold text-xl">Gifting Game</span>
                </Link>
                <button
                  onClick={closeMenu}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-green-400"
                  aria-label="Close menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto bg-[#1a1f35]">
                <nav className="p-4">
                  <ul className="space-y-4">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full"
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`flex items-center space-x-4 py-4 px-4 rounded-lg transition-colors ${
                            router.pathname === item.href
                              ? 'bg-white/10 text-green-400'
                              : 'text-green-400 hover:bg-white/5 hover:text-green-300'
                          }`}
                        >
                          <span className="flex-shrink-0">{item.icon}</span>
                          <span className="text-lg font-medium">{item.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="p-6 text-center border-t border-white/10 bg-[#1a1f35]">
                <p className="text-sm text-red-400 font-christmas">
                  🎄 Gifting Game
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
