import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { webSocketService } from '@/services/websocket';

type UpdateType = 'new_submission' | 'judge_assigned' | 'event_updated' | 'announcement';

interface WebSocketData {
  submissionTitle?: string;
  judgeName?: string;
  eventName?: string;
  [key: string]: unknown;
}

interface Update {
  id: string;
  type: UpdateType;
  message: string;
  timestamp: Date;
  data?: WebSocketData;
}

export function RealTimeUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    // Subscribe to WebSocket events
    const unsubscribeNewSubmissions = webSocketService.subscribe('new_submission', (data) => {
      addUpdate({
        id: Date.now().toString(),
        type: 'new_submission',
        message: `New submission received: ${data.submissionTitle}`,
        timestamp: new Date(),
        data,
      });
    });

    const unsubscribeJudgeAssigned = webSocketService.subscribe('judge_assigned', (data) => {
      addUpdate({
        id: Date.now().toString(),
        type: 'judge_assigned',
        message: `Judge ${data.judgeName} assigned to submission`,
        timestamp: new Date(),
        data,
      });
    });

    const unsubscribeEventUpdated = webSocketService.subscribe('event_updated', (data) => {
      addUpdate({
        id: Date.now().toString(),
        type: 'event_updated',
        message: `Event updated: ${data.eventName}`,
        timestamp: new Date(),
        data,
      });
    });

    // Clean up subscriptions
    return () => {
      unsubscribeNewSubmissions();
      unsubscribeJudgeAssigned();
      unsubscribeEventUpdated();
    };
  }, []);

  const addUpdate = (update: Update) => {
    setUpdates((prev) => [update, ...prev].slice(0, 50)); // Keep last 50 updates
  };

  const getBadgeVariant = (type: UpdateType) => {
    switch (type) {
      case 'new_submission':
        return 'default';
      case 'judge_assigned':
        return 'secondary';
      case 'event_updated':
        return 'outline';
      case 'announcement':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Real-time Updates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto">
        {updates.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No updates yet. Activity will appear here in real-time.
          </div>
        ) : (
          <div className="space-y-2">
            {updates.map((update) => (
              <div key={update.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50">
                <div className="flex-shrink-0 mt-1">
                  <Badge variant={getBadgeVariant(update.type)} className="capitalize">
                    {update.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">{update.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(new Date(update.timestamp))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
