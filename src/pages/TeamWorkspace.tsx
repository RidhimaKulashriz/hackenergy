import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Link as LinkIcon, 
  Upload, 
  MessageSquare,
  CheckCircle2,
  Send
} from "lucide-react";
import { mockTeams, mockEvents } from "@/mocks/data";
import { TeamChat } from "@/components/chat/TeamChat";

export default function TeamWorkspace() {
  const { teamId } = useParams();
  const team = mockTeams.find((t) => t.id === teamId);
  const event = mockEvents.find((e) => e.id === team?.eventId);

  if (!team || !event) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Team Not Found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const milestones = [
    { id: 1, title: "Project Setup", completed: true },
    { id: 2, title: "Core Features", completed: true },
    { id: 3, title: "UI Design", completed: false },
    { id: 4, title: "Testing", completed: false },
    { id: 5, title: "Final Demo", completed: false },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main" className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">{team.name}</h1>
              {team.tagline && (
                <p className="text-muted-foreground mt-1">{team.tagline}</p>
              )}
            </div>
            <Badge>{event.title}</Badge>
          </div>

          {/* Team Members */}
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <Button variant="outline" size="sm">
                Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {team.members.map((member) => (
                  <div key={member.userId} className="flex flex-col items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.userId}`} />
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm font-medium">Member</p>
                      {member.role === "leader" && (
                        <Badge variant="outline" className="text-xs">Leader</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="submit">Submit</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Track</p>
                    <p className="font-medium">{team.track}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Invite Code</p>
                    <code className="px-2 py-1 rounded bg-muted text-sm">
                      {team.inviteCode}
                    </code>
                  </div>
                  {team.repoLink && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Repository</p>
                      <a
                        href={team.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="h-4 w-4" />
                        {team.repoLink}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Add Repository Link
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Project Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button>Choose Files</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Team Chat</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TeamChat teamId={teamId || ''} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-3 p-4 rounded-lg border border-border"
                    >
                      <CheckCircle2
                        className={`h-5 w-5 ${
                          milestone.completed
                            ? "text-success"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          milestone.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Tab */}
          <TabsContent value="submit">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Submit Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Ready to submit? Make sure all requirements are met before submitting your project.
                </p>
                <Button size="lg" className="w-full" disabled>
                  Submit Project (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
