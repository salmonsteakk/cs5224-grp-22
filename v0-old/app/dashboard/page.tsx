"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Dumbbell,
  Target,
  Trophy,
  Star,
  Medal,
  Zap,
  Crown,
  Calculator,
  Microscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/navigation";
import { ProgressProvider, useProgress } from "@/lib/progress-context";
import { subjects } from "@/lib/data";

const achievements = [
  { id: "first-lesson", title: "First Steps", description: "Complete your first lesson", icon: Star },
  { id: "five-lessons", title: "Quick Learner", description: "Complete 5 lessons", icon: Zap },
  { id: "ten-lessons", title: "Knowledge Seeker", description: "Complete 10 lessons", icon: BookOpen },
  { id: "first-quiz", title: "Quiz Starter", description: "Take your first quiz", icon: Target },
  { id: "ten-quizzes", title: "Quiz Master", description: "Complete 10 quizzes", icon: Medal },
  { id: "perfect-score", title: "Perfect Score", description: "Get 100% on a quiz", icon: Crown },
];

const levelTitles = [
  "Beginner",
  "Explorer",
  "Learner",
  "Scholar",
  "Expert",
  "Master",
  "Champion",
  "Legend",
];

function DashboardContent() {
  const { progress, getTotalStats, getSubjectStats } = useProgress();
  const stats = getTotalStats();

  const levelTitle = levelTitles[Math.min(progress.level - 1, levelTitles.length - 1)];
  const pointsToNextLevel = progress.level * 100 - progress.totalPoints;
  const levelProgress = ((progress.totalPoints % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">My Dashboard</h1>
              <p className="text-muted-foreground">
                Track your learning progress and achievements
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                  <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground">{progress.totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lessons Done</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalLessonsCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                  <Dumbbell className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalQuizzesTaken}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.overallAccuracy > 0 ? `${stats.overallAccuracy}%` : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Your Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                  <span className="text-3xl font-bold text-white">{progress.level}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-semibold text-foreground">{levelTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {pointsToNextLevel > 0
                      ? `${pointsToNextLevel} points to next level`
                      : "Max level reached!"}
                  </p>
                  <div className="mt-2">
                    <Progress value={levelProgress} className="h-2 [&>div]:bg-amber-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => {
                  const isUnlocked = progress.achievements.includes(achievement.id);
                  const Icon = achievement.icon;

                  return (
                    <div
                      key={achievement.id}
                      className={`flex flex-col items-center rounded-lg p-3 text-center transition-all ${
                        isUnlocked
                          ? "bg-amber-50 dark:bg-amber-900/30"
                          : "bg-muted opacity-50"
                      }`}
                      title={achievement.description}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isUnlocked
                            ? "bg-amber-500"
                            : "bg-muted-foreground/30"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isUnlocked ? "text-white" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <p className={`mt-2 text-xs font-medium ${
                        isUnlocked ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {achievement.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress */}
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Subject Progress</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {subjects.map((subject) => {
              const subjectStats = getSubjectStats(subject.id);
              const isMath = subject.color === "math";
              const Icon = isMath ? Calculator : Microscope;
              
              const totalLessons = subject.topics.reduce(
                (acc, topic) => acc + topic.lessons.length,
                0
              );
              const lessonsProgress = totalLessons > 0
                ? (subjectStats.lessonsCompleted / totalLessons) * 100
                : 0;

              return (
                <Card key={subject.id} className={`border-2 ${
                  isMath 
                    ? "border-blue-200 dark:border-blue-800" 
                    : "border-emerald-200 dark:border-emerald-800"
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isMath ? "bg-blue-500" : "bg-emerald-500"
                      }`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {subjectStats.lessonsCompleted} of {totalLessons} lessons
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-muted-foreground">Lessons</span>
                        <span className="font-medium text-foreground">
                          {Math.round(lessonsProgress)}%
                        </span>
                      </div>
                      <Progress
                        value={lessonsProgress}
                        className={`h-2 ${
                          isMath ? "[&>div]:bg-blue-500" : "[&>div]:bg-emerald-500"
                        }`}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {subjectStats.quizzesTaken} quizzes taken
                      </span>
                      {subjectStats.averageScore > 0 && (
                        <span className="font-medium text-foreground">
                          {subjectStats.averageScore}% avg
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href={`/learn/${subject.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          <BookOpen className="h-4 w-4" />
                          Learn
                        </Button>
                      </Link>
                      <Link href={`/practice/${subject.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          <Dumbbell className="h-4 w-4" />
                          Practice
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {stats.totalLessonsCompleted === 0 && stats.totalQuizzesTaken === 0 && (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Start Your Learning Journey!
              </h3>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Complete lessons and take quizzes to earn points, level up, and unlock achievements.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/learn">
                  <Button className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Start Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProgressProvider>
      <DashboardContent />
    </ProgressProvider>
  );
}
