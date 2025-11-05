import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminDashboard() {
  // Dashboard data
  const stats = {
    totalEvents: 4,
    activeNow: 1,
    participants: 850,
    prizePool: 200000,
    engagement: 94
  };

  const events = [
    { id: '1', name: 'AI Innovation Summit 2025', status: 'upcoming', capacity: 200, participants: 180 },
    { id: '2', name: 'Web3 DeFi Hackathon', status: 'upcoming', capacity: 150, participants: 135 },
    { id: '3', name: 'Sustainability Tech Challenge', status: 'active', capacity: 180, participants: 175 },
    { id: '4', name: 'HealthTech Innovation Marathon', status: 'past', capacity: 120, participants: 120 }
  ];

  const [message, setMessage] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [messageType, setMessageType] = useState('broadcast');

  const handleSendMessage = () => {
    // In a real app, this would send the message to the backend
    console.log('Sending message:', { message, messageType, teamId: selectedTeam });
    setMessage('');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Events"
          value={stats.totalEvents}
          description={`${stats.activeNow} active now`}
          icon="calendar"
        />
        <StatCard 
          title="Participants"
          value={stats.participants}
          description="+12% from last month"
          icon="users"
        />
        <StatCard 
          title="Prize Pool"
          value={`$${stats.prizePool.toLocaleString()}`}
          description="Across all events"
          icon="dollar-sign"
        />
        <StatCard 
          title="Engagement"
          value={`${stats.engagement}%`}
          description="+8% from last month"
          icon="bar-chart"
        />
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Event Management</TabsTrigger>
          <TabsTrigger value="messaging">Admin Messaging</TabsTrigger>
          <TabsTrigger value="judges">Judge Assignment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="teams">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.status === 'active' ? 'bg-green-100 text-green-800' : 
                        event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </TableCell>
                    <TableCell>{event.capacity}</TableCell>
                    <TableCell>{event.participants}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Manage</Button>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="messaging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Message Type</Label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broadcast">Broadcast to All Teams</SelectItem>
                    <SelectItem value="team">Message Specific Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {messageType === 'team' && (
                <div className="space-y-2">
                  <Label>Select Team</Label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team1">Team Alpha</SelectItem>
                      <SelectItem value="team2">Team Beta</SelectItem>
                      <SelectItem value="team3">Team Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Message</Label>
                <Input 
                  placeholder="Type your message here..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <Button onClick={handleSendMessage}>Send {messageType === 'broadcast' ? 'Broadcast' : 'Message'}</Button>
              
              <p className="text-sm text-muted-foreground">
                {messageType === 'broadcast' 
                  ? 'All team members will receive this as a notification' 
                  : `Message will be sent to selected team`}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="judges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Judge Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Assign judges to submissions and balance workload</p>
              <Button className="mt-4">Manage Judges</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View detailed analytics and engagement metrics</p>
              <Button className="mt-4">View Reports</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View and manage all teams across events</p>
              <Button className="mt-4">View Teams</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, description, icon }: { title: string; value: string | number; description: string; icon: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'dollar-sign':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      case 'bar-chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
        );
      default: // calendar
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
