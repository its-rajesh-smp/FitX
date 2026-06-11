export function AuthFormCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="shadow-card rounded-3xl border border-white/80 bg-white/95 p-6 backdrop-blur sm:p-9">
      <div className="bg-primary mb-3 h-1.5 w-12 rounded-full" />
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {description}
      </p>
      {children}
      <p className="text-muted-foreground mt-7 border-t pt-6 text-center text-sm">
        {footer}
      </p>
    </div>
  );
}

export function AuthField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
      {error && (
        <span className="text-destructive mt-1.5 block text-xs">{error}</span>
      )}
    </label>
  );
}
