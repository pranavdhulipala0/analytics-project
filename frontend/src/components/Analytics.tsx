import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, TrendingUp, Users, Target, Clock } from "lucide-react"

const performanceData = [
  { date: "2024-01-01", pageViews: 2400, uniqueVisitors: 1200, bounceRate: 35, avgSessionTime: 120 },
  { date: "2024-01-02", pageViews: 1398, uniqueVisitors: 800, bounceRate: 42, avgSessionTime: 95 },
  { date: "2024-01-03", pageViews: 9800, uniqueVisitors: 4500, bounceRate: 28, avgSessionTime: 180 },
  { date: "2024-01-04", pageViews: 3908, uniqueVisitors: 2100, bounceRate: 38, avgSessionTime: 145 },
  { date: "2024-01-05", pageViews: 4800, uniqueVisitors: 2800, bounceRate: 32, avgSessionTime: 165 },
  { date: "2024-01-06", pageViews: 3800, uniqueVisitors: 2200, bounceRate: 45, avgSessionTime: 110 },
  { date: "2024-01-07", pageViews: 4300, uniqueVisitors: 2600, bounceRate: 29, avgSessionTime: 175 },
]

const conversionData = [
  { funnel: "Landing", visitors: 10000, conversions: 8500 },
  { funnel: "Signup", visitors: 8500, conversions: 5200 },
  { funnel: "Trial", visitors: 5200, conversions: 3100 },
  { funnel: "Purchase", visitors: 3100, conversions: 1250 },
]

const topPages = [
  { page: "/dashboard", views: 4521, engagement: "4.2min" },
  { page: "/analytics", views: 3214, engagement: "3.8min" },
  { page: "/reports", views: 2890, engagement: "5.1min" },
  { page: "/settings", views: 1876, engagement: "2.3min" },
  { page: "/profile", views: 1456, engagement: "3.2min" },
]

export function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Deep insights into user behavior and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
              <SelectItem value="90d">Last 90d</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28,439</div>
            <p className="text-xs text-muted-foreground">+12.5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16,200</div>
            <p className="text-xs text-muted-foreground">+8.2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 45s</div>
            <p className="text-xs text-muted-foreground">-5.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Trends</CardTitle>
            <CardDescription>Page views and unique visitors over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="uniqueVisitors" 
                  stackId="2" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>User journey through conversion stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="funnel" type="category" />
                <Tooltip />
                <Bar dataKey="conversions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate & Session Time</CardTitle>
            <CardDescription>User engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="bounceRate" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgSessionTime" 
                  stroke="#00ff00" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-muted-foreground">{page.views} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{page.engagement}</p>
                    <p className="text-xs text-muted-foreground">avg. time</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}