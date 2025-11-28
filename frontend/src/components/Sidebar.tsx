import { BarChart3, Database, Settings, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      id: "analytics",
      label: "Analytics", 
      icon: TrendingUp,
    },
    {
      id: "events",
      label: "Events",
      icon: Database,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 h-full shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-600">Event Reporting Dashboard</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}