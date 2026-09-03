/**
 * CompanyLogo — company logo with reserved space and a stable fallback.
 *
 * Keeps layout from shifting while the image loads and, when the logo is
 * missing or fails, renders the ticker initials in the same footprint
 * instead of collapsing the row.
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  src?: string | null;
  /** Ticker or company name used for the fallback initials and alt text. */
  symbol?: string;
  name?: string;
  /** Rendered box size in px (width = height). */
  size?: number;
  className?: string;
  rounded?: string;
}

export function CompanyLogo({
  src,
  symbol,
  name,
  size = 32,
  className,
  rounded = "rounded-lg",
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => { setFailed(false); }, [src]);

  const label = name || symbol || "";
  const initials = (symbol || name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  const box = { width: size, height: size, minWidth: size } as const;

  if (!src || failed) {
    return (
      <div
        style={box}
        aria-hidden={!label}
        className={cn(
          "shrink-0 flex items-center justify-center bg-muted text-muted-foreground border border-border/40 font-semibold",
          rounded,
          className,
        )}
      >
        <span style={{ fontSize: Math.max(9, Math.round(size * 0.36)) }}>{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={label ? `${label} logo` : ""}
      width={size}
      height={size}
      style={box}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 object-contain bg-background border border-border/40 p-0.5",
        rounded,
        className,
      )}
    />
  );
}
