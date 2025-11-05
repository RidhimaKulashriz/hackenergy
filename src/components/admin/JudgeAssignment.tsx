import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJudges, useAssignJudge } from '@/hooks/useAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, UserCheck, UserX } from 'lucide-react';

export function JudgeAssignment() {
  const { data: judges = [], isLoading, error, refetch } = useJudges();
  const { mutate: assignJudge, isPending } = useAssignJudge();

  const handleAssignJudge = (judgeId: string, submissionId: string) => {
    assignJudge({ judgeId, submissionId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 space-y-2">
        <p>Error loading judge data</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  // Mock submissions data - in a real app, this would come from your API
  const mockSubmissions = [
    { id: 'sub1', name: 'AI-Powered Healthcare', status: 'pending' },
    { id: 'sub2', name: 'Blockchain Voting System', status: 'pending' },
    { id: 'sub3', name: 'Sustainable Energy Tracker', status: 'assigned' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Judge Assignment</h2>
        <Button disabled={isPending} onClick={() => refetch()}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span>Refresh</span>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Judges</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {judges.map((judge) => (
                  <TableRow key={judge.id}>
                    <TableCell className="font-medium">{judge.name}</TableCell>
                    <TableCell>
                      <Badge variant={judge.assignedSubmissions > 0 ? 'default' : 'secondary'}>
                        {judge.assignedSubmissions} submissions
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" disabled={judge.assignedSubmissions >= 5}>
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {judges.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                      No judges available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>
                      <Badge variant={submission.status === 'pending' ? 'outline' : 'default'}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" disabled={submission.status !== 'pending'}>
                        <UserX className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {mockSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                      No pending submissions
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Workload Balancing</h3>
        <p className="text-sm text-muted-foreground">
          {judges.length === 0
            ? 'Add judges to get started with workload balancing.'
            : judges.some((j) => j.assignedSubmissions === 0)
            ? 'Some judges have no assigned submissions. Consider redistributing the workload.'
            : 'Workload is currently balanced across all judges.'}
        </p>
      </div>
    </div>
  );
}
