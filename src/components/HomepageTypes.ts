export interface HomePageProps {
  sessionsCount: number;
  templatesCount: number;
  templates: Array<{
    id: string;
    projectName: string;
    generatedTitle?: string;
    projectDescription: string;
    generatedDescription?: string;
    targetAudience: string;
    sessions: Array<{
      id: string;
      createdAt: string;
      name: string;
      email: string;
      messages: Array<{ timestamp: string; content: string; role: string }>;
      analyzedData?: Record<string, string>;
    }>;
  }>;
}
