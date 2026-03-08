/**
 * useLearnProgress — Track completed learn sections and quiz scores.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LearnProgress {
  section_id: string;
  completed: boolean;
  quiz_score: number | null;
}

export function useLearnProgress() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: progress = [], isLoading } = useQuery({
    queryKey: ["learn-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("learn_progress")
        .select("section_id, completed, quiz_score")
        .eq("user_id", user.id);
      return (data || []) as LearnProgress[];
    },
    enabled: !!user,
  });

  const markComplete = useMutation({
    mutationFn: async ({ sectionId, quizScore }: { sectionId: string; quizScore?: number }) => {
      if (!user) return;
      const { error } = await supabase.from("learn_progress").upsert(
        {
          user_id: user.id,
          section_id: sectionId,
          completed: true,
          quiz_score: quizScore ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,section_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["learn-progress"] }),
  });

  const isCompleted = (sectionId: string) =>
    progress.some((p) => p.section_id === sectionId && p.completed);

  const getScore = (sectionId: string) =>
    progress.find((p) => p.section_id === sectionId)?.quiz_score ?? null;

  const completedCount = progress.filter((p) => p.completed).length;

  return { progress, isLoading, markComplete, isCompleted, getScore, completedCount };
}
