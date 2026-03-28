export function buildTopicKey(subjectId: string, topicId: string): string {
  return `${subjectId}#${topicId}`;
}

export function buildUserTopicKey(userId: string, subjectId: string, topicId: string): string {
  return `${userId}#${subjectId}#${topicId}`;
}
