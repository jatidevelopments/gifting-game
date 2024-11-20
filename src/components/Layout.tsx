import Link from 'next/link';
import { useRouter } from 'next/router';
import { MobileMenu } from './MobileMenu';
import { HomeIcon, TagIcon, GiftIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    href: '/',
    icon: <HomeIcon className="w-5 h-5" />,
    label: 'Home',
  },
  {
    href: '/participants',
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>,
    label: 'Participants',
  },
  {
    href: '/adjectives',
    icon: <TagIcon className="w-5 h-5" />,
    label: 'Adjectives',
  },
  {
    href: '/game-results',
    icon: <GiftIcon className="w-5 h-5" />,
    label: 'Results',
  },
];

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="relative">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center space-x-3 text-red-500 hover:text-red-400 transition-colors font-christmas"
              >
                <span className="text-2xl">🎄</span>
                <span className="font-bold text-xl">Gifting Game</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 text-lg font-medium transition-colors ${
                      router.pathname === item.href
                        ? 'text-green-400'
                        : 'text-green-400/70 hover:text-green-400'
                    }`}
                  >
                    <span className="w-5 h-5">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
