import type { Task, Project } from '../types';

const STORAGE_KEYS = {
  TASKS: 'todoist-tasks',
  PROJECTS: 'todoist-projects',
} as const;

// Helper to serialize dates
const serializeData = (data: any): string => {
  return JSON.stringify(data);
};

// Helper to deserialize dates
const deserializeData = <T>(data: string): T => {
  return JSON.parse(data, (key, value) => {
    // Convert date strings back to Date objects
    if (key === 'dueDate' || key === 'createdAt' || key === 'completedAt') {
      return value ? new Date(value) : undefined;
    }
    return value;
  });
};

export const storage = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) return [];
      return deserializeData<Task[]>(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, serializeData(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) return [];
      return deserializeData<Project[]>(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  },

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, serializeData(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  },
};
