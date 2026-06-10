import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP } from "@/constants/app";

interface LandingHeaderProps {
  isAuthenticated: boolean;
  primaryHref: string;
}

export function LandingHeader({ isAuthenticated, primaryHref }: LandingHeaderProps) {
  return (
    <nav className="relative z-20 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
      <Link to="/" className="flex items-center gap-2.5 font-bold">
        <img src={APP.icon} alt="" className="size-9 drop-shadow-lg" />
        <span className="text-lg tracking-tight">{APP.name}</span>
      </Link>

      <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
        <a href="#how-it-works" className="transition hover:text-foreground">How it works</a>
        <a href="#features" className="transition hover:text-foreground">Features</a>
        <a href="#start" className="transition hover:text-foreground">Get started</a>
      </div>

      <div className="flex items-center gap-2">
        {!isAuthenticated && (
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/login">Sign in</Link>
          </Button>
        )}
        <Button asChild className="h-9 rounded-xl px-4 shadow-lg shadow-primary/15">
          <Link to={primaryHref}>
            {isAuthenticated ? "Open FitX" : "Build my plan"} <ArrowRight />
          </Link>
        </Button>
      </div>
    </nav>
  );
}
