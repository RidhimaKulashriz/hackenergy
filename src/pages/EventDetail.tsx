import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Clock,
  ExternalLink,
  Loader2
} from "lucide-react";
import { useEvent } from "@/hooks/useEvents";
import { useTeams } from "@/hooks/useTeams";
import { format } from "date-fns";
import { useState } from "react";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";

export default function EventDetail() {
  const { slug } = useParams();
  const { event, loading } = useEvent(slug);
  const { teams } = useTeams(event?.id);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "upcoming":
        return "bg-primary text-primary-foreground";
      case "past":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main" className="flex-1">
        {/* Hero */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={event.cover_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Badge className={getStatusColor(event.status)}>
                {event.status.toUpperCase()}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-2">{event.title}</h1>
              <p className="text-xl text-muted-foreground">{event.tagline || event.description}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="teams">Teams</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="prizes">Prizes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>About This Event</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <p>{event.description}</p>
                      <h3>Tracks</h3>
                      <ul>
                        {event.tracks.map((track) => (
                          <li key={track}>{track}</li>
                        ))}
                      </ul>
                      <h3>Rules</h3>
                      <p>
                        Teams must consist of {event.team_size_min}-{event.team_size_max} members.
                        All code must be written during the event. Projects will be judged on
                        innovation, technical execution, design, and presentation.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="teams">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Participating Teams ({teams.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {teams.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No teams have registered yet. Be the first to create a team!
                        </p>
                      ) : (
                        <div className="grid gap-4">
                          {teams.map((team) => (
                            <div key={team.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                              <h3 className="font-semibold">{team.name}</h3>
                              {team.tagline && (
                                <p className="text-sm text-muted-foreground mt-1">{team.tagline}</p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{team.track}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Event Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-32 text-sm text-muted-foreground">
                          {format(new Date(event.start_at), "MMM dd, HH:mm")}
                        </div>
                        <div>
                          <p className="font-semibold">Opening Ceremony</p>
                          <p className="text-sm text-muted-foreground">Kickoff & team formation</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-32 text-sm text-muted-foreground">
                          {format(new Date(event.end_at), "MMM dd, HH:mm")}
                        </div>
                        <div>
                          <p className="font-semibold">Final Presentations</p>
                          <p className="text-sm text-muted-foreground">Demo your projects</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="prizes">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Prizes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-accent/50 bg-accent/5">
                          <div>
                            <p className="font-semibold">🥇 First Place</p>
                            <p className="text-sm text-muted-foreground">Grand Champion</p>
                          </div>
                          <p className="text-2xl font-bold text-accent">$15,000</p>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                          <div>
                            <p className="font-semibold">🥈 Second Place</p>
                            <p className="text-sm text-muted-foreground">Runner Up</p>
                          </div>
                          <p className="text-xl font-bold">$10,000</p>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                          <div>
                            <p className="font-semibold">🥉 Third Place</p>
                            <p className="text-sm text-muted-foreground">Bronze Medal</p>
                          </div>
                          <p className="text-xl font-bold">$7,500</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">
                        {format(new Date(event.start_at), "MMM dd, yyyy")} -{" "}
                        {format(new Date(event.end_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        {event.is_virtual ? "Virtual Event" : event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Team Size</p>
                      <p className="text-muted-foreground">
                        {event.team_size_min}-{event.team_size_max} members
                      </p>
                    </div>
                  </div>

                  {event.prize_pool && (
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Prize Pool</p>
                        <p className="text-accent font-semibold">{event.prize_pool}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Registration Deadline</p>
                      <p className="text-muted-foreground">
                        {format(new Date(event.registration_deadline), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="glass border-primary/50">
                <CardContent className="pt-6">
                  {event.status === "upcoming" && (
                    <>
                      <Button className="w-full mb-3" size="lg">
                        Register Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        Join Waitlist
                      </Button>
                    </>
                  )}
                  {event.status === "active" && (
                    <>
                      <Button className="w-full mb-3" size="lg" onClick={() => setShowCreateTeam(true)}>
                        Create Team
                      </Button>
                    </>
                  )}
                  {event.status === "past" && (
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CreateTeamDialog
        open={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        eventId={event.id}
        tracks={event.tracks}
      />
    </div>
  );
}
