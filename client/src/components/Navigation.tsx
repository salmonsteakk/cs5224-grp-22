import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Dumbbell,
  LayoutDashboard,
  ScrollText,
  Sparkles,
  Menu,
  X,
  LogIn,
  LogOut,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useProgress } from "@/context/progress-context";

const navItems = [
  { to: "/", label: "Home", icon: Sparkles },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/exams", label: "Exams", icon: ScrollText },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, user, clearAuthSession } = useAuth();
  const { progress } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    clearAuthSession();
    setMobileMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LearnBright</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {isAuthenticated
              ? navItems.map((item) => {
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
                })
              : null}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-2 rounded-full bg-accent px-3 py-1.5 md:flex">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{progress.totalPoints} pts</span>
                </div>
                <div className="hidden items-center gap-1 rounded-full bg-primary px-3 py-1.5 md:flex">
                  <span className="text-sm font-semibold text-primary-foreground">Level {progress.level}</span>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 lg:flex">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden gap-2 md:inline-flex"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Button>
                </Link>
                <Link to="/login" className="md:hidden">
                  <Button variant="default" size="icon" aria-label="Sign in">
                    <LogIn className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && isAuthenticated && (
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
                <span className="text-sm font-semibold text-primary-foreground">Level {progress.level}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
