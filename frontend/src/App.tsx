import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { Analytics } from './components/Analytics'
import { EventsTable } from './components/EventsTable'
import { Settings } from './components/Settings'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'analytics':
        return <Analytics />
      case 'events':
        return <EventsTable />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
