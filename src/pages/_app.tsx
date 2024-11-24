import { type AppType } from "next/app";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Snow } from "../components/Snow";
import { Layout } from "../components/Layout";
import { SnowballEffect } from "../components/SnowballEffect";
import { SocialShareButtons } from "../components/SocialShareButtons";
import { TRPCProvider } from "../trpc/provider";
import { useRouter } from "next/router";
import { Cinzel, Raleway } from "next/font/google";
import { SEOMetadata } from "../components/SEOMetadata";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  
  return (
    <TRPCProvider>
      <SEOMetadata path={router.asPath} />
      <div
        className={`min-h-screen bg-gradient-to-b from-[#1a1f35] via-[#2c1f35] to-[#1a1f35] ${raleway.className} ${cinzel.variable}`}
      >
        {/* Background effects */}
        <div className="pointer-events-none fixed inset-0">
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
    </TRPCProvider>
  );
};

export default MyApp;
