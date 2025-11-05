import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  Users, 
  Trophy, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useMyTeams } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const { events, loading: eventsLoading } = useEvents();
  const { teams, loading: teamsLoading } = useMyTeams();

  const activeEvent = events.find((e) => e.status === "active");
  const myTeam = teams[0];
  
  // Mock progress for now
  const progress = {
    tasksCompleted: 8,
    tasksTotal: 12,
    daysLeft: activeEvent ? Math.ceil((new Date(activeEvent.end_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
    submissionDeadline: activeEvent ? new Date(activeEvent.end_at) : new Date(),
  };

  const progressPercent = (progress.tasksCompleted / progress.tasksTotal) * 100;

  const loading = eventsLoading || teamsLoading;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main" className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">Participant Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and manage your teams</p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Active Event Progress */}
        {!loading && activeEvent && myTeam && (
          <Card className="glass mb-8 border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{activeEvent.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Active Event
                  </p>
                </div>
                <Badge className="bg-success text-success-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {progress.daysLeft} days left
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Project Progress</span>
                  <span className="font-medium">
                    {progress.tasksCompleted}/{progress.tasksTotal} tasks
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Team</p>
                  <p className="font-semibold">{myTeam.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Track</p>
                  <p className="font-semibold">{myTeam.track}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="font-semibold">{myTeam.memberCount || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Submission</p>
                  <p className="font-semibold text-warning">Pending</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild>
                  <Link to={`/events/${activeEvent.slug}/teams/${myTeam.id}`}>
                    Go to Team Workspace
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/events/${activeEvent.slug}`}>View Event Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-hover cursor-pointer">
            <Link to="/events">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Browse Events</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Find your next challenge
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="glass-hover cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>Create Team</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Start a new project
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="glass-hover cursor-pointer">
            <Link to="/showcase">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <Trophy className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>View Showcase</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Get inspired
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* My Teams */}
        {!loading && (
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Teams</CardTitle>
              <Button size="sm" asChild>
                <Link to="/events">
                  <Plus className="h-4 w-4 mr-1" />
                  Join Event
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't joined any teams yet.</p>
                  <Button asChild className="mt-4">
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
                          {team.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {team.event?.title} • {team.memberCount} members
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/events/${team.event?.slug}/teams/${team.id}`}>
                          View Team
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Team created successfully</p>
                  <p className="text-sm text-muted-foreground">
                    EcoTrackers team formed for Sustainability Tech Challenge
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Submission deadline approaching</p>
                  <p className="text-sm text-muted-foreground">
                    2 days remaining to submit your project
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Today</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
