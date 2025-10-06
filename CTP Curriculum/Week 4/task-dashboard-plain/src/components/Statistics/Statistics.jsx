import './Statistics.css'

function Statistics({ stats }) {
  return (
    <div className="statistics">
      <div className="stat-card">
        <h3 className="stat-value">{stats.total}</h3>
        <p className="stat-label">Total Tasks</p>
      </div>
      <div className="stat-card completed">
        <h3 className="stat-value">{stats.completed}</h3>
        <p className="stat-label">Completed</p>
      </div>
      <div className="stat-card in-progress">
        <h3 className="stat-value">{stats.inProgress}</h3>
        <p className="stat-label">In Progress</p>
      </div>
      <div className="stat-card pending">
        <h3 className="stat-value">{stats.pending}</h3>
        <p className="stat-label">Pending</p>
      </div>
    </div>
  )
}

export default Statistics