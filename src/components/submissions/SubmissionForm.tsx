import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface SubmissionFormProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  eventId: string;
}

export function SubmissionForm({ open, onClose, teamId, eventId }: SubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repoLink: "",
    demoLink: "",
    videoLink: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validate total size (100MB limit)
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 100 * 1024 * 1024) {
      toast({
        title: "Files too large",
        description: "Total file size must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setFiles(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create submission
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          team_id: teamId,
          event_id: eventId,
          title: formData.title,
          description: formData.description,
          repo_link: formData.repoLink || null,
          demo_link: formData.demoLink || null,
          video_link: formData.videoLink || null,
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Upload files if any
      if (files.length > 0) {
        setUploading(true);
        const uploadPromises = files.map(async (file) => {
          const fileName = `${submission.id}/${Date.now()}-${file.name}`;
          const { error } = await supabase.storage
            .from('submissions')
            .upload(fileName, file);

          if (error) throw error;
        });

        await Promise.all(uploadPromises);
        setUploading(false);
      }

      toast({
        title: "Success",
        description: "Submission created successfully!",
      });

      onClose();
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repoLink">Repository URL</Label>
            <Input
              id="repoLink"
              type="url"
              value={formData.repoLink}
              onChange={(e) => setFormData({ ...formData, repoLink: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demoLink">Demo URL</Label>
            <Input
              id="demoLink"
              type="url"
              value={formData.demoLink}
              onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoLink">Video URL (YouTube/Vimeo)</Label>
            <Input
              id="videoLink"
              type="url"
              value={formData.videoLink}
              onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Additional Files (Max 100MB total)</Label>
            <div className="flex gap-2">
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileSelect}
                accept="image/*,video/*,.pdf,.zip"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById('files')?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {files.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {uploading ? "Uploading..." : loading ? "Submitting..." : "Submit Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
