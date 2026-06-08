import { Dumbbell, LayoutGrid, LogOut, Menu, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/plan", label: "My Program", icon: LayoutGrid },
  { to: "/chat", label: "AI Planner", icon: MessageSquare },
];

function Brand() {
  return (
    <NavLink to="/plan" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
        <Dumbbell className="size-4" />
      </span>
      <span className="text-lg font-extrabold tracking-tight">FitAI</span>
    </NavLink>
  );
}

function SidebarContent({ close }: { close?: () => void }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const initials = user?.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "FX";

  const logout = () => {
    clearAuth();
    close?.();
    navigate("/", { replace: true });
  };

  return (
    <>
      <Brand />
      <nav className="mt-8 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={close}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary",
                isActive && "bg-primary-soft text-primary",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 rounded-xl border bg-white p-3 shadow-xs">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{user?.name ?? "FitAI Member"}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? "Loading profile..."}</p>
        </div>
        <Button variant="ghost" size="icon-sm" className="ml-auto" aria-label="Log out" onClick={logout}><LogOut /></Button>
      </div>
    </>
  );
}

export function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r bg-white p-5 md:flex">
        <SidebarContent />
      </aside>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur md:hidden">
        <Brand />
        <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setOpen(true)}>
          <Menu />
        </Button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-black/20" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-white p-5 shadow-xl">
            <Button className="absolute top-4 right-4" variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X />
            </Button>
            <SidebarContent close={() => setOpen(false)} />
          </aside>
        </div>
      )}
      <main className="md:pl-56">
        <Outlet />
      </main>
    </div>
  );
}
