import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useTeamChat } from "@/hooks/useTeamChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TeamChatProps {
  teamId: string;
}

export function TeamChat({ teamId }: TeamChatProps) {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useTeamChat(teamId);
  const [inputMessage, setInputMessage] = useState("");
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user profiles for messages
  useEffect(() => {
    const userIds = [...new Set(messages.map((m) => m.user_id))];
    
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      if (data) {
        const profileMap = data.reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {} as Record<string, any>);
        setProfiles(profileMap);
      }
    };

    if (userIds.length > 0) {
      fetchProfiles();
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    
    await sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground py-8">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[400px] max-h-[600px] p-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const profile = profiles[message.user_id];
            const isCurrentUser = message.user_id === user?.id;
            const displayName = profile?.display_name || 'User';
            const initial = displayName[0]?.toUpperCase() || 'U';

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8">
                  {profile?.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={displayName} />
                  ) : (
                    <AvatarFallback>{initial}</AvatarFallback>
                  )}
                </Avatar>
                <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className={`text-sm font-medium ${isCurrentUser ? 'order-2' : ''}`}>
                      {isCurrentUser ? 'You' : displayName}
                    </p>
                    <p className={`text-xs text-muted-foreground ${isCurrentUser ? 'order-1' : ''}`}>
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg max-w-[70%] ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2 p-4 border-t border-border bg-card/50">
        <Input
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend} disabled={!inputMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
