/** URL pública do site, usada em links de e-mail e no descadastro. */
export function urlDoSite(): string {
  const explicita = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicita) return explicita.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function urlDescadastro(token: string): string {
  return `${urlDoSite()}/descadastro?token=${encodeURIComponent(token)}`;
}
