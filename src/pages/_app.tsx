import { type AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { Snow } from '../components/Snow';
import { Layout } from '../components/Layout';
import { SnowballEffect } from '../components/SnowballEffect';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1f35] via-[#2c1f35] to-[#1a1f35]">
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
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default trpc.withTRPC(MyApp);