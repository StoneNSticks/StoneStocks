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

  const Icon = isSubscribed ? BellRing : status === "denied" ? BellOff : Bell;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative"
          onClick={() => isSubscribed ? unsubscribe() : subscribe()}
          disabled={status === "denied"}
        >
          <Icon className={`h-4 w-4 ${isSubscribed ? "text-primary" : "text-muted-foreground"}`} />
          {isSubscribed && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}