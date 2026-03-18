import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IconMessagePlus, IconLoader2 } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('General');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast({ title: 'Description is required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          description,
          page_url: location.pathname + location.search,
        }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to submit feedback');

      toast({ title: 'Feedback sent!', description: 'Thank you for helping us improve.' });
      setOpen(false);
      setDescription('');
      setType('General');
    } catch (error: any) {
      toast({ title: 'Failed to send feedback', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 transition-transform hover:scale-105"
        >
          <IconMessagePlus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve Learn Live! Let us know if you found a bug, have a feature request, or just want to share your thoughts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bug Report">Bug Report</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
                <SelectItem value="Content Feedback">Content Feedback</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's on your mind? (If reporting a bug, please include what you see on the screen)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Feedback
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
