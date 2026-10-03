import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import AccentureGamesClient from "./client";

export const metadata: Metadata = {
  title: "Accenture Cognitive Assessment Games 2026 | Pattern & Logic Practice",
  description:
    "Prepare for the Accenture cognitive assessment & game-based round. Practice critical thinking, abstract reasoning, deductive puzzles, and memory challenges with Blync Pro.",
  keywords: [
    "accenture cognitive assessment",
    "accenture game based aptitude test",
    "accenture placement 2026",
    "accenture cognitive games",
    "accenture critical thinking test",
    "accenture abstract reasoning",
    "accenture pathfinder game",
    "accenture online test practice",
  ],
  alternates: {
    canonical: `${siteConfig.url}/accenture-games`,
  },
  openGraph: {
    title: "Accenture Cognitive Assessment Games 2026 | Blync Pro",
    description:
      "Practice Accenture cognitive assessment & game rounds with Blync Pro. Pattern recognition, deductive logic, and memory challenges for 2026 placements.",
    url: `${siteConfig.url}/accenture-games`,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-logo.png`,
        width: 1200,
        height: 630,
        alt: "Accenture Cognitive Assessment Practice — Blync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accenture Cognitive Assessment Games 2026 | Blync Pro",
    description: "Practice Accenture placement games online. Deductive logic, memory, and cognitive challenges with Blync Pro.",
    images: [`${siteConfig.url}/og-logo.png`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What games are asked in the Accenture cognitive assessment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Accenture cognitive round assesses critical thinking, abstract reasoning, numerical ability, and spatial memory through interactive challenge modules.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Accenture cognitive assessment an elimination round?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the cognitive assessment is an elimination stage. Clearing the sectional cutoffs is mandatory to qualify for the technical assessment and interview.",
      },
    },
    {
      "@type": "Question",
      name: "How can I prepare for Accenture placement games on Blync?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Practice actual placement games on Blync simulating time pressure, pattern inference, and spatial recall to maximize your score.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Blync Accenture Prep",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 1140,
  },
  offers: {
    "@type": "Offer",
    price: "49",
    priceCurrency: "INR",
  },
};

export default function AccentureGamesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <AccentureGamesClient />
    </>
  );
}
