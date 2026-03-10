"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import type { Lesson } from "@/lib/data";

interface VideoPlayerProps {
  lesson: Lesson;
  subjectColor: "math" | "science";
  onComplete: () => void;
  isCompleted: boolean;
}

export function VideoPlayer({ lesson, subjectColor, onComplete, isCompleted }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const isMath = subjectColor === "math";
  const accentColor = isMath ? "bg-blue-500" : "bg-emerald-500";
  const lightBg = isMath ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30";

  // Parse duration to seconds
  const parseDuration = (duration: string): number => {
    const [minutes, seconds] = duration.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const totalSeconds = parseDuration(lesson.duration);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = (100 / totalSeconds) * 0.5; // Update every 500ms
          const newProgress = Math.min(prev + increment, 100);
          
          if (newProgress >= 100 && !isCompleted) {
            onComplete();
          }
          
          return newProgress;
        });
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isPlaying, progress, totalSeconds, onComplete, isCompleted]);

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(true);
    setHasStarted(true);
  };

  const formatTime = (percentage: number): string => {
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className={`relative aspect-video ${lightBg} flex items-center justify-center`}>
        {/* Dummy Video Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${accentColor}`}>
            {isCompleted ? (
              <CheckCircle2 className="h-10 w-10 text-white" />
            ) : isPlaying ? (
              <div className="flex items-center gap-1">
                <div className="h-6 w-1.5 animate-pulse rounded-full bg-white" />
                <div className="h-8 w-1.5 animate-pulse rounded-full bg-white" style={{ animationDelay: "150ms" }} />
                <div className="h-5 w-1.5 animate-pulse rounded-full bg-white" style={{ animationDelay: "300ms" }} />
              </div>
            ) : (
              <Play className="ml-1 h-10 w-10 text-white" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-foreground">{lesson.title}</h3>
          <p className="mt-2 max-w-md text-muted-foreground">{lesson.description}</p>
          
          {isCompleted && (
            <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Lesson Completed!</span>
            </div>
          )}

          {!hasStarted && !isCompleted && (
            <Button 
              size="lg" 
              className={`mt-6 gap-2 ${accentColor} hover:opacity-90 text-white`}
              onClick={handlePlay}
            >
              <Play className="h-5 w-5" />
              Start Lesson
            </Button>
          )}
        </div>

        {/* Progress Bar Overlay */}
        {hasStarted && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <Progress 
              value={progress} 
              className="h-2 bg-white/30 [&>div]:bg-white" 
            />
            <div className="mt-2 flex items-center justify-between text-sm text-white">
              <span>{formatTime(progress)}</span>
              <span>{lesson.duration}</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={handlePlay}
                disabled={progress >= 100}
              >
                <Play className="h-4 w-4" />
                {progress > 0 && progress < 100 ? "Resume" : "Play"}
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={handlePause}
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="ghost" 
              className="gap-2"
              onClick={handleRestart}
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
