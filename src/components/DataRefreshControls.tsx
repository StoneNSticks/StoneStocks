/**
 * Phase 78: Data Refresh Controls — Cache info and manual refresh
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, Database } from "lucide-react";

interface Props {
  lastUpdated?: Date | string;
  cacheTTL?: number; // seconds
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function DataRefreshControls({ lastUpdated, cacheTTL = 300, onRefresh, isRefreshing }: Props) {
  const { lang } = useLanguage();

  const formatAge = () => {
    if (!lastUpdated) return lang === "de" ? "Unbekannt" : "Unknown";
    const d = typeof lastUpdated === "string" ? new Date(lastUpdated) : lastUpdated;
    const diffS = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffS < 60) return `${diffS}s`;
    if (diffS < 3600) return `${Math.floor(diffS / 60)}m`;
    return `${Math.floor(diffS / 3600)}h`;
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Clock className="h-3 w-3" />
      <span>{lang === "de" ? "Aktualisiert vor" : "Updated"} {formatAge()}</span>
      <span className="text-[10px]">• TTL: {cacheTTL}s</span>
      <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing} className="gap-1 h-6 px-2">
        <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
        {lang === "de" ? "Aktualisieren" : "Refresh"}
      </Button>
    </div>
  );
}
