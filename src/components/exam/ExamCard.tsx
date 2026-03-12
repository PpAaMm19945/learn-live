import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, CheckCircle, Clock } from 'lucide-react';

interface ExamCardProps {
  lessonId: string;
  status?: 'pending' | 'completed' | 'reviewed';
}

export function ExamCard({ lessonId, status = 'pending' }: ExamCardProps) {
  const navigate = useNavigate();

  const handleStartExam = () => {
    navigate(`/exam/${lessonId}`);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-primary/20 text-primary">Completed</Badge>;
      case 'reviewed':
        return <Badge variant="default" className="bg-primary/20 text-primary">Reviewed</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="text-muted-foreground"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Oral Exam</CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {status === 'pending'
            ? 'Test your understanding with an interactive AI oral exam.'
            : status === 'completed'
            ? 'Awaiting parent review.'
            : 'Assessment completed and reviewed.'}
        </p>

        {status === 'pending' && (
          <Button onClick={handleStartExam} className="w-full">
            <Mic className="w-4 h-4 mr-2" /> Start Exam
          </Button>
        )}
        {status === 'completed' && (
          <Button variant="outline" className="w-full" disabled>
            <CheckCircle className="w-4 h-4 mr-2" /> Completed
          </Button>
        )}
        {status === 'reviewed' && (
           <Button variant="secondary" className="w-full" disabled>
             <CheckCircle className="w-4 h-4 mr-2" /> Reviewed
           </Button>
        )}
      </CardContent>
    </Card>
  );
}
