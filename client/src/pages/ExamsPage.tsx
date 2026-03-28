import { useState } from "react";
import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useExamPaperList } from "@/hooks/useExamPaperList";

type Filter = "all" | "math" | "science";

export default function ExamsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const subjectParam = filter === "all" ? undefined : filter;
  const { papers, loading, error } = useExamPaperList(subjectParam);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <ScrollText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">Mock exams</h1>
              <p className="text-muted-foreground">
                Full papers that mix topics — timed focus, untimed practice here.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["math", "Math"],
              ["science", "Science"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              type="button"
              variant={filter === id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(id)}
            >
              {label}
            </Button>
          ))}
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading papers…</p>}
        {error && (
          <p className="text-sm text-destructive">
            Could not load exam papers. Try again later.
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2">
            {papers.map((p) => {
              const isMath = p.subjectId === "math";
              const accent = isMath ? "border-blue-200 dark:border-blue-900" : "border-emerald-200 dark:border-emerald-900";
              return (
                <Link key={p.paperId} to={`/exams/paper/${p.paperId}`} className="block">
                  <Card className={`h-full transition-shadow hover:shadow-md ${accent}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{p.title}</CardTitle>
                      <CardDescription className="capitalize">{p.subjectId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                      <p className="mt-3 text-sm font-medium text-foreground">
                        {p.questionCount} questions
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
