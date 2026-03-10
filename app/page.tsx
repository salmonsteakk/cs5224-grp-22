"use client";

import Link from "next/link";
import { BookOpen, Dumbbell, LayoutDashboard, Sparkles, Star, Rocket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { ProgressProvider, useProgress } from "@/lib/progress-context";
import { subjects } from "@/lib/data";

function HomeContent() {
  const { progress, getTotalStats } = useProgress();
  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 py-16 md:py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Welcome to LearnBright!
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-white/90 md:text-xl">
              Your fun and friendly learning adventure starts here. Explore Math and Science with exciting video lessons and practice quizzes!
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/learn">
                <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-white/90">
                  <BookOpen className="h-5 w-5" />
                  Start Learning
                </Button>
              </Link>
              <Link href="/practice">
                <Button size="lg" variant="outline" className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20">
                  <Dumbbell className="h-5 w-5" />
                  Practice Now
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            {stats.totalLessonsCompleted > 0 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <div className="rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                  <span className="text-sm font-medium text-white">
                    {stats.totalLessonsCompleted} lessons completed
                  </span>
                </div>
                <div className="rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                  <span className="text-sm font-medium text-white">
                    {stats.totalQuizzesTaken} quizzes taken
                  </span>
                </div>
                <div className="rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                  <span className="text-sm font-medium text-white">
                    Level {progress.level}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              How Does It Work?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Learning is easy and fun with LearnBright!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Watch & Learn</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Watch fun video lessons on Math and Science topics at your own pace.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500">
                  <Dumbbell className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Practice & Grow</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Test your knowledge with interactive quizzes and get instant feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500">
                  <LayoutDashboard className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Track Progress</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  See how much you&apos;ve learned and earn points and achievements!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Subjects Preview */}
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Choose Your Subject
              </h2>
              <p className="mt-2 text-muted-foreground">
                Start learning Math or Science today!
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {subjects.map((subject) => {
                const isMath = subject.color === "math";
                return (
                  <Card 
                    key={subject.id}
                    className={`overflow-hidden border-2 transition-all hover:shadow-lg ${
                      isMath 
                        ? "border-blue-200 dark:border-blue-800" 
                        : "border-emerald-200 dark:border-emerald-800"
                    }`}
                  >
                    <div className={`p-6 ${
                      isMath 
                        ? "bg-blue-50 dark:bg-blue-950/30" 
                        : "bg-emerald-50 dark:bg-emerald-950/30"
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${
                          isMath ? "bg-blue-500" : "bg-emerald-500"
                        }`}>
                          {isMath ? (
                            <Target className="h-8 w-8 text-white" />
                          ) : (
                            <Rocket className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">{subject.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className={`h-4 w-4 ${isMath ? "text-blue-500" : "text-emerald-500"}`} />
                        <span>{subject.topics.length} exciting topics to explore</span>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Link href={`/learn/${subject.id}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2">
                            <BookOpen className="h-4 w-4" />
                            Learn
                          </Button>
                        </Link>
                        <Link href={`/practice/${subject.id}`} className="flex-1">
                          <Button 
                            className={`w-full gap-2 text-white ${
                              isMath ? "bg-blue-500 hover:bg-blue-600" : "bg-emerald-500 hover:bg-emerald-600"
                            }`}
                          >
                            <Dumbbell className="h-4 w-4" />
                            Practice
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Track your progress, earn achievements, and become a learning superstar!
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="mt-6 gap-2">
                <LayoutDashboard className="h-5 w-5" />
                View Your Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">LearnBright</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Making learning fun for primary school students
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProgressProvider>
      <HomeContent />
    </ProgressProvider>
  );
}
