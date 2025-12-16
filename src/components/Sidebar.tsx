import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Inbox, Calendar, CalendarDays, Plus, Hash, Trash2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { projects, currentView, currentProjectId, setCurrentView, addProject, deleteProject } = useApp();
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const colors = ['#db4c3f', '#ff9933', '#fad000', '#7ecc49', '#299438', '#6accbc', '#158fad', '#14aaf5', '#96c3eb', '#4073ff', '#884dff', '#af38eb', '#eb96eb', '#e05194', '#ff8d85', '#808080'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addProject(newProjectName.trim(), randomColor);
      setNewProjectName('');
      setShowAddProject(false);
    }
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project? Tasks will be moved to Inbox.')) {
      deleteProject(projectId);
    }
  };

  return (
    <aside className="w-72 bg-gray-100 h-screen border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-todoist-red">Todoist</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setCurrentView('inbox')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors ${
                currentView === 'inbox' ? 'bg-gray-200 font-medium' : ''
              }`}
            >
              <Inbox className="w-5 h-5" />
              <span>Inbox</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => setCurrentView('today')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors ${
                currentView === 'today' ? 'bg-gray-200 font-medium' : ''
              }`}
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span>Today</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => setCurrentView('upcoming')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors ${
                currentView === 'upcoming' ? 'bg-gray-200 font-medium' : ''
              }`}
            >
              <CalendarDays className="w-5 h-5 text-purple-600" />
              <span>Upcoming</span>
            </button>
          </li>
        </ul>

        <div className="mt-6">
          <div className="flex items-center justify-between px-3 py-2">
            <h2 className="text-sm font-semibold text-gray-600">Projects</h2>
            <button
              onClick={() => setShowAddProject(true)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <ul className="space-y-1">
            {projects
              .filter((p) => p.id !== 'inbox')
              .map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() => setCurrentView('project', project.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors group ${
                      currentView === 'project' && currentProjectId === project.id
                        ? 'bg-gray-200 font-medium'
                        : ''
                    }`}
                  >
                    <Hash className="w-5 h-5" style={{ color: project.color }} />
                    <span className="flex-1 text-left">{project.name}</span>
                    <button
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </button>
                </li>
              ))}
          </ul>

          {showAddProject && (
            <div className="px-3 py-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddProject();
                  if (e.key === 'Escape') {
                    setShowAddProject(false);
                    setNewProjectName('');
                  }
                }}
                onBlur={handleAddProject}
                placeholder="Project name"
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-todoist-red"
                autoFocus
              />
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};
