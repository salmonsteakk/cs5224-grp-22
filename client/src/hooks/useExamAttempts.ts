import { useCallback, useEffect, useState } from "react";
import { listExamAttempts } from "@/services/api";
import type { ExamAttemptDto } from "@/types";

export function useExamAttempts(examPaperId: string | undefined, token: string | null) {
  const [attempts, setAttempts] = useState<ExamAttemptDto[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token || !examPaperId) {
      setAttempts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await listExamAttempts(token, examPaperId);
      setAttempts(res.attempts);
    } catch {
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  }, [token, examPaperId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { attempts, loading, refreshAttempts: refresh };
}
