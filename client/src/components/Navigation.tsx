import { Link, useLocation } from "react-router-dom";
import { BookOpen, Dumbbell, LayoutDashboard, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/context/progress-context";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Sparkles },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navigation() {
  const { pathname } = useLocation();
  const { progress } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LearnBright</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.to ||
                (item.to !== "/" && pathname.startsWith(item.to));

              return (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Points Display */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {progress.totalPoints} pts
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5">
              <span className="text-sm font-semibold text-primary-foreground">
                Level {progress.level}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.to ||
                  (item.to !== "/" && pathname.startsWith(item.to));

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{progress.totalPoints} pts</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5">
                <span className="text-sm font-semibold text-primary-foreground">
                  Level {progress.level}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
