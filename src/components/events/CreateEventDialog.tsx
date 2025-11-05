import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateEventDialog({ open, onClose }: CreateEventDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    isVirtual: true,
    location: "",
    startAt: "",
    endAt: "",
    registrationDeadline: "",
    capacity: 100,
    teamSizeMin: 1,
    teamSizeMax: 6,
    prizePool: "",
    tracks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Parse tracks
      const tracks = formData.tracks
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          slug,
          tagline: formData.tagline,
          description: formData.description,
          is_virtual: formData.isVirtual,
          location: formData.location || null,
          start_at: formData.startAt,
          end_at: formData.endAt,
          registration_deadline: formData.registrationDeadline,
          capacity: formData.capacity,
          team_size_min: formData.teamSizeMin,
          team_size_max: formData.teamSizeMax,
          prize_pool: formData.prizePool || null,
          tracks,
          organizer_id: user.id,
          status: 'upcoming',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully!",
      });

      onClose();
      navigate(`/events/${data.slug}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isVirtual"
              checked={formData.isVirtual}
              onCheckedChange={(checked) => setFormData({ ...formData, isVirtual: checked })}
            />
            <Label htmlFor="isVirtual">Virtual Event</Label>
          </div>

          {!formData.isVirtual && (
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required={!formData.isVirtual}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startAt">Start Date *</Label>
              <Input
                id="startAt"
                type="datetime-local"
                value={formData.startAt}
                onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endAt">End Date *</Label>
              <Input
                id="endAt"
                type="datetime-local"
                value={formData.endAt}
                onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
            <Input
              id="registrationDeadline"
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSizeMin">Min Team Size *</Label>
              <Input
                id="teamSizeMin"
                type="number"
                value={formData.teamSizeMin}
                onChange={(e) => setFormData({ ...formData, teamSizeMin: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSizeMax">Max Team Size *</Label>
              <Input
                id="teamSizeMax"
                type="number"
                value={formData.teamSizeMax}
                onChange={(e) => setFormData({ ...formData, teamSizeMax: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prizePool">Prize Pool</Label>
            <Input
              id="prizePool"
              value={formData.prizePool}
              onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
              placeholder="$10,000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tracks">Tracks (comma-separated) *</Label>
            <Input
              id="tracks"
              value={formData.tracks}
              onChange={(e) => setFormData({ ...formData, tracks: e.target.value })}
              placeholder="AI/ML, Web3, Healthcare"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
