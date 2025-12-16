import React, { useState } from 'react';
import type { Task, Priority } from '../types';
import { useApp } from '../context/AppContext';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Flag, Trash2, Calendar } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, toggleTaskComplete } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      updateTask(task.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTask(task.id);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 1:
        return 'text-red-600 border-red-600';
      case 2:
        return 'text-orange-500 border-orange-500';
      case 3:
        return 'text-blue-500 border-blue-500';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return null;

    if (isToday(date)) {
      return <span className="text-green-600">Today</span>;
    } else if (isTomorrow(date)) {
      return <span className="text-orange-500">Tomorrow</span>;
    } else if (isPast(date)) {
      return <span className="text-red-600">{format(date, 'MMM d')}</span>;
    } else {
      return <span className="text-gray-600">{format(date, 'MMM d')}</span>;
    }
  };

  return (
    <div className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100">
      <button
        onClick={() => toggleTaskComplete(task.id)}
        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${
          task.completed
            ? 'bg-gray-400 border-gray-400'
            : `${getPriorityColor(task.priority)} hover:border-gray-600`
        }`}
      >
        {task.completed && (
          <svg
            className="w-full h-full text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') {
                setEditContent(task.content);
                setIsEditing(false);
              }
            }}
            onBlur={handleSaveEdit}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-todoist-red"
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={`cursor-text ${task.completed ? 'line-through text-gray-400' : ''}`}
          >
            {task.content}
          </div>
        )}

        {task.description && (
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="w-3 h-3" />
              {formatDueDate(task.dueDate)}
            </div>
          )}

          {task.priority !== 4 && (
            <div className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
              <Flag className="w-3 h-3 fill-current" />
              <span className="text-xs">P{task.priority}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
