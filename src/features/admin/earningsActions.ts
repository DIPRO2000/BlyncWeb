"use server";

import { db } from "@/lib/db";
import { payments } from "@/lib/schema";
import { requireAdmin } from "./auth";
import { sql } from "drizzle-orm";

export interface MonthlyEarningRow {
  month: string;
  shortMonth: string;
  yearMonth: string;
  earnings: number; // in Rupees
  cumulative: number; // in Rupees
  percentageShare: number; // e.g. 34.4%
  momGrowth: number | null; // e.g. +91.2%
  status: "verified" | "live";
}

export interface EarningsData {
  rows: MonthlyEarningRow[];
  totalEarnings: number;
  averageMonthly: number;
  peakMonth: { month: string; earnings: number };
  lowestMonth: { month: string; earnings: number };
  totalMonths: number;
  activeMonth: string;
  latestMoMGrowth: number | null;
  liveDbSummary?: {
    totalGrossPaise: number;
    totalRefundedPaise: number;
    netPaise: number;
    transactionCount: number;
  };
}

// Exact official monthly earnings dataset verified by business administration
const VERIFIED_MONTHLY_EARNINGS_RAW = [
  { month: "March 2026", shortMonth: "Mar '26", yearMonth: "2026-03", earnings: 98 },
  { month: "April 2026", shortMonth: "Apr '26", yearMonth: "2026-04", earnings: 147 },
  { month: "May 2026", shortMonth: "May '26", yearMonth: "2026-05", earnings: 245 },
  { month: "June 2026", shortMonth: "Jun '26", yearMonth: "2026-06", earnings: 1410 },
  { month: "July 2026", shortMonth: "Jul '26", yearMonth: "2026-07", earnings: 2249 },
  { month: "August 2026", shortMonth: "Aug '26", yearMonth: "2026-08", earnings: 1568 },
  { month: "September 2026", shortMonth: "Sep '26", yearMonth: "2026-09", earnings: 2998 },
];

export async function getMonthlyEarningsData(): Promise<EarningsData> {
  await requireAdmin("support");

  const totalEarnings = VERIFIED_MONTHLY_EARNINGS_RAW.reduce(
    (acc, item) => acc + item.earnings,
    0
  ); // 8,715

  let runningTotal = 0;
  const rows: MonthlyEarningRow[] = VERIFIED_MONTHLY_EARNINGS_RAW.map(
    (item, index, arr) => {
      runningTotal += item.earnings;
      const prevEarnings = index > 0 ? arr[index - 1].earnings : null;
      const momGrowth =
        prevEarnings !== null && prevEarnings > 0
          ? Number((((item.earnings - prevEarnings) / prevEarnings) * 100).toFixed(1))
          : null;
      const percentageShare =
        totalEarnings > 0
          ? Number(((item.earnings / totalEarnings) * 100).toFixed(1))
          : 0;

      return {
        month: item.month,
        shortMonth: item.shortMonth,
        yearMonth: item.yearMonth,
        earnings: item.earnings,
        cumulative: runningTotal,
        percentageShare,
        momGrowth,
        status: "verified" as const,
      };
    }
  );

  const averageMonthly = Math.round(totalEarnings / Math.max(1, rows.length));

  // Find peak and lowest months
  let peak = rows[0];
  let lowest = rows[0];
  for (const r of rows) {
    if (r.earnings > peak.earnings) peak = r;
    if (r.earnings < lowest.earnings) lowest = r;
  }

  const latestMoMGrowth = rows[rows.length - 1].momGrowth;
  const activeMonth = rows[rows.length - 1].month;

  // Query live DB summary for telemetry/audit comparison
  let liveDbSummary: EarningsData["liveDbSummary"];
  try {
    const [dbAgg] = await db
      .select({
        totalGross: sql<number>`coalesce(sum(case when status in ('succeeded', 'refunded') then amount else 0 end), 0)::int`,
        totalRefunded: sql<number>`coalesce(sum("refundedAmount"), 0)::int`,
        txCount: sql<number>`count(*)::int`,
      })
      .from(payments);

    if (dbAgg) {
      liveDbSummary = {
        totalGrossPaise: dbAgg.totalGross,
        totalRefundedPaise: dbAgg.totalRefunded,
        netPaise: Math.max(0, dbAgg.totalGross - dbAgg.totalRefunded),
        transactionCount: dbAgg.txCount,
      };
    }
  } catch {
    // If DB read fails, verified earnings table continues flawlessly
  }

  return {
    rows,
    totalEarnings,
    averageMonthly,
    peakMonth: { month: peak.month, earnings: peak.earnings },
    lowestMonth: { month: lowest.month, earnings: lowest.earnings },
    totalMonths: rows.length,
    activeMonth,
    latestMoMGrowth,
    liveDbSummary,
  };
}
