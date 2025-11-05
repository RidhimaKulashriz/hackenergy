import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, Loader2 } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";

export default function Events() {
  const { events, loading } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusFilters: Array<{ value: string; label: string }> = [
    { value: "all", label: "All Events" },
    { value: "upcoming", label: "Upcoming" },
    { value: "active", label: "Active Now" },
    { value: "past", label: "Past" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main" className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">Discover Hackathons</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Find the perfect event to showcase your skills and collaborate with talented developers
          </p>
        </div>

        {/* Filters & Search */}
        <div className="glass rounded-lg p-6 mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search events"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium">Status:</span>
            {statusFilters.map((filter) => (
              <Badge
                key={filter.value}
                variant={statusFilter === filter.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Events Grid/List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={{
                  id: event.id,
                  title: event.title,
                  slug: event.slug,
                  description: event.description,
                  tagline: event.tagline || "",
                  coverImage: event.cover_image || undefined,
                  startAt: new Date(event.start_at),
                  endAt: new Date(event.end_at),
                  registrationDeadline: new Date(event.registration_deadline),
                  tracks: event.tracks,
                  capacity: event.capacity,
                  teamSizeMin: event.team_size_min,
                  teamSizeMax: event.team_size_max,
                  tags: [],
                  status: event.status as any,
                  prizePool: event.prize_pool || undefined,
                  location: event.location || undefined,
                  isVirtual: event.is_virtual,
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass rounded-lg">
            <p className="text-xl text-muted-foreground mb-4">No events found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
