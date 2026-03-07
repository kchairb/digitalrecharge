const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digitalrecharge.tn";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DigitalRecharge.tn",
  url: baseUrl,
  description:
    "Buy premium digital products in Tunisia: AI tools, streaming, design assets, virtual cards, and gift cards.",
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/digitalrecharge.tn",
    process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://facebook.com/digitalrecharge.tn",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DigitalRecharge.tn",
  url: baseUrl,
  description:
    "Buy premium digital products in Tunisia: AI tools, streaming, design assets, virtual cards, and gift cards.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${baseUrl}/shop?search={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export function SeoJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
