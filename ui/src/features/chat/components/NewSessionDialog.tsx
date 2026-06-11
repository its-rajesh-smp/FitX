import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { startNewSession } from "@/features/chat/services/startNewSession";

export function NewSessionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) return;
    if (!nextOpen) setError(null);
    onOpenChange(nextOpen);
  };

  const confirmNewSession = async () => {
    setIsPending(true);
    setError(null);

    try {
      await startNewSession();
      window.location.reload();
    } catch {
      setError("Could not start a new session. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </span>
          <AlertDialogTitle>Start a new session?</AlertDialogTitle>
          <AlertDialogDescription>
            FitX does not support session history yet. Starting a new session
            permanently deletes your current:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ul className="mt-4 list-disc space-y-2 rounded-xl border bg-muted/35 py-4 pr-4 pl-8 text-sm">
          <li>Saved memory and fitness preferences</li>
          <li>Current chat and messages</li>
          <li>Current workout plan and progress</li>
        </ul>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => void confirmNewSession()}
          >
            {isPending && <LoaderCircle className="animate-spin" />}
            Delete and start new session
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
