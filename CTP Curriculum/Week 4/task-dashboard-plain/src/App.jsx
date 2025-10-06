import { useState } from 'react'
import Header from './components/Header/Header'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import Statistics from './components/Statistics/Statistics'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Setup project', description: 'Initialize React app with Vite', status: 'completed', priority: 'high' },
    { id: 2, title: 'Create components', description: 'Build reusable UI components', status: 'in-progress', priority: 'high' },
    { id: 3, title: 'Add styling', description: 'Style components with CSS modules', status: 'pending', priority: 'medium' },
    { id: 4, title: 'Write tests', description: 'Add unit tests for components', status: 'pending', priority: 'low' }
  ])

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), status: 'pending' }])
  }

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <Statistics stats={stats} />
          <div className="content-grid">
            <div className="form-section">
              <h2>Add New Task</h2>
              <TaskForm onAddTask={addTask} />
            </div>
            <div className="tasks-section">
              <h2>Tasks</h2>
              <TaskList
                tasks={tasks}
                onUpdateStatus={updateTaskStatus}
                onDelete={deleteTask}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App