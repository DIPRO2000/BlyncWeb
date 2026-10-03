import type { Metadata } from "next";
import { getMonthlyEarningsData } from "@/features/admin/earningsActions";
import { EarningsClient } from "./EarningsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Monthly Earnings | Admin Console",
};

export default async function AdminEarningsPage() {
  const data = await getMonthlyEarningsData();
  return <EarningsClient initialData={data} />;
}
