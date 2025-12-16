# Todoist Clone

A fully functional Todoist clone built with React, TypeScript, and Tailwind CSS. This web-based task management application replicates the core features of Todoist, providing a clean and intuitive interface for managing tasks and projects.

## Features

### Task Management
- **Create tasks** with quick add functionality
- **Edit tasks** inline by clicking on them
- **Delete tasks** with confirmation
- **Complete tasks** with visual checkbox feedback
- **Task descriptions** for additional context
- **Priority levels** (P1-P4) with color-coded indicators
- **Due dates** with natural language parsing

### Views
- **Inbox** - Default project for quick task capture
- **Today** - Shows tasks due today and overdue tasks
- **Upcoming** - Displays tasks grouped by due date
- **Projects** - Custom project views for organizing tasks

### Projects
- **Create projects** with randomized colors
- **Delete projects** (tasks move to Inbox)
- **Color-coded** project indicators
- **Project-specific** task views

### Smart Features
- **Natural language date parsing**
  - "today" - Sets due date to today
  - "tomorrow" - Sets due date to tomorrow
  - "in 3 days" - Sets due date 3 days from now
  - Standard date formats (MMM d, yyyy-MM-dd, etc.)
- **Local storage persistence** - All data saved automatically
- **Responsive design** - Works on desktop and mobile
- **Keyboard shortcuts** - Enter to save, Escape to cancel

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **date-fns** - Date manipulation
- **lucide-react** - Icon library

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd claudecodetest
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── AddTask.tsx      # Task creation component
│   ├── Sidebar.tsx      # Navigation and project list
│   ├── TaskItem.tsx     # Individual task display
│   └── TaskList.tsx     # Task list with filtering
├── context/
│   └── AppContext.tsx   # Global state management
├── utils/
│   └── storage.ts       # localStorage utilities
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component
├── main.tsx             # App entry point
└── index.css            # Global styles
```

## Usage

### Adding Tasks
1. Click "Add task" or press the plus button
2. Enter task name (required)
3. Optionally add description, due date, priority, and select project
4. Press Enter or click "Add task"

### Managing Tasks
- **Complete**: Click the checkbox
- **Edit**: Click on the task text
- **Delete**: Hover and click the trash icon

### Creating Projects
1. Click the "+" next to "Projects" in the sidebar
2. Enter project name
3. Press Enter or click away

### Setting Due Dates
Use natural language in the due date field:
- "today"
- "tomorrow"
- "in 5 days"
- "Jan 15"
- "2024-12-25"

### Priority Levels
- **P1** (Red) - Urgent
- **P2** (Orange) - High
- **P3** (Blue) - Medium
- **P4** (Gray) - Low (default)

## Data Persistence

All data is stored in the browser's localStorage:
- Tasks persist across sessions
- Projects persist across sessions
- Data is stored per browser/device

To clear all data, open browser console and run:
```javascript
localStorage.clear()
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
