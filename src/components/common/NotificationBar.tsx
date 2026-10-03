"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  Linkedin,
  Star,
  Crown,
  ExternalLink,
  CheckCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  href: string;
  isExternal: boolean;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  actionLabel: string;
}

const STORAGE_KEY = "blync_read_notifications_v1";

export default function NotificationBar({ className }: { className?: string }) {
  const user = useUser();
  const [readIds, setReadIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // User has premium if user.isPro === true
  const isPremium = Boolean(user?.isPro);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const saveReadIds = (ids: string[]) => {
    setReadIds(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // LocalStorage fallback
    }
  };

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      saveReadIds([...readIds, id]);
    }
  };

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = activeNotifications.map((n) => n.id);
    saveReadIds(Array.from(new Set([...readIds, ...allIds])));
  };

  // Base list of notifications
  const allNotifications: NotificationItem[] = useMemo(
    () => [
      {
        id: "notif-linkedin",
        title: "Follow on LinkedIn",
        description: "Connect with Nishul Dhakar for updates, tips & hiring announcements.",
        href: "https://www.linkedin.com/in/nishuldhakar/",
        isExternal: true,
        tag: "Community",
        icon: Linkedin,
        iconBg: "bg-sky-500/15 border border-sky-500/30",
        iconColor: "text-sky-600 dark:text-sky-400",
        actionLabel: "Follow",
      },
      {
        id: "notif-star-repo",
        title: "Star this repo on GitHub",
        description: "Star BlyncWeb repository to support open-source development and track releases.",
        href: "https://github.com/NishulDhakar/BlyncWeb",
        isExternal: true,
        tag: "Open Source",
        icon: Star,
        iconBg: "bg-amber-500/15 border border-amber-500/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        actionLabel: "Star Repo",
      },
      {
        id: "notif-buy-premium",
        title: "Buy Premium",
        description: "Unlock all 40+ cognitive placement games, mock tests & in-depth AI analytics.",
        href: "/pricing",
        isExternal: false,
        tag: "Pro Access",
        icon: Crown,
        iconBg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40",
        iconColor: "text-amber-600 dark:text-amber-400",
        actionLabel: "Buy Premium",
      },
    ],
    []
  );

  // If user bought premium, show 2 (exclude "buy premium"). If not bought premium, show 3.
  const activeNotifications = useMemo(() => {
    if (isPremium) {
      return allNotifications.filter((item) => item.id !== "notif-buy-premium");
    }
    return allNotifications;
  }, [isPremium, allNotifications]);

  const unreadCount = useMemo(() => {
    return activeNotifications.filter((item) => !readIds.includes(item.id)).length;
  }, [activeNotifications, readIds]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications (${unreadCount} unread)`}
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card hover:bg-muted/70 transition-all text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring",
            className
          )}
        >
          <Bell className="h-4 w-4" />

          {/* Badge indicator */}
          {mounted && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[340px] sm:w-[380px] p-0 rounded-xl border border-border/80 bg-card text-card-foreground shadow-xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-foreground tracking-tight">
              Notifications
            </span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {unreadCount > 0 ? `${unreadCount} new` : `${activeNotifications.length} total`}
            </span>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-border/60 max-h-[380px] overflow-y-auto overscroll-contain custom-scrollbar">
          {activeNotifications.map((item) => {
            const isRead = readIds.includes(item.id);
            const Icon = item.icon;

            const content = (
              <div
                className={cn(
                  "group flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-muted/40",
                  !isRead && "bg-muted/20"
                )}
                onClick={() => {
                  markAsRead(item.id);
                  if (!item.isExternal) {
                    setIsOpen(false);
                  }
                }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5 shadow-2xs",
                    item.iconBg
                  )}
                >
                  <Icon className={cn("h-4 w-4", item.iconColor)} />
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-foreground leading-tight truncate">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60 border border-border/50">
                        {item.tag}
                      </span>
                      {!isRead && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                          title="Unread"
                        />
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-2 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:underline">
                      {item.actionLabel}
                      {item.isExternal ? (
                        <ExternalLink className="h-2.5 w-2.5" />
                      ) : (
                        <ArrowRight className="h-2.5 w-2.5" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );

            if (item.isExternal) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-inherit no-underline"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className="block text-inherit no-underline"
              >
                {content}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border/80 px-4 py-2.5 bg-muted/20 text-center">
          {isPremium ? (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Active Pro Membership Verified</span>
            </div>
          ) : (
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Unlock all mock tests & AI practice</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
