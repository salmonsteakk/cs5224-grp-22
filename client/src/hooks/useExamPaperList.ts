import { useEffect, useState } from "react";
import { getExamPapers } from "@/services/api";
import type { ExamPaperSummaryDto } from "@/types";

export function useExamPaperList(subjectFilter?: string) {
  const [papers, setPapers] = useState<ExamPaperSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getExamPapers(subjectFilter)
      .then((res) => {
        if (!cancelled) setPapers(res.papers);
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
  }, [subjectFilter]);

  return { papers, loading, error };
}
