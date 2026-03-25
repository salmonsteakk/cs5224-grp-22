export function buildUserExamKey(userId: string, examPaperId: string): string {
  return `${userId}#${examPaperId}`;
}
