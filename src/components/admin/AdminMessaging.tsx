import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Radio } from "lucide-react";

export function AdminMessaging() {
  const { user } = useAuth();
  const [messageType, setMessageType] = useState<"broadcast" | "direct">("broadcast");
  const [message, setMessage] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch teams for direct messaging
  useEffect(() => {
    const fetchTeams = async () => {
      const { data: events } = await supabase
        .from('events')
        .select('id')
        .eq('organizer_id', user?.id);

      if (events && events.length > 0) {
        const eventIds = events.map(e => e.id);
        const { data: teamsData } = await supabase
          .from('teams')
          .select('id, name, event_id')
          .in('event_id', eventIds);

        if (teamsData) {
          setTeams(teamsData);
        }
      }
    };

    if (user) {
      fetchTeams();
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (messageType === "direct" && !selectedTeamId) {
      toast({
        title: "Error",
        description: "Please select a team",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('admin_messages')
      .insert({
        admin_id: user.id,
        message: message.trim(),
        is_broadcast: messageType === "broadcast",
        team_id: messageType === "direct" ? selectedTeamId : null,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: messageType === "broadcast" 
          ? "Broadcast sent to all teams" 
          : "Message sent to team",
      });
      setMessage("");
      setSelectedTeamId("");
    }

    setLoading(false);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Admin Messaging
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Message Type</Label>
          <RadioGroup
            value={messageType}
            onValueChange={(value) => setMessageType(value as "broadcast" | "direct")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="broadcast" id="broadcast" />
              <Label htmlFor="broadcast" className="flex items-center gap-2 cursor-pointer">
                <Radio className="h-4 w-4" />
                Broadcast to All Teams
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct" className="flex items-center gap-2 cursor-pointer">
                <MessageSquare className="h-4 w-4" />
                Message Specific Team
              </Label>
            </div>
          </RadioGroup>
        </div>

        {messageType === "direct" && (
          <div className="space-y-2">
            <Label htmlFor="team-select">Select Team</Label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger id="team-select">
                <SelectValue placeholder="Choose a team..." />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder={
              messageType === "broadcast"
                ? "This message will be sent as a notification to all teams..."
                : "This message will be sent to the selected team..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          className="w-full"
          size="lg"
        >
          {loading ? "Sending..." : messageType === "broadcast" ? "Send Broadcast" : "Send Message"}
        </Button>

        <p className="text-xs text-muted-foreground">
          {messageType === "broadcast"
            ? "All team members will receive this as a notification"
            : "Only members of the selected team will receive this notification"}
        </p>
      </CardContent>
    </Card>
  );
}
