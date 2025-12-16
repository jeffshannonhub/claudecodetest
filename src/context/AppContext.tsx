import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Task, Project, ViewType } from '../types';
import { storage } from '../utils/storage';

interface AppContextType {
  tasks: Task[];
  projects: Project[];
  currentView: ViewType;
  currentProjectId?: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addProject: (name: string, color: string) => void;
  deleteProject: (id: string) => void;
  setCurrentView: (view: ViewType, projectId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROJECT_ID = 'inbox';

const getInitialProjects = (): Project[] => {
  const stored = storage.getProjects();
  if (stored.length > 0) return stored;

  return [
    {
      id: DEFAULT_PROJECT_ID,
      name: 'Inbox',
      color: '#808080',
      order: 0,
      createdAt: new Date(),
    },
  ];
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [currentView, setCurrentViewState] = useState<ViewType>('today');
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>();

  // Persist tasks to localStorage
  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  // Persist projects to localStorage
  useEffect(() => {
    storage.saveProjects(projects);
  }, [projects]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      order: tasks.length,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task
      )
    );
  };

  const addProject = (name: string, color: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      color,
      order: projects.length,
      createdAt: new Date(),
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const deleteProject = (id: string) => {
    if (id === DEFAULT_PROJECT_ID) return; // Can't delete inbox

    // Move tasks to inbox
    setTasks((prev) =>
      prev.map((task) =>
        task.projectId === id ? { ...task, projectId: DEFAULT_PROJECT_ID } : task
      )
    );

    setProjects((prev) => prev.filter((project) => project.id !== id));

    // If viewing deleted project, switch to today
    if (currentProjectId === id) {
      setCurrentView('today');
    }
  };

  const setCurrentView = (view: ViewType, projectId?: string) => {
    setCurrentViewState(view);
    setCurrentProjectId(projectId);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        projects,
        currentView,
        currentProjectId,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addProject,
        deleteProject,
        setCurrentView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
