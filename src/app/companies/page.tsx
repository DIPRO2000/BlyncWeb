import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import CompaniesDirectoryClient from "./CompaniesDirectoryClient";

export const metadata: Metadata = {
  title: "Company Game-Based Aptitude Tests 2026 | Placement Prep Directory",
  description:
    "Prepare for game-based aptitude tests and cognitive assessment rounds across Capgemini, Accenture, Cognizant, Infosys, TCS, Amazon and 50+ employers on Blync.",
  keywords: [
    "company game based aptitude test",
    "placement aptitude games",
    "capgemini cognitive games",
    "accenture cognitive assessment",
    "cognizant genc elevate puzzle",
    "campus placement games 2026",
    "recruitment aptitude games",
  ],
  alternates: {
    canonical: `${siteConfig.url}/companies`,
  },
  openGraph: {
    title: "Company Game-Based Aptitude Tests 2026 | Blync",
    description:
      "Practice company-specific cognitive challenges, puzzle rounds, and aptitude tests for top placement recruiters.",
    url: `${siteConfig.url}/companies`,
    type: "website",
  },
};

export default function CompaniesPage() {
  return <CompaniesDirectoryClient />;
}
