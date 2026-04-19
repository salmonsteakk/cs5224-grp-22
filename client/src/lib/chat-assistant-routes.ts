/** Routes where the in-app study assistant (sidebar + nav toggle) is available. */
export function isAssistantRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/learn")) return true;
  if (pathname === "/practice") return true;
  if (/^\/practice\/[^/]+$/.test(pathname)) return true;
  if (pathname === "/exams") return true;
  if (pathname.startsWith("/exams/paper/")) return true;
  if (pathname.startsWith("/dashboard")) return true;
  return false;
}
