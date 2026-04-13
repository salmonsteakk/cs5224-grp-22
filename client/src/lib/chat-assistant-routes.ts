/** Routes where the in-app study assistant (sidebar + nav toggle) is available. */
export function isAssistantRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/learn")) return true;
  if (pathname.startsWith("/practice")) return true;
  if (pathname.startsWith("/exams")) return true;
  if (pathname.startsWith("/dashboard")) return true;
  return false;
}
