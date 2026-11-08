import { Link } from "react-router-dom";
import { Logo } from "@/features/landing/components/ui/Logo";
import { NAV_LINKS, SITE } from "@/features/landing/constants/site";

const COLUMNS = [
  {
    title: "Product",
    links: NAV_LINKS.map((link) => ({ label: link.label, href: `#${link.id}` })),
  },
  {
    title: "App",
    links: [
      { label: "Create account", href: SITE.signUpUrl },
      { label: "Sign in", href: SITE.signInUrl },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden border-t border-line bg-canvas">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div className="flex max-w-xs flex-col gap-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted">{SITE.description}</p>
          </div>
          <div className="flex gap-16">
            {COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <p className="text-[13px] font-semibold">{column.title}</p>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link to={link.href} className="text-sm text-muted transition-colors hover:text-ink">
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.href} className="text-sm text-muted transition-colors hover:text-ink">
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p
          aria-hidden
          className="mt-16 bg-linear-to-b from-accent/70 to-transparent bg-clip-text text-center text-[28vw] leading-[0.8] font-semibold tracking-[-0.06em] text-transparent select-none lg:text-[300px]"
        >
          FitX
        </p>

        <p className="border-t border-line py-6 text-xs text-subtle">
          © {year} FitX. Train well.
        </p>
      </div>
    </footer>
  );
}
