import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, ExternalLink, Github, Loader2 } from "lucide-react";
import { useSubmissions } from "@/hooks/useSubmissions";

export default function Showcase() {
  const { submissions, loading } = useSubmissions();

  // Mock winners for display (in production, you'd filter by awards/scores)
  const winners = [
    {
      id: 1,
      position: "1st Place",
      project: "CarbonLens - Personal Carbon Tracker",
      team: "EcoTrackers",
      event: "Sustainability Tech Challenge",
      description: "An AI-powered mobile app that helps individuals track and reduce their carbon footprint through daily habit monitoring.",
      prize: "$15,000",
      tags: ["AI", "Sustainability", "Mobile"],
      demoUrl: "https://demo.example.com",
      repoUrl: "https://github.com/example/carbonlens",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600",
    },
    {
      id: 2,
      position: "2nd Place",
      project: "MediConnect - Telemedicine Platform",
      team: "HealthTech Heroes",
      event: "HealthTech Innovation Marathon",
      description: "A secure telemedicine platform connecting patients with healthcare providers through video consultations.",
      prize: "$10,000",
      tags: ["Healthcare", "WebRTC", "Security"],
      demoUrl: "https://demo.example.com",
      repoUrl: "https://github.com/example/mediconnect",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600",
    },
    {
      id: 3,
      position: "3rd Place",
      project: "DeFi Wallet Pro",
      team: "Blockchain Builders",
      event: "Web3 DeFi Hackathon",
      description: "A user-friendly DeFi wallet with advanced portfolio tracking and cross-chain swaps.",
      prize: "$7,500",
      tags: ["Web3", "Blockchain", "DeFi"],
      demoUrl: "https://demo.example.com",
      repoUrl: "https://github.com/example/defi-wallet",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600",
    },
  ];

  const getPositionColor = (position: string) => {
    if (position.includes("1st")) return "bg-accent text-accent-foreground";
    if (position.includes("2nd")) return "bg-muted text-muted-foreground";
    if (position.includes("3rd")) return "bg-secondary text-secondary-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main" className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm mb-4">
            <Trophy className="h-4 w-4 text-accent" />
            <span>Winners Gallery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">Project Showcase</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore winning projects from our hackathons and get inspired for your next build
          </p>
        </div>

        {/* Winners */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : submissions.length > 0 ? (
          <div className="space-y-8">
            {submissions.slice(0, 10).map((submission, index) => (
              <Card 
                key={submission.id} 
                className="glass-hover overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600"
                      alt={submission.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge>
                        <Trophy className="h-3 w-3 mr-1" />
                        Submission
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-2xl mb-2">{submission.title}</CardTitle>
                      </CardHeader>

                      <CardContent className="p-0 space-y-4">
                        <p className="text-muted-foreground">{submission.description}</p>
                      </CardContent>
                    </div>

                    <div className="flex gap-2 mt-6">
                      {submission.demo_link && (
                        <Button asChild>
                          <a
                            href={submission.demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Demo
                          </a>
                        </Button>
                      )}
                      {submission.repo_link && (
                        <Button variant="outline" asChild>
                          <a
                            href={submission.repo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {winners.map((winner, index) => (
            <Card 
              key={winner.id} 
              className="glass-hover overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={winner.image}
                    alt={winner.project}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getPositionColor(winner.position)}>
                      <Trophy className="h-3 w-3 mr-1" />
                      {winner.position}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl mb-2">{winner.project}</CardTitle>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Team: {winner.team}</p>
                        <p>Event: {winner.event}</p>
                        <p className="text-accent font-semibold">Prize: {winner.prize}</p>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0 space-y-4">
                      <p className="text-muted-foreground">{winner.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {winner.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button asChild>
                      <a
                        href={winner.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Demo
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={winner.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
