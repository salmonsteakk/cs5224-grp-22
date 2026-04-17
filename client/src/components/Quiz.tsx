import { useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Question, QuizCompletionResult } from "@/types";

interface QuizProps {
  questions: Question[];
  subjectColor: "math" | "science";
  onComplete: (result: QuizCompletionResult) => void;
  onStrategyViewed?: () => void;
}

export function Quiz({ questions, subjectColor, onComplete, onStrategyViewed }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [showStrategy, setShowStrategy] = useState(false);
  const answersRef = useRef<(number | null)[]>(new Array(questions.length).fill(null));

  const isMath = subjectColor === "math";
  const accentColor = isMath ? "bg-blue-500" : "bg-emerald-500";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";
  const progressColor = isMath ? "[&>div]:bg-blue-500" : "[&>div]:bg-emerald-500";

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    const newAnswered = [...answeredQuestions];
    newAnswered[currentIndex] = true;
    setAnsweredQuestions(newAnswered);

    answersRef.current[currentIndex] = selectedAnswer;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowStrategy(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestart = () => {
    completionSentRef.current = false;
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsQuizComplete(false);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setShowStrategy(false);
    answersRef.current = new Array(questions.length).fill(null);
  };

  const completionSentRef = useRef(false);

  useEffect(() => {
    if (!isQuizComplete || completionSentRef.current) return;
    completionSentRef.current = true;
    const responses = questions.map((q, i) => {
      const selected = answersRef.current[i];
      return {
        questionId: q.id,
        selectedIndex: selected ?? -1,
        correct: selected === q.correctAnswer,
        misconceptionTags: selected === q.correctAnswer ? [] : q.misconceptionTags ?? [],
      };
    });
    const finalScore = responses.filter((r) => r.correct).length;
    const missedTags = responses
      .filter((r) => !r.correct)
      .flatMap((r) => r.misconceptionTags ?? []);
    const focusLoopTag = missedTags.length > 0 ? missedTags[0] : undefined;
    onComplete({
      score: finalScore,
      totalQuestions: questions.length,
      responses,
      focusLoopTag,
    });
  }, [isQuizComplete, questions, onComplete]);

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect Score! You're a star!";
    if (percentage >= 80) return "Excellent work! Keep it up!";
    if (percentage >= 60) return "Good job! Practice makes perfect!";
    if (percentage >= 40) return "Nice try! Review the lessons and try again!";
    return "Keep learning! You'll do better next time!";
  };

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <Card className="overflow-hidden">
        <div className={`${lightBg} p-8 text-center`}>
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${accentColor}`}>
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>
          <p className="mt-2 text-muted-foreground">{getScoreMessage()}</p>
        </div>

        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <div className="text-5xl font-bold text-foreground">
              {score}/{questions.length}
            </div>
            <div className="mt-1 text-lg text-muted-foreground">{percentage}% correct</div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Your Score</span>
              <span className="font-medium text-foreground">{percentage}%</span>
            </div>
            <Progress value={percentage} className={`h-3 ${progressColor}`} />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${lightBg} p-4`}>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-foreground">
            Score: {score}/{questions.length}
          </span>
        </div>
        <Progress value={progressPercent} className={`h-2 ${progressColor}`} />
      </CardHeader>

      <CardContent className="p-6">
        <CardTitle className="mb-6 text-xl leading-relaxed">
          {currentQuestion.question}
        </CardTitle>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;

            let optionClass = "border-2 p-4 rounded-xl cursor-pointer transition-all ";

            if (showResult) {
              if (isCorrect) {
                optionClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
              } else if (isSelected && !isCorrect) {
                optionClass += "border-red-500 bg-red-50 dark:bg-red-950/30";
              } else {
                optionClass += "border-border opacity-50";
              }
            } else {
              if (isSelected) {
                optionClass += isMath
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
              } else {
                optionClass += "border-border hover:border-muted-foreground hover:bg-muted/50";
              }
            }

            return (
              <div
                key={index}
                className={optionClass}
                onClick={() => handleSelectAnswer(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    showResult
                      ? isCorrect
                        ? "bg-emerald-500 text-white"
                        : isSelected
                          ? "bg-red-500 text-white"
                          : "bg-muted text-muted-foreground"
                      : isSelected
                        ? isMath
                          ? "bg-blue-500 text-white"
                          : "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {showResult ? (
                      isCorrect ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isSelected ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="font-medium text-foreground">{option}</span>
                </div>
              </div>
            );
          })}
        </div>

        {showResult && (
          <div className={`mt-6 rounded-xl p-4 ${
            selectedAnswer === currentQuestion.correctAnswer
              ? "bg-emerald-50 dark:bg-emerald-950/30"
              : "bg-amber-50 dark:bg-amber-950/30"
          }`}>
            <div className="flex items-start gap-3">
              <Lightbulb className={`mt-0.5 h-5 w-5 shrink-0 ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`} />
              <div>
                <p className={`font-semibold ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Not quite!"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {showResult && currentQuestion.strategyHint && (
          <div className="mt-3 rounded-xl border border-border bg-muted/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Smart Answer Tips</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowStrategy((prev) => !prev);
                  if (!showStrategy) onStrategyViewed?.();
                }}
              >
                {showStrategy ? "Hide strategy" : "Show strategy"}
              </Button>
            </div>
            {showStrategy && (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{currentQuestion.strategyHint.title}</p>
                <p>{currentQuestion.strategyHint.focus}</p>
                <ul className="list-disc pl-5">
                  {currentQuestion.strategyHint.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {!showResult ? (
            <Button
              className={`flex-1 ${accentColor} text-white hover:opacity-90`}
              disabled={selectedAnswer === null}
              onClick={handleSubmit}
            >
              Check Answer
            </Button>
          ) : (
            <Button
              className={`flex-1 gap-2 ${accentColor} text-white hover:opacity-90`}
              onClick={handleNext}
            >
              {currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
