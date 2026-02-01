import { useState } from 'react';
import { ComplaintCategory, ComplaintPriority } from '@/types/complaint';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NewComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (complaint: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
  }) => void;
}

export function NewComplaintDialog({ open, onOpenChange, onSubmit }: NewComplaintDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('other');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({ title, description, category, priority });
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('other');
    setPriority('medium');
    setIsSubmitting(false);
    onOpenChange(false);
    
    toast.success('Complaint submitted successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit New Complaint</DialogTitle>
          <DialogDescription>
            Describe your issue and we'll get it resolved as soon as possible.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ComplaintCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="cleanliness">Cleanliness</SelectItem>
                  <SelectItem value="internet">Internet</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as ComplaintPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
