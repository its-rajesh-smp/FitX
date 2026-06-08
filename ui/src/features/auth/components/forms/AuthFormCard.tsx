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
    <div className="shadow-card rounded-2xl border bg-white p-6 sm:p-8">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      {children}
      <p className="text-muted-foreground mt-6 text-center text-sm">{footer}</p>
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
      <span className="mb-2 block text-sm font-bold">{label}</span>
      {children}
      {error && (
        <span className="text-destructive mt-1.5 block text-xs">{error}</span>
      )}
    </label>
  );
}
