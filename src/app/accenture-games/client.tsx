"use client";

import CompanyGamesClient from "@/components/games/CompanyGamesClient";
import { Zap } from "lucide-react";

const AccentureGamesClient = () => (
  <CompanyGamesClient
    title="Accenture Cognitive & Game-Based Assessment Practice"
    description="Ace the Accenture placement round. Practice critical thinking, abstract reasoning, deductive puzzles, and memory challenges designed for 2026 recruitment."
    badgeIcon={Zap}
    badgeText="Accenture 2026 Prep"
    footerText="Updated for Accenture 2026 Placement Season"
    gradientColor="via-purple-500/5"
    blobTopClass="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"
    blobBottomClass="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px]"
  />
);

export default AccentureGamesClient;
