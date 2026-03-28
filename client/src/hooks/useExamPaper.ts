import { useEffect, useState } from "react";
import { getExamPaper } from "@/services/api";
import type { ExamPaperDetailDto } from "@/types";

export function useExamPaper(paperId: string | undefined) {
  const [paper, setPaper] = useState<ExamPaperDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!paperId) {
      setPaper(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getExamPaper(paperId)
      .then((data) => {
        if (!cancelled) setPaper(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [paperId]);

  return { paper, loading, error };
}
