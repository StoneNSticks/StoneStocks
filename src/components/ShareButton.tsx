/**
 * ShareButton — Reusable share component with Web Share API + clipboard fallback.
 */
import { useState } from "react";
import { Share2, Copy, Check, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useT } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  variant?: "icon" | "button";
  className?: string;
}

export function ShareButton({ url, title, text, variant = "icon", className }: ShareButtonProps) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText = text || "";

  const canNativeShare = typeof navigator.share === "function";

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      setOpen(false);
    } catch {
      // user cancelled
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(t("share.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === "icon" ? (
          <button className={`p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ${className || ""}`} title={t("share.title")}>
            <Share2 className="h-4 w-4" />
          </button>
        ) : (
          <Button variant="outline" size="sm" className={`gap-1.5 ${className || ""}`}>
            <Share2 className="h-3.5 w-3.5" />
            {t("share.title")}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="end">
        <div className="space-y-1">
          {canNativeShare && (
            <button onClick={handleNativeShare} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
              <Share2 className="h-4 w-4 text-primary" />
              {t("share.native")}
            </button>
          )}
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm" onClick={() => setOpen(false)}>
            <Twitter className="h-4 w-4 text-primary" />
            X / Twitter
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm" onClick={() => setOpen(false)}>
            <MessageCircle className="h-4 w-4 text-primary" />
            WhatsApp
          </a>
          <button onClick={handleCopy} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            {copied ? <Check className="h-4 w-4 text-chart-2" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
            {copied ? t("share.copied") : t("share.copyLink")}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
