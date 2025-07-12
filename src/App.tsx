import { TodoProvider } from './app/TodoContext';
import { Board } from './features/board';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <div className="app-container">
        <Board />
      </div>
    </TodoProvider>
  );
}

export default App;
