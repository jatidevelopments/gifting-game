import { useTranslation } from "next-i18next";
import Head from "next/head";

interface SEOMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  namespace?: "home" | "game";
}

interface StructuredData {
  "@context": "https://schema.org";
  "@type": "WebApplication";
  name: string;
  alternateName?: string[];
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  author?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  screenshots?: {
    "@type": "ImageObject";
    url: string;
    caption: string;
  }[];
  description: string;
  featureList: string[];
}

const SEOMetadata = ({
  title,
  description,
  path = "",
  namespace = "home",
}: SEOMetadataProps) => {
  const { t } = useTranslation(namespace);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://mysecretsantas.com";
  const url = `${baseUrl}${path}`;

  // Use translations or fallback to provided props
  const metaTitle = title ?? t("meta.title");
  const metaDescription = description ?? t("meta.description");
  const metaKeywords = t("meta.keywords");

  let screenShots = t("meta.structuredData.screenshots", {
    returnObjects: true,
  }) as { url: string; caption: string }[];

  // if screenshot string
  if (typeof screenShots === "string") {
    screenShots = [];
  }

  const structuredData: StructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("meta.structuredData.name"),
    alternateName: t("meta.structuredData.alternateNames", {
      returnObjects: true,
    }) as string[],
    applicationCategory: t("meta.structuredData.applicationCategory"),
    operatingSystem: t("meta.structuredData.operatingSystem"),
    description: t("meta.structuredData.description"),
    author: {
      "@type": "Organization",
      name: t("meta.structuredData.author.name"),
      url: t("meta.structuredData.author.url"),
    },
    screenshots: screenShots.map(
      (screenshot: { url: string; caption: string }) => ({
        "@type": "ImageObject",
        url: `${baseUrl}${screenshot.url}`,
        caption: screenshot.caption,
      }),
    ),
    offers: {
      "@type": "Offer",
      price: t("meta.structuredData.offers.price"),
      priceCurrency: t("meta.structuredData.offers.currency"),
    },
    featureList: t("meta.structuredData.features", {
      returnObjects: true,
    }) as string[],
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta
        name="application-name"
        content={t("meta.structuredData.shortName")}
      />
      <meta name="author" content={t("meta.structuredData.author.name")} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-title"
        content={t("meta.structuredData.shortName")}
      />
      <meta name="format-detection" content="telephone=no" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={t("meta.structuredData.name")} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />
      <meta property="og:locale" content="en_US" />
      <meta property="fb:app_id" content={t("meta.social.facebook")} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={t("meta.social.twitter")} />
      <meta name="twitter:creator" content={t("meta.social.twitter")} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Additional SEO tags */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta
        name="googlebot"
        content="index, follow, max-snippet:-1, max-image-preview:large"
      />
      <meta
        name="bingbot"
        content="index, follow, max-snippet:-1, max-image-preview:large"
      />

      {/* PWA related tags */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    </Head>
  );
};

export default SEOMetadata;
