import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Calendar, 
  Users, 
  Trophy, 
  TrendingUp,
  Settings,
  Download
} from "lucide-react";
import { mockEvents } from "@/mocks/data";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { exportToCSV } from "@/utils/exportCSV";
import { toast } from "@/hooks/use-toast";
import { AdminMessaging } from "@/components/admin/AdminMessaging";

export default function Admin() {
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    manage: false,
    view: false,
    judges: false,
    reports: false,
    teams: false
  });

  const stats = {
    totalEvents: mockEvents.length,
    activeEvents: mockEvents.filter((e) => e.status === "active").length,
    totalParticipants: 850,
    totalPrizes: "$200,000",
  };

  const handleExportEvents = () => {
    const eventData = mockEvents.map(event => ({
      title: event.title,
      status: event.status,
      capacity: event.capacity,
      prizePool: event.prizePool || '',
      startDate: new Date(event.startAt).toISOString(),
    }));
    
    exportToCSV(eventData, 'events');
    toast({
      title: "Success",
      description: "Events exported to CSV",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main" className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">Admin Console</h1>
            <p className="text-muted-foreground">Manage events and monitor activity</p>
          </div>
          <div className="flex gap-2">
            <Button size="lg" variant="outline" onClick={handleExportEvents}>
              <Download className="h-5 w-5 mr-2" />
              Export Events
            </Button>
            <Button size="lg" onClick={() => setCreateEventOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        <CreateEventDialog 
          open={createEventOpen} 
          onClose={() => setCreateEventOpen(false)} 
        />

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeEvents} active now
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalParticipants}</div>
              <p className="text-xs text-success">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Prize Pool</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.totalPrizes}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">94%</div>
              <p className="text-xs text-success">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Events Management */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={
                            event.status === "active"
                              ? "bg-success text-success-foreground"
                              : event.status === "upcoming"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {event.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {event.capacity} capacity
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsLoading(prev => ({...prev, manage: true}));
                        // Simulate API call
                        setTimeout(() => {
                          setIsLoading(prev => ({...prev, manage: false}));
                          navigate(`/admin/events/${event.id}`);
                        }, 500);
                      }}
                      disabled={isLoading.manage}
                    >
                      <Settings className={`h-4 w-4 mr-2 ${isLoading.manage ? 'animate-spin' : ''}`} />
                      {isLoading.manage ? 'Loading...' : 'Manage'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsLoading(prev => ({...prev, view: true}));
                        // Simulate API call
                        setTimeout(() => {
                          setIsLoading(prev => ({...prev, view: false}));
                          navigate(`/events/${event.slug}`);
                        }, 500);
                      }}
                      disabled={isLoading.view}
                    >
                      {isLoading.view ? 'Loading...' : 'View'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Messaging */}
        <div className="mb-8">
          <AdminMessaging />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-hover cursor-pointer">
            <CardHeader>
              <CardTitle>Judge Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Assign judges to submissions and balance workload
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsLoading(prev => ({...prev, judges: true}));
                  // Simulate API call
                  setTimeout(() => {
                    setIsLoading(prev => ({...prev, judges: false}));
                    navigate('/admin/judges');
                  }, 500);
                }}
                disabled={isLoading.judges}
              >
                {isLoading.judges ? 'Loading...' : 'Manage Judges'}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-hover cursor-pointer">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View detailed analytics and engagement metrics
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsLoading(prev => ({...prev, reports: true}));
                  // Simulate API call
                  setTimeout(() => {
                    setIsLoading(prev => ({...prev, reports: false}));
                    navigate('/admin/analytics');
                  }, 500);
                }}
                disabled={isLoading.reports}
              >
                {isLoading.reports ? 'Loading...' : 'View Reports'}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-hover cursor-pointer">
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage all teams across events
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsLoading(prev => ({...prev, teams: true}));
                  // Simulate API call
                  setTimeout(() => {
                    setIsLoading(prev => ({...prev, teams: false}));
                    navigate('/admin/teams');
                  }, 500);
                }}
                disabled={isLoading.teams}
              >
                {isLoading.teams ? 'Loading...' : 'View Teams'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
