import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Event } from "@/types";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  className?: string;
}

export function EventCard({ event, className = "" }: EventCardProps) {
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

  const daysUntil = Math.ceil((event.startAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const spotsLeft = event.capacity - 50; // Mock calculation

  return (
    <Card className={`glass-hover overflow-hidden ${className}`}>
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.coverImage}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <Badge className={getStatusColor(event.status)}>
            {event.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="space-y-2">
          <h3 className="text-xl font-bold line-clamp-1">{event.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{event.tagline}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(event.startAt, "MMM dd, yyyy")}</span>
            {event.status === "upcoming" && daysUntil > 0 && (
              <span className="text-primary">• {daysUntil}d away</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.isVirtual ? "Virtual" : event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {event.teamSizeMin}-{event.teamSizeMax} per team
              {event.status === "upcoming" && ` • ${spotsLeft} spots left`}
            </span>
          </div>

          {event.prizePool && (
            <div className="flex items-center gap-2 text-accent font-semibold">
              <Trophy className="h-4 w-4" />
              <span>{event.prizePool} in prizes</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {event.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/events/${event.slug}`}>
            {event.status === "active" ? "View Event" : "Learn More"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
