import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

const eventsData = [
  {
    id: "1",
    event: "page_view",
    user: "user_123",
    timestamp: "2024-01-15 14:30:22",
    properties: { page: "/dashboard", source: "organic" },
    status: "processed"
  },
  {
    id: "2", 
    event: "click",
    user: "user_456",
    timestamp: "2024-01-15 14:28:15",
    properties: { element: "signup_button", campaign: "header" },
    status: "processed"
  },
  {
    id: "3",
    event: "conversion",
    user: "user_789",
    timestamp: "2024-01-15 14:25:45",
    properties: { value: 99.99, product: "premium_plan" },
    status: "processed"
  },
  {
    id: "4",
    event: "signup",
    user: "user_321",
    timestamp: "2024-01-15 14:20:10",
    properties: { method: "email", source: "landing_page" },
    status: "pending"
  },
  {
    id: "5",
    event: "error",
    user: "user_654", 
    timestamp: "2024-01-15 14:15:33",
    properties: { error_code: "404", page: "/missing" },
    status: "failed"
  },
]

export function EventsTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-100 text-green-800">Processed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">Recent event data and activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search events..." className="pl-10 w-64" />
          </div>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
          <CardDescription>Real-time events from your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of recent events.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventsData.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.event}</Badge>
                  </TableCell>
                  <TableCell>{event.user}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {event.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {JSON.stringify(event.properties)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-sm text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">98.5%</div>
            <p className="text-sm text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45ms</div>
            <p className="text-sm text-muted-foreground">Processing time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}