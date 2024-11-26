import { appWithTranslation } from "next-i18next";
import { type AppType } from "next/app";
import dynamic from "next/dynamic";
import { Cinzel, Raleway } from "next/font/google";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { TRPCProvider } from "../trpc/provider";

// Dynamic imports for components with client-side features
const Snow = dynamic(
  () => import("../components/Snow").then((mod) => mod.Snow),
  {
    ssr: false,
  },
);

const SnowballEffect = dynamic(
  () =>
    import("../components/SnowballEffect").then((mod) => mod.SnowballEffect),
  {
    ssr: false,
  },
);

const Layout = dynamic(() => import("../components/Layout"), {
  ssr: true,
});

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
      <div
        className={`min-h-screen bg-gradient-to-b from-[#1a1f35] via-[#2c1f35] to-[#1a1f35] ${raleway.className} ${cinzel.variable}`}
      >
        <div className="pointer-events-none fixed inset-0">
          <Snow />
          <SnowballEffect />
        </div>

        <Layout>
          <Component {...pageProps} />
        </Layout>

        <Toaster position="bottom-center" />
      </div>
    </TRPCProvider>
  );
};

export default appWithTranslation(MyApp);
