import { type AppType } from 'next/app';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { Snow } from '../components/Snow';
import { Layout } from '../components/Layout';
import { SnowballEffect } from '../components/SnowballEffect';
import { SocialShareButtons } from '../components/SocialShareButtons';
import { TRPCProvider } from '../trpc/provider';
import { useRouter } from 'next/router';
import { Cinzel, Raleway } from 'next/font/google';

const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = " Found MySecretSanta - the perfect app for organizing your Secret Santa gift exchange! Join the fun ";
  const isGamePage = router.pathname.startsWith('/game/') || router.pathname.startsWith('/assignment/');

  return (
    <TRPCProvider>
      <div className={`min-h-screen bg-gradient-to-b from-[#1a1f35] via-[#2c1f35] to-[#1a1f35] ${raleway.className} ${cinzel.variable}`}>
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <Snow />
        </div>
        
        {/* Main content */}
        <Layout>
          <Component {...pageProps} />
        </Layout>

        {/* Interactive overlay */}
        <SnowballEffect />
        
        {/* Social share buttons - only show on non-game pages */}
        {!isGamePage && <SocialShareButtons url={currentUrl} title={shareTitle} />}
        
        <Toaster position="bottom-right" />
      </div>
    </TRPCProvider>
  );
};

export default MyApp;