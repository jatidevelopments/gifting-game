import Head from "next/head";

interface SEOMetadataProps {
  title?: string;
  description?: string;
  path?: string;
}

export function SEOMetadata({
  title = "MySecretSanta - Free AI-Powered Secret Santa Generator",
  description = "Organize your Secret Santa gift exchange easily with our free online generator. Features AI gift suggestions, custom rules, price limits, and anonymous sharing. Perfect for family, office, and remote gift exchanges.",
  path = "",
}: SEOMetadataProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://mysecretsantas.com";
  const url = `${baseUrl}${path}`;

  const keywords = [
    "Secret Santa Generator",
    "Gift Exchange Organizer",
    "Online Secret Santa",
    "Christmas Gift Exchange",
    "Virtual Secret Santa",
    "AI Gift Suggestions",
    "Free Secret Santa App",
    "Anonymous Gift Exchange",
    "Remote Gift Exchange",
    "Office Secret Santa",
    "Family Gift Exchange",
    "Secret Santa with Rules",
    "Gift Ideas Generator",
    "Holiday Gift Exchange",
    "Secret Santa 2025",
  ].join(", ");

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${baseUrl}/og-image.png`} />

      {/* Additional SEO tags */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}
