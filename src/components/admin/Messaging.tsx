import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSendBroadcast, useSendTeamMessage, useTeams } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';

export function AdminMessaging() {
  const [message, setMessage] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [messageType, setMessageType] = useState<'broadcast' | 'team'>('broadcast');
  
  const { data: teams = [] } = useTeams();
  const { mutate: sendBroadcast, isPending: isSendingBroadcast } = useSendBroadcast();
  const { mutate: sendTeamMessage, isPending: isSendingTeamMessage } = useSendTeamMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (messageType === 'broadcast') {
      sendBroadcast(message);
    } else if (messageType === 'team' && selectedTeam) {
      sendTeamMessage({ teamId: selectedTeam, message });
    }
    
    setMessage('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message-type">Message Type</Label>
            <Select
              value={messageType}
              onValueChange={(value: 'broadcast' | 'team') => setMessageType(value)}
            >
              <SelectTrigger id="message-type">
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="broadcast">Broadcast to All Teams</SelectItem>
                <SelectItem value="team">Message Specific Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {messageType === 'team' && (
            <div className="space-y-2">
              <Label htmlFor="team">Select Team</Label>
              <Select
                value={selectedTeam}
                onValueChange={setSelectedTeam}
                disabled={teams.length === 0}
              >
                <SelectTrigger id="team">
                  <SelectValue placeholder={teams.length === 0 ? 'No teams available' : 'Select a team'} />
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
            <Input
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={
                isSendingBroadcast || 
                isSendingTeamMessage || 
                !message.trim() || 
                (messageType === 'team' && !selectedTeam)
              }
            >
              {(isSendingBroadcast || isSendingTeamMessage) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                `Send ${messageType === 'broadcast' ? 'Broadcast' : 'Message'}`
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            {messageType === 'broadcast'
              ? 'This message will be sent to all teams.'
              : selectedTeam
              ? `This message will be sent to ${teams.find(t => t.id === selectedTeam)?.name || 'the selected team'}.`
              : 'Please select a team to send a message.'}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
