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
        .select("id, symbol, created_at, note, group_name")
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

export function useUpdateWatchlistItem() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, note, group_name }: { id: string; note?: string | null; group_name?: string | null }) => {
      if (!user) throw new Error("Not authenticated");
      const update: Record<string, unknown> = {};
      if (note !== undefined) update.note = note;
      if (group_name !== undefined) update.group_name = group_name;
      const { error } = await supabase.from("watchlist").update(update).eq("id", id).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}
