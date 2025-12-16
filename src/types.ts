export type Priority = 1 | 2 | 3 | 4;

export interface Project {
  id: string;
  name: string;
  color: string;
  order: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  content: string;
  description?: string;
  projectId: string;
  priority: Priority;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  order: number;
}

export type ViewType = 'inbox' | 'today' | 'upcoming' | 'project';

export interface AppState {
  tasks: Task[];
  projects: Project[];
  currentView: ViewType;
  currentProjectId?: string;
}
