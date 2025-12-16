import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TaskItem } from './TaskItem';
import { AddTask } from './AddTask';
import { isToday, isBefore, startOfDay, format, isSameDay, addDays } from 'date-fns';

export const TaskList: React.FC = () => {
  const { tasks, currentView, currentProjectId, projects } = useApp();

  const { title, filteredTasks } = useMemo(() => {
    let filtered = tasks.filter((task) => !task.completed);
    let viewTitle = '';

    switch (currentView) {
      case 'inbox':
        filtered = filtered.filter((task) => task.projectId === 'inbox');
        viewTitle = 'Inbox';
        break;

      case 'today':
        filtered = filtered.filter((task) => {
          if (!task.dueDate) return false;
          return isToday(task.dueDate) || isBefore(task.dueDate, startOfDay(new Date()));
        });
        viewTitle = 'Today';
        break;

      case 'upcoming':
        filtered = filtered.filter((task) => task.dueDate);
        filtered.sort((a, b) => {
          if (!a.dueDate || !b.dueDate) return 0;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
        viewTitle = 'Upcoming';
        break;

      case 'project':
        if (currentProjectId) {
          filtered = filtered.filter((task) => task.projectId === currentProjectId);
          const project = projects.find((p) => p.id === currentProjectId);
          viewTitle = project?.name || 'Project';
        }
        break;

      default:
        viewTitle = 'Tasks';
    }

    return { title: viewTitle, filteredTasks: filtered };
  }, [tasks, currentView, currentProjectId, projects]);

  // Group tasks by date for upcoming view
  const groupedTasks = useMemo(() => {
    if (currentView !== 'upcoming') return null;

    const groups: { [key: string]: typeof filteredTasks } = {};
    const today = new Date();

    filteredTasks.forEach((task) => {
      if (!task.dueDate) return;

      let groupKey: string;
      if (isToday(task.dueDate)) {
        groupKey = 'Today';
      } else if (isSameDay(task.dueDate, addDays(today, 1))) {
        groupKey = 'Tomorrow';
      } else if (isBefore(task.dueDate, today)) {
        groupKey = 'Overdue';
      } else {
        groupKey = format(task.dueDate, 'EEEE, MMM d');
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    // Sort groups: Overdue, Today, Tomorrow, then future dates
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const order = ['Overdue', 'Today', 'Tomorrow'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });

    return sortedKeys.map((key) => ({ date: key, tasks: groups[key] }));
  }, [currentView, filteredTasks]);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        <AddTask defaultProjectId={currentView === 'project' ? currentProjectId : undefined} />

        <div className="mt-4">
          {currentView === 'upcoming' && groupedTasks ? (
            groupedTasks.map(({ date, tasks: groupTasks }) => (
              <div key={date} className="mb-6">
                <h2 className="text-sm font-semibold text-gray-600 mb-2 px-4">{date}</h2>
                <div className="space-y-0">
                  {groupTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-0">
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No tasks yet</p>
              <p className="text-sm mt-2">Add a task to get started</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
