import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Gamepad2, Sparkles, Building2 } from "lucide-react";
import { CompanyLogo } from "@/components/dashboard/CompanyLogo";
import { COMPANIES, getCompany, inferSkills, isCompanyLive } from "@/data/companies";
import { gamesForCompany, playHref } from "@/games/registry";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompany(slug);

  if (!company) {
    return { title: "Company Assessment" };
  }

  const title = `${company.name} Game-Based Aptitude & Placement Assessment 2026 | Blync`;
  const description = `Prepare for the ${company.name} recruitment round. Practice ${company.assessmentLabel} games (${company.games.slice(0, 3).join(", ")}) with real placement drills.`;

  return {
    title,
    description,
    keywords: [
      `${company.name.toLowerCase()} game based aptitude test`,
      `${company.name.toLowerCase()} assessment games`,
      `${company.name.toLowerCase()} placement 2026`,
      ...company.games.map((g) => `${company.name.toLowerCase()} ${g.toLowerCase()}`),
    ],
    alternates: {
      canonical: `${siteConfig.url}/companies/${company.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/companies/${company.slug}`,
      type: "website",
    },
  };
}

export default async function PublicCompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  const live = isCompanyLive(company);
  const registryGames = company.registrySlug ? gamesForCompany(company.registrySlug) : [];
  const skills = inferSkills(company.games);

  // Dedicated landing pages
  const dedicatedHub =
    company.slug === "capgemini"
      ? "/Capgemini"
      : company.slug === "cognizant"
      ? "/cognizant-games"
      : company.slug === "accenture"
      ? "/accenture-games"
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All Companies Directory
        </Link>

        {/* Company Header Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <CompanyLogo company={company} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {company.name}
                </h1>
                <span
                  className={
                    live
                      ? "rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {live ? "Live Assessment" : "Coming Soon"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {company.assessmentLabel}
              </p>
            </div>
          </div>

          {dedicatedHub ? (
            <Link
              href={dedicatedHub}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Gamepad2 className="h-4 w-4" /> Practice {company.name} Games
            </Link>
          ) : live && registryGames.length > 0 ? (
            <Link
              href={playHref(registryGames[0].slug)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Gamepad2 className="h-4 w-4" /> Start Practice
            </Link>
          ) : (
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              Explore All Cognitive Games
            </Link>
          )}
        </div>

        {/* Assessment Games / Rounds */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Official Assessment Rounds & Challenge Modules
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Games and puzzles evaluated in {company.name} recruitment drives
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {company.games.length} modules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {company.games.map((gameName) => {
              const matchedGame = registryGames.find(
                (g) => g.title.toLowerCase() === gameName.toLowerCase()
              );

              return (
                <div
                  key={gameName}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      {gameName}
                    </span>
                  </div>

                  {matchedGame ? (
                    <Link
                      href={playHref(matchedGame.slug)}
                      className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Play <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Exam Module
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills Evaluated */}
        {skills.length > 0 && (
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-foreground">
              Key Cognitive Skills Evaluated
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Practice Banner */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Placement Mastery</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Master {company.name} Game-Based Rounds Today
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Simulate actual exam time limits, discover rule-switching mechanics, and track your percentile against candidate leaderboards.
          </p>
          <div className="pt-2">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              Unlock Blync Pro Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
