import TaskCard from '../TaskCard/TaskCard'
import './TaskList.css'

function TaskList({ tasks, onUpdateStatus, onDelete }) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { 'in-progress': 0, 'pending': 1, 'completed': 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  return (
    <div className="task-list">
      {sortedTasks.length === 0 ? (
        <p className="empty-message">No tasks yet. Add one to get started!</p>
      ) : (
        sortedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}

export default TaskList