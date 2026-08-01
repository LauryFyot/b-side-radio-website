export function getAdminUrl(): string {
  const configured = import.meta.env.VITE_ADMIN_URL?.trim();
  if (configured) {
    return configured;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:5173/';
  }

  return '/admin/';
}
