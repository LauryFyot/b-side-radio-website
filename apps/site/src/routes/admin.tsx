import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getAdminUrl } from "@/lib/admin-url";

export const Route = createFileRoute("/admin")({
  component: AdminRedirect,
});

function AdminRedirect() {
  const adminUrl = getAdminUrl();

  useEffect(() => {
    const target = new URL(adminUrl, window.location.href).href;
    if (window.location.href !== target) {
      window.location.replace(target);
    }
  }, [adminUrl]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Redirection</p>
        <h1 className="mt-2 text-3xl">Ouverture de l admin...</h1>
        <a href={adminUrl} className="mt-6 inline-block text-primary underline underline-offset-4">
          Continuer vers admin
        </a>
      </div>
    </main>
  );
}
