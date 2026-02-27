import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";

export function useWatchlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("watchlist")
        .select("symbol, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useIsInWatchlist(symbol: string) {
  const { data } = useWatchlist();
  return data?.some((w) => w.symbol === symbol) ?? false;
}

export function useToggleWatchlist() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [cooldown, setCooldown] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ symbol, isInList }: { symbol: string; isInList: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (isInList) {
        const { error } = await supabase.from("watchlist").delete().eq("user_id", user.id).eq("symbol", symbol);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("watchlist").insert({ user_id: user.id, symbol });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const toggle = useCallback(
    (symbol: string, isInList: boolean) => {
      if (cooldown) return;
      mutation.mutate({ symbol, isInList });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);
    },
    [cooldown, mutation]
  );

  return { toggle, cooldown, isLoading: mutation.isPending };
}
