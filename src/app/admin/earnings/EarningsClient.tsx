"use client";

import React, { useState } from "react";
import type { EarningsData } from "@/features/admin/earningsActions";
import {
  IndianRupee,
  TrendingUp,
  Calendar,
  Award,
  Download,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface EarningsClientProps {
  initialData: EarningsData;
}

export function EarningsClient({ initialData }: EarningsClientProps) {
  const [data] = useState<EarningsData>(initialData);
  const [viewMode, setViewMode] = useState<"monthly" | "cumulative">("monthly");

  const formatRupees = (val: number) => {
    return "₹" + val.toLocaleString("en-IN");
  };

  const handleExportCsv = () => {
    try {
      const headers = [
        "Month",
        "Total Earnings (INR)",
        "Cumulative Total (INR)",
        "Revenue Share (%)",
        "MoM Growth (%)",
        "Status",
      ];
      const rows = data.rows.map((r) => [
        `"${r.month}"`,
        r.earnings,
        r.cumulative,
        `"${r.percentageShare}%"`,
        r.momGrowth !== null ? `"${r.momGrowth > 0 ? "+" : ""}${r.momGrowth}%"` : '"—"',
        `"${r.status}"`,
      ]);

      const footer = [
        '"Total"',
        data.totalEarnings,
        data.totalEarnings,
        '"100%"',
        '""',
        '"Verified Ledger"',
      ];

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(",")), footer.join(",")].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `cognitivegames-monthly-earnings-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Monthly earnings CSV exported successfully");
    } catch {
      toast.error("Failed to export earnings CSV");
    }
  };

  const maxMonthlyEarnings = Math.max(...data.rows.map((r) => r.earnings), 1);
  const maxCumulative = data.totalEarnings || 1;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Monthly Earnings
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Verified Ledger
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified monthly financial earnings and cumulative revenue breakdown till now.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="h-8 text-xs gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Earnings Till Now
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {formatRupees(data.totalEarnings)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Cumulative across {data.totalMonths} recorded months
          </p>
        </div>

        {/* Average Monthly */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Average Monthly
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {formatRupees(data.averageMonthly)}
            </span>
            <span className="text-xs text-muted-foreground">/ mo</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Normalized across active period
          </p>
        </div>

        {/* Peak Record Month */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Peak Month
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {formatRupees(data.peakMonth.earnings)}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-foreground">
            {data.peakMonth.month}{" "}
            <span className="text-muted-foreground font-normal">
              ({data.rows.find((r) => r.month === data.peakMonth.month)?.percentageShare}% of all-time)
            </span>
          </p>
        </div>

        {/* Latest Month Growth */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Latest Month (Sep 2026)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {formatRupees(data.rows[data.rows.length - 1]?.earnings || 0)}
            </span>
            {data.latestMoMGrowth !== null && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                <ArrowUpRight className="h-3 w-3" />
                +{data.latestMoMGrowth}% MoM
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Highest monthly revenue recorded
          </p>
        </div>
      </div>

      {/* Visual Chart / Bar Breakdown */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Earnings Progression Visualizer
            </h3>
            <p className="text-xs text-muted-foreground">
              {viewMode === "monthly"
                ? "Monthly individual revenues and relative share"
                : "Cumulative earnings growth over time reaching ₹8,715 total"}
            </p>
          </div>

          <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                viewMode === "monthly"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Revenue
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cumulative")}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                viewMode === "cumulative"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cumulative Total
            </button>
          </div>
        </div>

        {/* Visual Bars */}
        <div className="space-y-2 pt-2">
          {data.rows.map((row) => {
            const currentVal = viewMode === "monthly" ? row.earnings : row.cumulative;
            const maxVal = viewMode === "monthly" ? maxMonthlyEarnings : maxCumulative;
            const pct = Math.min(100, Math.max(10, (currentVal / maxVal) * 100));

            return (
              <div key={row.month} className="flex items-center gap-3 text-xs">
                <span className="w-28 shrink-0 font-medium text-foreground text-xs">
                  {row.month}
                </span>

                <div className="flex-1 bg-muted/40 h-7 rounded-lg overflow-hidden relative flex items-center px-3 border border-border/40">
                  <div
                    className={`absolute left-0 top-0 bottom-0 rounded-lg transition-all duration-500 ${
                      viewMode === "monthly"
                        ? "bg-primary/20 border-r-2 border-primary"
                        : "bg-emerald-500/20 border-r-2 border-emerald-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {formatRupees(currentVal)}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {viewMode === "monthly"
                        ? `${row.percentageShare}% of total`
                        : `${((row.cumulative / data.totalEarnings) * 100).toFixed(1)}% of ₹${data.totalEarnings.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Data Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="border-b border-border/80 px-5 py-4 flex items-center justify-between bg-muted/20">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Official Monthly Earnings Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Exact record of total earnings per month till now
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {data.totalMonths} months recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground font-medium">
                <th className="py-3 px-5 font-semibold text-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Month
                  </div>
                </th>
                <th className="py-3 px-5 text-right font-semibold text-foreground">
                  <div className="flex items-center justify-end gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                    Total Earnings
                  </div>
                </th>
                <th className="py-3 px-5 text-right font-semibold text-foreground">
                  <div className="flex items-center justify-end gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    Cumulative Total
                  </div>
                </th>
                <th className="py-3 px-5 text-center font-semibold text-foreground">
                  Share of Revenue
                </th>
                <th className="py-3 px-5 text-right font-semibold text-foreground">
                  MoM Growth
                </th>
                <th className="py-3 px-5 text-center font-semibold text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.rows.map((row) => {
                return (
                  <tr
                    key={row.month}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Month Name */}
                    <td className="py-3.5 px-5 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{row.month}</span>
                        {row.month === data.peakMonth.month && (
                          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Peak
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Earnings */}
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-foreground text-sm">
                      {formatRupees(row.earnings)}
                    </td>

                    {/* Cumulative Total */}
                    <td className="py-3.5 px-5 text-right font-mono text-muted-foreground">
                      {formatRupees(row.cumulative)}
                    </td>

                    {/* Share of Revenue */}
                    <td className="py-3.5 px-5 text-center">
                      <div className="inline-flex items-center gap-2 min-w-[100px] justify-center">
                        <div className="w-16 bg-muted/60 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${row.percentageShare}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {row.percentageShare}%
                        </span>
                      </div>
                    </td>

                    {/* MoM Growth */}
                    <td className="py-3.5 px-5 text-right">
                      {row.momGrowth === null ? (
                        <span className="text-muted-foreground font-mono text-[11px]">
                          — (Base)
                        </span>
                      ) : row.momGrowth >= 0 ? (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                          <ArrowUpRight className="h-3 w-3" />
                          +{row.momGrowth}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 font-mono">
                          <ArrowDownRight className="h-3 w-3" />
                          {row.momGrowth}%
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Verified
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Total Footer Row */}
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/50 font-semibold text-foreground">
                <td className="py-4 px-5 text-sm font-bold text-foreground">
                  Total
                </td>
                <td className="py-4 px-5 text-right font-mono font-bold text-foreground text-base">
                  {formatRupees(data.totalEarnings)}
                </td>
                <td className="py-4 px-5 text-right font-mono font-bold text-foreground">
                  {formatRupees(data.totalEarnings)}
                </td>
                <td className="py-4 px-5 text-center font-mono text-xs">
                  100.0%
                </td>
                <td className="py-4 px-5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  +2,959% Overall
                </td>
                <td className="py-4 px-5 text-center text-[11px] font-mono text-muted-foreground">
                  7 Months Total
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
