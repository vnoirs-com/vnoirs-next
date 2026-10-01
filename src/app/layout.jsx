import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vnoirs.com"),
  title: {
    default: "Vnoirs | Custom Web Solutions & WhatsApp Cloud API Integrations",
    template: "%s | Vnoirs",
  },
  description:
    "Vnoirs engineers high-performance web applications, enterprise Next.js systems, and official WhatsApp Cloud API messaging infrastructure tailored to real business growth.",
  keywords: [
    "Vnoirs",
    "WhatsApp Cloud API",
    "Meta WhatsApp Business API",
    "Custom Web Applications",
    "Next.js Development Agency",
    "React Web Solutions",
    "Full-Stack Engineering",
    "Cloud Architecture",
    "DevOps",
  ],
  authors: [{ name: "Vnoirs Engineering Team", url: "https://vnoirs.com" }],
  creator: "Vnoirs",
  publisher: "Vnoirs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vnoirs.com",
    siteName: "Vnoirs",
    title: "Vnoirs | Custom Web Solutions & WhatsApp Cloud API Integrations",
    description:
      "Modern web engineering and WhatsApp Cloud API infrastructure. 100% custom code, agile development, and enterprise cloud reliability.",
    images: [
      {
        url: "/banner-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vnoirs Web Solutions & WhatsApp API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vnoirs | Custom Web Solutions & WhatsApp Cloud API Integrations",
    description:
      "Enterprise Next.js apps, custom full-stack solutions, and automated WhatsApp Cloud API messaging.",
    images: ["/banner-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://vnoirs.com/#organization",
      name: "Vnoirs",
      url: "https://vnoirs.com",
      logo: "https://vnoirs.com/banner-image.jpg",
      description:
        "Specialized digital agency offering custom web applications, React/Next.js engineering, and WhatsApp Cloud API business messaging systems.",
      email: "cs@vnoirs.com",
      telephone: "+923202453000",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+923202453000",
          contactType: "customer service",
          email: "cs@vnoirs.com",
          availableLanguage: ["English", "Urdu"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://vnoirs.com/#website",
      url: "https://vnoirs.com",
      name: "Vnoirs",
      publisher: {
        "@id": "https://vnoirs.com/#organization",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090d16] text-gray-100 antialiased selection:bg-violet-600 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
