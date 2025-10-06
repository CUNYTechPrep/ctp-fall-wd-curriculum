import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Task Dashboard</h1>
        <nav className="header-nav">
          <a href="#" className="nav-link active">Dashboard</a>
          <a href="#" className="nav-link">Projects</a>
          <a href="#" className="nav-link">Team</a>
          <a href="#" className="nav-link">Settings</a>
        </nav>
      </div>
    </header>
  )
}

export default Header