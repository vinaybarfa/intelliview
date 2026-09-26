import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-shell__main">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="app-shell__content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout