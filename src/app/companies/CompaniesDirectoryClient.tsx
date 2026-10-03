"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Building2, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { CompanyLogo } from "@/components/dashboard/CompanyLogo";
import { COMPANIES, isCompanyLive, type CompanyEntry } from "@/data/companies";

export default function CompaniesDirectoryClient() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<"all" | "india" | "global">("all");

  const filteredCompanies = useMemo(() => {
    return COMPANIES.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.assessmentLabel.toLowerCase().includes(search.toLowerCase()) ||
        c.games.some((g) => g.toLowerCase().includes(search.toLowerCase()));

      const matchesRegion =
        regionFilter === "all" ? true : c.region === regionFilter;

      return matchesSearch && matchesRegion;
    });
  }, [search, regionFilter]);

  const liveCompanies = filteredCompanies.filter((c) => isCompanyLive(c));
  const otherCompanies = filteredCompanies.filter((c) => !isCompanyLive(c));

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Building2 className="h-3.5 w-3.5" />
            <span>Company Assessment Directory 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground font-heading">
            Placement Game Practice by Employer
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Practice recruitment assessments and game-based aptitude rounds for {COMPANIES.length}+ top global and campus employers.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employer, test type, or game name..."
              className="w-full rounded-xl border border-border/80 bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border/70 bg-muted/40 p-1 text-xs shrink-0 self-stretch sm:self-auto justify-center">
            {(["all", "india", "global"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegionFilter(r)}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer capitalize ${
                  regionFilter === r
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "All" : r === "india" ? "India / Campus" : "Global"}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border/80 p-8">
            <p className="text-sm font-semibold text-foreground">No companies found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for &quot;Capgemini&quot;, &quot;Accenture&quot;, or &quot;Cognizant&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Live Assessments Section */}
            {liveCompanies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">
                    Available Assessments (Interactive Practice)
                  </h2>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Live Now
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveCompanies.map((company) => (
                    <Link
                      key={company.slug}
                      href={`/companies/${company.slug}`}
                      className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5">
                        <CompanyLogo company={company} size="md" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                              {company.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Live
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {company.assessmentLabel}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {company.games.length} challenge rounds
                        </span>
                        <span className="font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Practice Games <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other Tracked Employers */}
            {otherCompanies.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">
                  All Employer Assessments
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {otherCompanies.map((company) => (
                    <Link
                      key={company.slug}
                      href={`/companies/${company.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 hover:border-border hover:bg-card transition-all cursor-pointer"
                    >
                      <CompanyLogo company={company} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {company.name}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {company.assessmentLabel}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
