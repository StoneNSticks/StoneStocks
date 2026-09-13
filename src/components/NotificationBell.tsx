/**
 * NotificationBell: Toggle push notification subscription for earnings reminders.
 */
import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePushSubscription, PushStatus } from "@/hooks/useEarningsNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { useT } from "@/contexts/LanguageContext";

export function NotificationBell() {
  const { user } = useAuth();
  const t = useT();
  const { status, isSubscribed, subscribe, unsubscribe } = usePushSubscription();

  if (!user || status === "unsupported") return null;

  const label = isSubscribed
    ? t("notif.disable")
    : status === "denied"
    ? t("notif.blocked")
    : t("notif.enable");

  const Icon = status === "denied" ? BellOff : isSubscribed ? Bell : BellOff;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative"
          aria-label={label}
          aria-pressed={isSubscribed}
          onClick={() => isSubscribed ? unsubscribe() : subscribe()}
          disabled={status === "denied"}
        >
          <Icon aria-hidden="true" className={`h-4 w-4 ${isSubscribed ? "text-primary" : "text-muted-foreground"}`} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span className="block max-w-[240px]">{label}</span>
        {!isSubscribed && status !== "denied" && (
          <span className="mt-1 block max-w-[240px] text-xs opacity-80">{t("consent.pushInfo")}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}