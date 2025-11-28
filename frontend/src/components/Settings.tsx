import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, Key, Database, Bell, Shield } from "lucide-react"

export function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your analytics configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>Configure your analytics API endpoints and keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Base URL</label>
              <Input defaultValue="https://api.analytics.com/v1" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input type="password" defaultValue="••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Environment</label>
              <Select defaultValue="production">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save API Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Data Retention</span>
            </CardTitle>
            <CardDescription>Configure how long to store your analytics data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Raw Event Data</label>
              <Select defaultValue="90d">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aggregated Data</label>
              <Select defaultValue="2y">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="2y">2 Years</SelectItem>
                  <SelectItem value="5y">5 Years</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Current Storage Usage</span>
              <Badge variant="outline">2.4 GB</Badge>
            </div>
            <Button variant="outline">Update Retention Policy</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Configure alerts and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Notifications</label>
              <Input defaultValue="admin@company.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alert Threshold</label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Daily Summary)</SelectItem>
                  <SelectItem value="medium">Medium (Significant Changes)</SelectItem>
                  <SelectItem value="high">High (Critical Issues Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate Alerts</span>
                <Badge>Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Weekly Reports</span>
                <Badge>Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Performance Alerts</span>
                <Badge variant="outline">Disabled</Badge>
              </div>
            </div>
            <Button variant="outline">Update Notifications</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security & Privacy</span>
            </CardTitle>
            <CardDescription>Manage data privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Anonymization</label>
              <Select defaultValue="partial">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Anonymization</SelectItem>
                  <SelectItem value="partial">Partial (IP Masking)</SelectItem>
                  <SelectItem value="full">Full Anonymization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">GDPR Compliance</span>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cookie Consent</span>
                <Badge>Required</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Encryption</span>
                <Badge>Enabled</Badge>
              </div>
            </div>
            <Button variant="outline">Review Privacy Policy</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>Current status of your analytics integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Google Analytics</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Facebook Pixel</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Slack Webhook</span>
              <Badge variant="outline">Not Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}