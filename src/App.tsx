import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <TaskList />
    </div>
  );
}

export default App;
