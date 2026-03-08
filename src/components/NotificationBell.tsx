/**
 * NotificationBell — Toggle push notification subscription for earnings reminders.
 */
import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePushSubscription, PushStatus } from "@/hooks/useEarningsNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function NotificationBell() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { status, isSubscribed, subscribe, unsubscribe } = usePushSubscription();

  if (!user || status === "unsupported") return null;

  const label = isSubscribed
    ? lang === "de" ? "Push-Benachrichtigungen deaktivieren" : "Disable push notifications"
    : status === "denied"
    ? lang === "de" ? "Benachrichtigungen blockiert" : "Notifications blocked"
    : lang === "de" ? "Earnings-Erinnerungen aktivieren" : "Enable earnings reminders";

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
