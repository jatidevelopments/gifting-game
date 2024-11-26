import Head from "next/head";

interface SEOMetadataProps {
  title: string;
  description: string;
  keywords: string;
  path?: string;
  screenshots?: {
    url: string;
    caption: string;
  }[];
  alternateNames?: string[];
  featureList?: string[];
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaStructuredDataName?: string;
  metaStructuredDataAlternateNames?: string[];
  metaStructuredDataApplicationCategory?: string;
  metaStructuredDataOperatingSystem?: string;
  metaStructuredDataOffersPrice?: string;
  metaStructuredDataOffersCurrency?: string;
  metaStructuredDataAuthorName?: string;
  metaStructuredDataAuthorUrl?: string;
  metaStructuredDataDescription?: string;
  metaStructuredDataFeatures?: string[];
  ogSiteName?: string;
  ogLocale?: string;
  twitterSite?: string;
  twitterCreator?: string;
  facebookAppId?: string;
  canonicalUrl?: string;
  robotsContent?: string;
  googlebotContent?: string;
  bingbotContent?: string;
  manifestHref?: string;
  appleTouchIconHref?: string;
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
  keywords,
  path = "",
  screenshots = [],
  alternateNames = [],
  featureList = [],
  image,
  metaTitle,
  metaDescription,
  metaKeywords,
  metaStructuredDataName,
  metaStructuredDataAlternateNames,
  metaStructuredDataApplicationCategory,
  metaStructuredDataOperatingSystem,
  metaStructuredDataOffersPrice,
  metaStructuredDataOffersCurrency,
  metaStructuredDataAuthorName,
  metaStructuredDataAuthorUrl,
  metaStructuredDataDescription,
  metaStructuredDataFeatures,
  ogSiteName,
  ogLocale,
  twitterSite,
  twitterCreator,
  facebookAppId,
  canonicalUrl,
  robotsContent,
  googlebotContent,
  bingbotContent,
  manifestHref,
  appleTouchIconHref,
}: SEOMetadataProps) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://mysecretsantas.com";
  const url = `${baseUrl}${path}`;
  const imageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/og-image.png`;

  const structuredData: StructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: metaStructuredDataName ?? title,
    alternateName: metaStructuredDataAlternateNames ?? alternateNames,
    applicationCategory:
      metaStructuredDataApplicationCategory ?? "Entertainment",
    operatingSystem: metaStructuredDataOperatingSystem ?? "Web",
    offers: {
      "@type": "Offer",
      price: metaStructuredDataOffersPrice ?? "0",
      priceCurrency: metaStructuredDataOffersCurrency ?? "USD",
    },
    author: {
      "@type": "Organization",
      name: metaStructuredDataAuthorName ?? "MySecretSanta",
      url: metaStructuredDataAuthorUrl ?? baseUrl,
    },
    screenshots: screenshots.map((screenshot) => ({
      "@type": "ImageObject",
      url: `${baseUrl}${screenshot.url}`,
      caption: screenshot.caption,
    })),
    description: metaStructuredDataDescription ?? description,
    featureList: metaStructuredDataFeatures ?? featureList,
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle ?? title}</title>
      <meta name="description" content={metaDescription ?? description} />
      <meta name="keywords" content={metaKeywords ?? keywords} />
      <meta name="application-name" content={metaStructuredDataName ?? title} />
      <meta
        name="author"
        content={metaStructuredDataAuthorName ?? "MySecretSanta"}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-title"
        content={metaStructuredDataName ?? title}
      />
      <meta name="format-detection" content="telephone=no" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta
        property="og:site_name"
        content={ogSiteName ?? metaStructuredDataName ?? title}
      />
      <meta property="og:title" content={metaTitle ?? title} />
      <meta
        property="og:description"
        content={metaDescription ?? description}
      />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={ogLocale ?? "en_US"} />
      <meta property="fb:app_id" content={facebookAppId} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={metaTitle ?? title} />
      <meta
        name="twitter:description"
        content={metaDescription ?? description}
      />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Additional SEO tags */}
      <link rel="canonical" href={canonicalUrl ?? url} />
      <meta
        name="robots"
        content={robotsContent ?? "index, follow, max-image-preview:large"}
      />
      <meta
        name="googlebot"
        content={
          googlebotContent ??
          "index, follow, max-snippet:-1, max-image-preview:large"
        }
      />
      <meta
        name="bingbot"
        content={
          bingbotContent ??
          "index, follow, max-snippet:-1, max-image-preview:large"
        }
      />

      {/* PWA related tags */}
      <link rel="manifest" href={manifestHref ?? "/manifest.json"} />
      <link
        rel="apple-touch-icon"
        href={appleTouchIconHref ?? "/icons/apple-touch-icon.png"}
      />
    </Head>
  );
};

export default SEOMetadata;
