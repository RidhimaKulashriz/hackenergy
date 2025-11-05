import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AvatarSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

const PLANET_AVATARS = [
  { id: 'mercury', name: 'Mercury', color: 'from-gray-400 to-gray-600' },
  { id: 'venus', name: 'Venus', color: 'from-orange-300 to-yellow-500' },
  { id: 'earth', name: 'Earth', color: 'from-blue-400 to-green-500' },
  { id: 'mars', name: 'Mars', color: 'from-red-400 to-orange-600' },
  { id: 'jupiter', name: 'Jupiter', color: 'from-orange-300 to-amber-600' },
  { id: 'saturn', name: 'Saturn', color: 'from-yellow-200 to-amber-400' },
  { id: 'uranus', name: 'Uranus', color: 'from-cyan-300 to-blue-400' },
  { id: 'neptune', name: 'Neptune', color: 'from-blue-500 to-indigo-600' },
];

export function AvatarSelector({ open, onClose, onSelect, currentAvatar }: AvatarSelectorProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePlanetSelect = (planetId: string) => {
    setSelectedPlanet(planetId);
    // For now, use a placeholder URL - user will upload actual SVGs later
    const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${planetId}`;
    onSelect(avatarUrl);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onSelect(publicUrl);
      toast({
        title: "Success",
        description: "Avatar uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
          <DialogDescription>
            Select a planet avatar or upload your own image
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Planet Grid */}
          <div className="grid grid-cols-4 gap-4">
            {PLANET_AVATARS.map((planet) => (
              <button
                key={planet.id}
                onClick={() => handlePlanetSelect(planet.id)}
                className={`aspect-square rounded-full bg-gradient-to-br ${planet.color} hover:scale-110 transition-transform duration-200 ${
                  selectedPlanet === planet.id ? 'ring-4 ring-primary' : ''
                }`}
                title={planet.name}
              />
            ))}
          </div>

          {/* Upload Option */}
          <div className="space-y-2">
            <Label htmlFor="avatar-upload">Or upload your own</Label>
            <div className="flex gap-2">
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
