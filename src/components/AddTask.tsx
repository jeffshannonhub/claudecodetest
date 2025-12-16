import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Priority } from '../types';
import { Plus, Calendar, Flag } from 'lucide-react';
import { parse, isValid } from 'date-fns';

interface AddTaskProps {
  defaultProjectId?: string;
}

export const AddTask: React.FC<AddTaskProps> = ({ defaultProjectId }) => {
  const { addTask, projects } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(4);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [dueDateInput, setDueDateInput] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || 'inbox');

  const parseDateInput = (input: string): Date | undefined => {
    const today = new Date();
    const lower = input.toLowerCase().trim();

    // Natural language parsing
    if (lower === 'today') {
      return today;
    } else if (lower === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    } else if (lower.match(/^in (\d+) days?$/)) {
      const match = lower.match(/^in (\d+) days?$/);
      if (match) {
        const days = parseInt(match[1]);
        const future = new Date(today);
        future.setDate(future.getDate() + days);
        return future;
      }
    }

    // Try parsing various date formats
    const formats = [
      'yyyy-MM-dd',
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'MMM d',
      'MMMM d',
      'd MMM',
      'd MMMM',
    ];

    for (const formatStr of formats) {
      try {
        const parsed = parse(input, formatStr, new Date());
        if (isValid(parsed)) {
          return parsed;
        }
      } catch {
        continue;
      }
    }

    return undefined;
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    addTask({
      content: content.trim(),
      description: description.trim() || undefined,
      projectId,
      priority,
      dueDate,
      completed: false,
    });

    // Reset form
    setContent('');
    setDescription('');
    setPriority(4);
    setDueDate(undefined);
    setDueDateInput('');
    setIsExpanded(false);
  };

  const handleDueDateChange = (value: string) => {
    setDueDateInput(value);
    const parsed = parseDateInput(value);
    setDueDate(parsed);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-todoist-red transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Add task</span>
      </button>
    );
  }

  return (
    <div className="px-4 py-3 border-2 border-gray-300 rounded-lg m-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === 'Escape') {
            setIsExpanded(false);
            setContent('');
            setDescription('');
          }
        }}
        placeholder="Task name"
        className="w-full text-base font-medium focus:outline-none mb-2"
        autoFocus
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full text-sm text-gray-600 focus:outline-none mb-3"
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={dueDateInput}
            onChange={(e) => handleDueDateChange(e.target.value)}
            placeholder="Due date (today, tomorrow, MMM d)"
            className="text-sm focus:outline-none w-48 px-2 py-1 border border-gray-200 rounded"
          />
        </div>

        <div className="flex items-center gap-1">
          <Flag className="w-4 h-4 text-gray-500" />
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value) as Priority)}
            className="text-sm focus:outline-none px-2 py-1 border border-gray-200 rounded"
          >
            <option value={4}>Priority 4</option>
            <option value={3}>Priority 3</option>
            <option value={2}>Priority 2</option>
            <option value={1}>Priority 1</option>
          </select>
        </div>

        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="text-sm focus:outline-none px-2 py-1 border border-gray-200 rounded"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          className="px-3 py-1.5 bg-todoist-red text-white rounded hover:bg-todoist-hover transition-colors text-sm font-medium"
        >
          Add task
        </button>
        <button
          onClick={() => {
            setIsExpanded(false);
            setContent('');
            setDescription('');
            setPriority(4);
            setDueDate(undefined);
            setDueDateInput('');
          }}
          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
