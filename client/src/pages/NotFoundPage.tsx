import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Oops! This page doesn't exist.
        </p>
        <Link to="/">
          <Button className="mt-8 gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </main>
    </div>
  );
}
