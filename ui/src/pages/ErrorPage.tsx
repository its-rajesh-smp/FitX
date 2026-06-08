import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? error.statusText : error instanceof Error ? error.message : "Something went wrong.";
  return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center"><h1 className="text-3xl font-extrabold">That route needs a spotter.</h1><p className="text-muted-foreground">{message}</p><Button asChild><Link to="/plan">Back to program</Link></Button></main>;
}
